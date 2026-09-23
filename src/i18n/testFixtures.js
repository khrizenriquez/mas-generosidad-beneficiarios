export const publicProfileFixture = Object.freeze({
  id: 'test-profile',
  code: 'TEST-001',
  full_name: 'Nombre editorial sin traducir',
  age: 12,
  gender: 'Niña',
  localizations: {
    es: {
      school_grade: 'Grado editorial',
      favorite_subject: 'Asignatura editorial',
      hobby: 'Pasatiempo editorial',
      future_goal: 'Meta editorial sin traducir',
      public_story: 'Relato editorial sin traducir.',
    },
    en: {
      school_grade: 'Editorial grade',
      favorite_subject: 'Editorial subject',
      hobby: 'Editorial hobby',
      future_goal: 'An untranslated editorial goal',
      public_story: 'An untranslated editorial story.',
    },
  },
  images: [],
});
