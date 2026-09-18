import { setTimeout } from 'node:timers/promises';

export async function ensureLocalAccounts(
  client,
  credentials,
  { wait = setTimeout } = {},
) {
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      // Se consulta de nuevo tras un timeout: la creación pudo haberse confirmado.
      const { data: existing, error: listError } =
        await client.auth.admin.listUsers();
      if (listError) throw listError;
      for (const account of [
        {
          email: credentials.email,
          password: credentials.password,
          admin: true,
        },
        {
          email: credentials.unauthorizedEmail,
          password: credentials.unauthorizedPassword,
          admin: false,
        },
      ]) {
        const found = existing.users.find(
          (user) => user.email === account.email,
        );
        const { data, error } = found
          ? await client.auth.admin.updateUserById(found.id, {
              password: account.password,
              email_confirm: true,
            })
          : await client.auth.admin.createUser({
              email: account.email,
              password: account.password,
              email_confirm: true,
            });
        if (error) throw error;
        if (account.admin) {
          const { error: allowlistError } = await client
            .from('admin_users')
            .upsert({ user_id: data.user.id });
          if (allowlistError) throw allowlistError;
        }
      }
      return;
    } catch (error) {
      const transient =
        [408, 429, 500, 502, 503, 504].includes(error.status) ||
        [
          'request_timeout',
          'email_exists',
          'user_already_exists',
          'PGRST000',
          'PGRST001',
          'PGRST002',
        ].includes(error.code);
      if (!transient || attempt === 3) throw error;
      await wait(1000 * (attempt + 1));
    }
  }
}
