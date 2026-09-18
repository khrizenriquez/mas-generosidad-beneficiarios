// @vitest-environment node
import { expect, it, vi } from 'vitest';
import { ensureLocalAccounts } from './local-accounts.mjs';

it('recupera un timeout posterior a crear la cuenta sin duplicarla', async () => {
  const users = [];
  const createUser = vi.fn(async ({ email }) => {
    const user = { id: String(users.length + 1), email };
    users.push(user);
    return users.length === 1
      ? { error: Object.assign(new Error('Timeout ficticio'), { status: 504 }) }
      : { data: { user }, error: null };
  });
  const upsert = vi.fn(async () => ({ error: null }));
  const client = {
    auth: {
      admin: {
        listUsers: async () => ({ data: { users: [...users] }, error: null }),
        createUser,
        updateUserById: async (id) => ({
          data: { user: users.find((user) => user.id === id) },
          error: null,
        }),
      },
    },
    from: () => ({ upsert }),
  };
  const wait = vi.fn(async () => {});
  await ensureLocalAccounts(
    client,
    { email: 'admin@example.test', unauthorizedEmail: 'visitor@example.test' },
    { wait },
  );
  expect(createUser).toHaveBeenCalledTimes(2);
  expect(users).toHaveLength(2);
  expect(upsert).toHaveBeenCalledWith({ user_id: '1' });
  expect(wait).toHaveBeenCalledTimes(1);
});

it('no reintenta errores de autorización', async () => {
  const error = Object.assign(new Error('Acceso rechazado ficticio'), {
    status: 401,
  });
  const listUsers = vi.fn(async () => ({ error }));
  const wait = vi.fn();
  await expect(
    ensureLocalAccounts({ auth: { admin: { listUsers } } }, {}, { wait }),
  ).rejects.toBe(error);
  expect(listUsers).toHaveBeenCalledTimes(1);
  expect(wait).not.toHaveBeenCalled();
});
