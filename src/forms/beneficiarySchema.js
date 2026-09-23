import { z } from 'zod';

const text = (maximum) =>
  z
    .string()
    .max(maximum, 'El texto es demasiado largo.')
    .optional()
    .or(z.literal(''));

const localizationSchema = z.object({
  school_grade: text(180),
  favorite_subject: text(180),
  hobby: text(500),
  future_goal: text(500),
  public_story: text(5000),
});

const requiredMessage = 'Este campo es obligatorio para publicar.';

function isFilled(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function addRequiredIssues(context, locale) {
  for (const field of Object.keys(localizationSchema.shape)) {
    if (!isFilled(context.value.localizations[locale][field])) {
      context.addIssue({
        code: 'custom',
        message: requiredMessage,
        path: ['localizations', locale, field],
      });
    }
  }
}

export const beneficiaryFormSchema = z.object({
  code: z
    .string()
    .trim()
    .regex(/^MG-\d{3}$/, 'Usa el formato MG-001.'),
  full_name: text(180),
  date_of_birth: z.string().optional().or(z.literal('')),
  gender: z.enum(['Niño', 'Niña']).or(z.literal('')),
  localizations: z.object({
    es: localizationSchema,
    en: localizationSchema,
  }),
  import_notes: text(5000),
  status: z.enum(['draft', 'published', 'archived']),
});

export const publishedBeneficiarySchema = beneficiaryFormSchema
  .extend({
    full_name: z.string().trim().min(1, requiredMessage),
    date_of_birth: z.iso.date({ error: requiredMessage }),
    status: z.literal('published'),
  })
  .superRefine((value, context) => {
    addRequiredIssues({ value, addIssue: context.addIssue }, 'es');
    const englishValues = Object.values(value.localizations.en);
    if (englishValues.some(isFilled))
      addRequiredIssues({ value, addIssue: context.addIssue }, 'en');
  });
