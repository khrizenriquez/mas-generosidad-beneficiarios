begin;

create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions;

select plan(13);

insert into public.beneficiaries (
  id,
  code,
  full_name,
  date_of_birth,
  gender,
  school_grade,
  favorite_subject,
  hobby,
  future_goal,
  public_story,
  import_notes,
  status
)
values
  (
    '90000000-0000-4000-8000-000000000001',
    'MG-901',
    'Perfil público ficticio',
    '2015-01-01',
    null,
    'Grado ficticio',
    'Materia ficticia',
    'Actividad ficticia',
    'Meta ficticia',
    'Relato creado exclusivamente para probar el contrato público.',
    'Nota privada ficticia que nunca debe salir por la RPC.',
    'published'
  ),
  (
    '90000000-0000-4000-8000-000000000002',
    'MG-902',
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    'Borrador ficticio.',
    'draft'
  ),
  (
    '90000000-0000-4000-8000-000000000003',
    'MG-903',
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    'Archivado ficticio.',
    'archived'
  );

insert into public.beneficiary_images (
  id,
  beneficiary_id,
  thumbnail_path,
  detail_path,
  alt_text,
  sort_order,
  is_primary
)
values
  (
    '91000000-0000-4000-8000-000000000001',
    '90000000-0000-4000-8000-000000000001',
    'contract/published-thumbnail.webp',
    'contract/published-detail.webp',
    'Imagen ficticia publicada',
    0,
    true
  ),
  (
    '91000000-0000-4000-8000-000000000002',
    '90000000-0000-4000-8000-000000000002',
    'contract/draft-thumbnail.webp',
    'contract/draft-detail.webp',
    'Imagen ficticia en borrador',
    0,
    true
  ),
  (
    '91000000-0000-4000-8000-000000000003',
    '90000000-0000-4000-8000-000000000003',
    'contract/archived-thumbnail.webp',
    'contract/archived-detail.webp',
    'Imagen ficticia archivada',
    0,
    true
  );

insert into storage.objects (bucket_id, name)
values
  ('beneficiary-media', 'contract/published-thumbnail.webp'),
  ('beneficiary-media', 'contract/published-detail.webp'),
  ('beneficiary-media', 'contract/draft-thumbnail.webp'),
  ('beneficiary-media', 'contract/draft-detail.webp'),
  ('beneficiary-media', 'contract/archived-thumbnail.webp'),
  ('beneficiary-media', 'contract/archived-detail.webp');

set local role anon;

select results_eq(
  $$select code from public.get_public_beneficiaries() where code = 'MG-901'$$,
  $$values ('MG-901'::text)$$,
  'La colección anónima solo contiene perfiles publicados'
);

select results_eq(
  $$select code from public.get_public_beneficiary('MG-901')$$,
  $$values ('MG-901'::text)$$,
  'El detalle publicado está disponible'
);

select is_empty(
  $$select code from public.get_public_beneficiary('MG-902')$$,
  'Un borrador no tiene detalle público'
);

select is_empty(
  $$select code from public.get_public_beneficiary('MG-903')$$,
  'Un perfil archivado no tiene detalle público'
);

select results_eq(
  $$select images #>> '{0,detail_path}' from public.get_public_beneficiary('MG-901')$$,
  $$values ('contract/published-detail.webp'::text)$$,
  'La RPC solo incorpora imágenes del perfil publicado'
);

select results_eq(
  $$select name::text from storage.objects where name like 'contract/%' order by name$$,
  $$values
    ('contract/published-detail.webp'::text),
    ('contract/published-thumbnail.webp'::text)$$,
  'Storage anónimo filtra imágenes de borradores y archivados'
);

select throws_ok(
  $$select * from public.beneficiaries$$,
  '42501',
  null,
  'Anon no puede leer la tabla base de beneficiarios'
);

select throws_ok(
  $$insert into public.beneficiaries (code) values ('MG-904')$$,
  '42501',
  null,
  'Anon no puede crear beneficiarios'
);

select throws_ok(
  $$update public.beneficiaries set full_name = 'Cambio prohibido' where code = 'MG-901'$$,
  '42501',
  null,
  'Anon no puede modificar beneficiarios'
);

select throws_ok(
  $$delete from public.beneficiaries where code = 'MG-901'$$,
  '42501',
  null,
  'Anon no puede eliminar beneficiarios'
);

reset role;

set local role authenticated;
set local request.jwt.claim.sub = '92000000-0000-4000-8000-000000000002';

select results_eq(
  $$select name::text from storage.objects where name like 'contract/%' order by name$$,
  $$values
    ('contract/published-detail.webp'::text),
    ('contract/published-thumbnail.webp'::text)$$,
  'Una cuenta autenticada no administrativa solo lee fotografías publicadas'
);

reset role;
set local request.jwt.claim.sub = '';
update public.beneficiaries set status = 'archived' where code = 'MG-901';
set local role anon;

select is_empty(
  $$select code from public.get_public_beneficiaries() where code = 'MG-901'$$,
  'Archivar retira inmediatamente el perfil de la colección pública'
);
select is_empty(
  $$select name from storage.objects where name like 'contract/%'$$,
  'Archivar impide nuevas lecturas autorizadas de sus fotografías'
);

reset role;

select * from finish();
rollback;
