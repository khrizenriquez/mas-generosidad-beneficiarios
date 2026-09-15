import { z } from 'zod';

const text = z
  .string()
  .max(5000, 'El texto es demasiado largo.')
  .optional()
  .or(z.literal(''));

export const beneficiaryFormSchema = z.object({
  code: z
    .string()
    .trim()
    .regex(/^MG-\d{3}$/, 'Usa el formato MG-001.'),
  full_name: text,
  date_of_birth: z.string().optional().or(z.literal('')),
  gender: text,
  school_grade: text,
  favorite_subject: text,
  hobby: text,
  future_goal: text,
  public_story: text,
  import_notes: text,
  status: z.enum(['draft', 'published', 'archived']),
});

const requiredMessage = 'Este campo es obligatorio para publicar.';

export const publishedBeneficiarySchema = beneficiaryFormSchema.extend({
  full_name: z.string().trim().min(1, requiredMessage),
  date_of_birth: z.iso.date({ error: requiredMessage }),
  school_grade: z.string().trim().min(1, requiredMessage),
  favorite_subject: z.string().trim().min(1, requiredMessage),
  hobby: z.string().trim().min(1, requiredMessage),
  future_goal: z.string().trim().min(1, requiredMessage),
  public_story: z.string().trim().min(1, requiredMessage),
  status: z.literal('published'),
});
