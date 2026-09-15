begin;

create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions;

select plan(15);

insert into auth.users (id, email)
values
  ('92000000-0000-4000-8000-000000000001', 'admin-contract@example.test'),
  ('92000000-0000-4000-8000-000000000002', 'user-contract@example.test');

insert into public.admin_users (user_id)
values ('92000000-0000-4000-8000-000000000001');

insert into public.beneficiaries (id, code, status)
values ('93000000-0000-4000-8000-000000000001', 'MG-911', 'draft');

set local role authenticated;
set local request.jwt.claim.sub = '92000000-0000-4000-8000-000000000002';

select is(
  public.is_current_user_admin(),
  false,
  'Una cuenta fuera de la allowlist no es administradora'
);

select is_empty(
  $$select id from public.beneficiaries$$,
  'Una cuenta no autorizada no obtiene beneficiarios'
);

select is_empty(
  $$select user_id from public.admin_users$$,
  'Una cuenta no autorizada no obtiene la allowlist'
);

select throws_ok(
  $$insert into public.beneficiaries (code) values ('MG-913')$$,
  '42501',
  null,
  'Una cuenta no autorizada no puede crear beneficiarios'
);

select is_empty(
  $$update public.beneficiaries set full_name = 'Cambio prohibido' where code = 'MG-911' returning id$$,
  'Una cuenta no autorizada no puede modificar filas'
);

set local request.jwt.claim.sub = '92000000-0000-4000-8000-000000000001';

select is(
  public.is_current_user_admin(),
  true,
  'La cuenta incluida en la allowlist es administradora'
);

select lives_ok(
  $$insert into public.beneficiaries (id, code, status) values ('93000000-0000-4000-8000-000000000002', 'MG-912', 'draft')$$,
  'Una administradora puede crear un borrador incompleto'
);

select results_eq(
  $$select created_by from public.beneficiaries where code = 'MG-912'$$,
  $$values ('92000000-0000-4000-8000-000000000001'::uuid)$$,
  'La auditoría registra a la administradora creadora'
);

select lives_ok(
  $$update public.beneficiaries set full_name = 'Perfil administrativo ficticio' where code = 'MG-912'$$,
  'Una administradora puede editar un borrador'
);

select throws_ok(
  $$delete from public.beneficiaries where code = 'MG-912'$$,
  '42501',
  null,
  'Ni una administradora puede borrar definitivamente un beneficiario'
);

select throws_ok(
  $$update public.beneficiaries set status = 'published' where code = 'MG-911'$$,
  'P0001',
  null,
  'PostgreSQL rechaza publicar un perfil incompleto'
);

select lives_ok(
  $$update public.beneficiaries set
      full_name = 'Perfil completo ficticio',
      date_of_birth = '2015-01-01',
      school_grade = 'Grado ficticio',
      favorite_subject = 'Materia ficticia',
      hobby = 'Actividad ficticia',
      future_goal = 'Meta ficticia',
      public_story = 'Relato ficticio completo para validar publicación.',
      status = 'published'
    where code = 'MG-912'$$,
  'Una administradora puede publicar un perfil completo'
);

select ok(
  (select published_at is not null from public.beneficiaries where code = 'MG-912'),
  'La publicación completa registra published_at'
);

select lives_ok(
  $$insert into public.beneficiary_images (
      id,
      beneficiary_id,
      thumbnail_path,
      detail_path,
      sort_order,
      is_primary
    )
    values
      ('94000000-0000-4000-8000-000000000001', '93000000-0000-4000-8000-000000000002', 'contract/admin-1-thumbnail.webp', 'contract/admin-1-detail.webp', 0, true),
      ('94000000-0000-4000-8000-000000000002', '93000000-0000-4000-8000-000000000002', 'contract/admin-2-thumbnail.webp', 'contract/admin-2-detail.webp', 1, false),
      ('94000000-0000-4000-8000-000000000003', '93000000-0000-4000-8000-000000000002', 'contract/admin-3-thumbnail.webp', 'contract/admin-3-detail.webp', 2, false)$$,
  'Una administradora puede registrar tres imágenes'
);

select throws_ok(
  $$insert into public.beneficiary_images (
      id,
      beneficiary_id,
      thumbnail_path,
      detail_path,
      sort_order,
      is_primary
    )
    values (
      '94000000-0000-4000-8000-000000000004',
      '93000000-0000-4000-8000-000000000002',
      'contract/admin-4-thumbnail.webp',
      'contract/admin-4-detail.webp',
      2,
      false
    )$$,
  'P0001',
  null,
  'PostgreSQL rechaza una cuarta imagen'
);

reset role;

select * from finish();
rollback;
