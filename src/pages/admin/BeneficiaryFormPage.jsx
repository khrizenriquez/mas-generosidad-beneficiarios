import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { PhotoManager } from '../../components/admin/PhotoManager.jsx';
import {
  beneficiaryFormSchema,
  publishedBeneficiarySchema,
} from '../../forms/beneficiarySchema.js';
import {
  getAdminBeneficiary,
  getNextBeneficiaryCode,
  saveBeneficiary,
} from '../../services/adminBeneficiaries.js';

const steps = [
  'Identificación',
  'Educación e intereses',
  'Relato',
  'Fotografías',
  'Revisión',
];
const defaults = {
  code: '',
  full_name: '',
  date_of_birth: '',
  gender: '',
  localizations: {
    es: {
      school_grade: '',
      favorite_subject: '',
      hobby: '',
      future_goal: '',
      public_story: '',
    },
    en: {
      school_grade: '',
      favorite_subject: '',
      hobby: '',
      future_goal: '',
      public_story: '',
    },
  },
  import_notes: '',
  status: 'draft',
};

export default function BeneficiaryFormPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeStep, setActiveStep] = useState(0);
  const [notice, setNotice] = useState('');
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-beneficiary', id],
    queryFn: () => getAdminBeneficiary(id),
    enabled: isEditing,
  });
  const nextCode = useQuery({
    queryKey: ['next-beneficiary-code'],
    queryFn: getNextBeneficiaryCode,
    enabled: !isEditing,
  });
  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, dirtyFields },
  } = useForm({
    defaultValues: defaults,
    resolver: zodResolver(beneficiaryFormSchema),
  });

  useEffect(() => {
    if (data) reset(toFormValues(data), { keepDirtyValues: true });
  }, [data, reset]);
  useEffect(() => {
    if (!isEditing && nextCode.data)
      reset({ ...defaults, code: nextCode.data });
  }, [isEditing, nextCode.data, reset]);

  const save = useMutation({
    mutationFn: ({ values, status }) =>
      saveBeneficiary({ ...values, status }, id),
    onSuccess: async (saved, variables) => {
      reset({ ...variables.values, status: variables.status });
      await queryClient.invalidateQueries({
        queryKey: ['admin-beneficiaries'],
      });
      await queryClient.invalidateQueries({
        queryKey: ['next-beneficiary-code'],
      });
      await queryClient.invalidateQueries({
        queryKey: ['public-beneficiaries'],
      });
      await queryClient.invalidateQueries({
        queryKey: ['public-beneficiary', variables.values.code],
      });
      setNotice(
        variables.status === 'published'
          ? 'La historia quedó publicada.'
          : 'El borrador quedó guardado.',
      );
      if (!isEditing)
        navigate(`/admin/beneficiarios/${saved.id}/editar`, { replace: true });
    },
  });

  function submitWithStatus(status) {
    return handleSubmit((values) => {
      setNotice('');
      if (status === 'published') {
        const result = publishedBeneficiarySchema.safeParse({
          ...values,
          status,
        });
        if (!result.success) {
          for (const issue of result.error.issues)
            setError(issue.path.join('.'), { message: issue.message });
          const firstField = result.error.issues[0]?.path.join('.');
          const fieldSteps = {
            code: 0,
            full_name: 0,
            date_of_birth: 0,
            gender: 0,
            'localizations.es.school_grade': 1,
            'localizations.es.favorite_subject': 1,
            'localizations.es.hobby': 1,
            'localizations.es.future_goal': 1,
            'localizations.en.school_grade': 1,
            'localizations.en.favorite_subject': 1,
            'localizations.en.hobby': 1,
            'localizations.en.future_goal': 1,
            'localizations.es.public_story': 2,
            'localizations.en.public_story': 2,
          };
          setActiveStep(fieldSteps[firstField] ?? 0);
          return;
        }
      }
      save.mutate({ values, status });
    });
  }

  if (isLoading) return <CircularProgress aria-label="Cargando perfil" />;
  if (error)
    return (
      <Alert
        severity="error"
        action={<Button onClick={() => refetch()}>Reintentar</Button>}
      >
        {error.message}
      </Alert>
    );

  return (
    <>
      <Button
        component={RouterLink}
        to="/admin/beneficiarios"
        startIcon={<ArrowBackRoundedIcon />}
        sx={{ mb: 3 }}
      >
        Volver al listado
      </Button>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h2"
          sx={{ fontSize: { xs: '2rem', md: '2.8rem' } }}
        >
          {isEditing
            ? `Editar ${data?.full_name || data?.code || 'perfil'}`
            : 'Nuevo perfil'}
        </Typography>
        <Typography color="text.secondary">
          Los borradores pueden estar incompletos. Publicar exige español
          completo; inglés es opcional, pero debe estar completo si lo inicias.
        </Typography>
      </Box>
      <Paper
        component="form"
        noValidate
        elevation={0}
        sx={{
          p: { xs: 2, sm: 4 },
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          sx={{ mb: 5, display: { xs: 'none', md: 'flex' } }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Typography variant="overline" color="primary" fontWeight={800}>
          Paso {activeStep + 1} de {steps.length} · {steps[activeStep]}
        </Typography>
        <Box sx={{ mt: 2, minHeight: 340 }}>
          {renderStep(activeStep, {
            control,
            errors,
            isEditing,
            data,
            refetch,
          })}
        </Box>
        {save.error ? (
          <Alert severity="error" sx={{ mt: 3 }}>
            {save.error.message}
          </Alert>
        ) : null}
        {notice ? (
          <Alert severity="success" sx={{ mt: 3 }}>
            {notice}
          </Alert>
        ) : null}
        {Object.keys(dirtyFields).length > 0 ? (
          <Typography color="text.secondary" sx={{ mt: 2 }}>
            Tienes cambios sin guardar.
          </Typography>
        ) : null}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          gap={2}
          sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}
        >
          <Button
            onClick={() => setActiveStep((step) => Math.max(0, step - 1))}
            disabled={activeStep === 0}
          >
            Anterior
          </Button>
          {activeStep < steps.length - 1 ? (
            <Button
              variant="outlined"
              onClick={() => setActiveStep((step) => step + 1)}
            >
              Siguiente
            </Button>
          ) : null}
          <Box sx={{ flex: 1 }} />
          <Button
            onClick={submitWithStatus('draft')}
            startIcon={<SaveRoundedIcon />}
            disabled={save.isPending}
          >
            Guardar borrador
          </Button>
          <Button
            onClick={submitWithStatus('published')}
            variant="contained"
            startIcon={<CheckCircleRoundedIcon />}
            disabled={save.isPending}
          >
            Publicar
          </Button>
        </Stack>
      </Paper>
    </>
  );
}

function renderStep(step, context) {
  const { control, errors, isEditing, data, refetch } = context;
  if (step === 0)
    return (
      <Section title="Identificación">
        <Field
          control={control}
          errors={errors}
          name="code"
          label="Código MG"
          helper="Formato MG-001"
        />
        <Field
          control={control}
          errors={errors}
          name="full_name"
          label="Nombre completo"
        />
        <Field
          control={control}
          errors={errors}
          name="date_of_birth"
          label="Fecha de nacimiento"
          type="date"
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth>
              <InputLabel id="gender-label">Género (opcional)</InputLabel>
              <Select
                {...field}
                labelId="gender-label"
                label="Género (opcional)"
              >
                <MenuItem value="">
                  <em>Sin especificar</em>
                </MenuItem>
                <MenuItem value="Niña">Niña</MenuItem>
                <MenuItem value="Niño">Niño</MenuItem>
              </Select>
            </FormControl>
          )}
        />
      </Section>
    );
  if (step === 1)
    return (
      <Stack gap={4}>
        <LocalizationFields
          control={control}
          locale="es"
          title="Español"
          helper="Obligatorio para publicar."
        />
        <LocalizationFields
          control={control}
          locale="en"
          title="English"
          helper="Opcional; si lo inicias, completa todos los campos antes de publicar."
        />
      </Stack>
    );
  if (step === 2)
    return (
      <Stack gap={4}>
        <LocalizationStoryField
          control={control}
          locale="es"
          title="Relato en español"
        />
        <LocalizationStoryField
          control={control}
          locale="en"
          title="Story in English"
        />
        <Section title="Notas privadas">
          <Field
            control={control}
            name="import_notes"
            label="Notas privadas de importación"
            multiline
            minRows={4}
            helper="Solo los administradores pueden leer este campo."
          />
        </Section>
      </Stack>
    );
  if (step === 3)
    return isEditing ? (
      <PhotoManager
        beneficiaryId={data.id}
        images={data.images}
        onChanged={refetch}
      />
    ) : (
      <Alert severity="info">
        Guarda primero el perfil como borrador; después podrás subir hasta tres
        fotografías.
      </Alert>
    );
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Revisión antes de publicar
      </Typography>
      <Alert severity="warning" sx={{ mb: 3 }}>
        La aplicación no registra el consentimiento. Antes de publicar, confirma
        mediante el proceso externo de la ONG que existe autorización suficiente
        para mostrar nombre, historia y fotografías.
      </Alert>
      <Typography color="text.secondary">
        Al publicar se verifican fecha de nacimiento completa, nombre y todos
        los campos en español. Inglés es opcional, pero si se inicia debe estar
        completo. La fecha completa nunca se entrega a visitantes.
      </Typography>
    </Box>
  );
}

function Section({ title, children }) {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        {title}
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
          gap: 2.5,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

function LocalizationFields({ control, locale, title, helper }) {
  const prefix = `localizations.${locale}`;
  return (
    <Section title={title}>
      <Typography color="text.secondary" sx={{ gridColumn: '1 / -1' }}>
        {helper}
      </Typography>
      <Field
        control={control}
        name={`${prefix}.school_grade`}
        label="Grado escolar"
      />
      <Field
        control={control}
        name={`${prefix}.favorite_subject`}
        label="Asignatura favorita"
      />
      <Field control={control} name={`${prefix}.hobby`} label="Pasatiempo" />
      <Field
        control={control}
        name={`${prefix}.future_goal`}
        label="Qué quiere ser o lograr"
        multiline
        minRows={2}
      />
    </Section>
  );
}

function LocalizationStoryField({ control, locale, title }) {
  return (
    <Section title={title}>
      <Field
        control={control}
        name={`localizations.${locale}.public_story`}
        label={
          locale === 'es' ? 'Relato público revisado' : 'Reviewed public story'
        }
        multiline
        minRows={8}
        helper="No incluyas direcciones, teléfonos ni otros datos privados."
      />
    </Section>
  );
}

function Field({ control, name, helper, ...props }) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          {...props}
          error={Boolean(fieldState.error)}
          helperText={fieldState.error?.message || helper}
          sx={{ gridColumn: props.multiline ? { md: '1 / -1' } : undefined }}
        />
      )}
    />
  );
}

function toFormValues(data) {
  return {
    ...defaults,
    ...Object.fromEntries(
      Object.entries(defaults).map(([key, fallback]) => [
        key,
        data[key] ?? fallback,
      ]),
    ),
    localizations: {
      es: toFormLocalization(data.localizations?.es),
      en: toFormLocalization(data.localizations?.en),
    },
  };
}

function toFormLocalization(localization = {}) {
  return Object.fromEntries(
    Object.entries(defaults.localizations.es).map(([field, fallback]) => [
      field,
      localization[field] ?? fallback,
    ]),
  );
}
