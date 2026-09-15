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
  school_grade: '',
  favorite_subject: '',
  hobby: '',
  future_goal: '',
  public_story: '',
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
    formState: { errors },
  } = useForm({
    defaultValues: defaults,
    resolver: zodResolver(beneficiaryFormSchema),
  });

  useEffect(() => {
    if (data)
      reset({ ...defaults, ...data, date_of_birth: data.date_of_birth || '' });
  }, [data, reset]);
  useEffect(() => {
    if (!isEditing && nextCode.data)
      reset({ ...defaults, code: nextCode.data });
  }, [isEditing, nextCode.data, reset]);

  const save = useMutation({
    mutationFn: ({ values, status }) =>
      saveBeneficiary({ ...values, status }, id),
    onSuccess: async (saved, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ['admin-beneficiaries'],
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
            setError(issue.path[0], { message: issue.message });
          const firstField = result.error.issues[0]?.path[0];
          const fieldSteps = {
            code: 0,
            full_name: 0,
            date_of_birth: 0,
            gender: 0,
            school_grade: 1,
            favorite_subject: 1,
            hobby: 1,
            future_goal: 1,
            public_story: 2,
          };
          setActiveStep(fieldSteps[firstField] ?? 0);
          return;
        }
      }
      save.mutate({ values, status });
    });
  }

  if (isLoading) return <CircularProgress aria-label="Cargando perfil" />;
  if (error) return <Alert severity="error">{error.message}</Alert>;

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
          Los borradores pueden estar incompletos. Publicar exige todos los
          datos principales.
        </Typography>
      </Box>
      <Paper
        component="form"
        noValidate
        elevation={0}
        sx={{ p: { xs: 2, sm: 4 }, border: '1px solid #DDD3C2' }}
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
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          gap={2}
          sx={{ mt: 4, pt: 3, borderTop: '1px solid #E2DACB' }}
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
                <MenuItem value="Otro">Otro</MenuItem>
              </Select>
            </FormControl>
          )}
        />
      </Section>
    );
  if (step === 1)
    return (
      <Section title="Educación e intereses">
        <Field
          control={control}
          errors={errors}
          name="school_grade"
          label="Grado escolar"
        />
        <Field
          control={control}
          errors={errors}
          name="favorite_subject"
          label="Asignatura favorita"
        />
        <Field
          control={control}
          errors={errors}
          name="hobby"
          label="Pasatiempo"
        />
        <Field
          control={control}
          errors={errors}
          name="future_goal"
          label="Qué quiere ser o lograr"
          multiline
          minRows={2}
        />
      </Section>
    );
  if (step === 2)
    return (
      <Section title="Relato">
        <Field
          control={control}
          errors={errors}
          name="public_story"
          label="Relato público revisado"
          multiline
          minRows={8}
          helper="No incluyas direcciones, teléfonos ni otros datos privados."
        />
        <Field
          control={control}
          errors={errors}
          name="import_notes"
          label="Notas privadas de importación"
          multiline
          minRows={4}
          helper="Solo los administradores pueden leer este campo."
        />
      </Section>
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
        Al publicar se verifican fecha de nacimiento completa, nombre, grado,
        asignatura favorita, pasatiempo, aspiración y relato público. La fecha
        completa nunca se entrega a visitantes.
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

function Field({ control, errors, name, helper, ...props }) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          {...props}
          error={Boolean(errors[name])}
          helperText={errors[name]?.message || helper}
          sx={{ gridColumn: props.multiline ? { md: '1 / -1' } : undefined }}
        />
      )}
    />
  );
}
