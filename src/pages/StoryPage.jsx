import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { StoryImagePlaceholder } from '../components/story/StoryImagePlaceholder.jsx';
import { getPublicBeneficiary } from '../services/publicBeneficiaries.js';

export default function StoryPage() {
  const { code } = useParams();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['public-beneficiary', code],
    queryFn: () => getPublicBeneficiary(code),
  });

  return (
    <Container maxWidth="lg" sx={{ pt: { xs: 4, md: 7 } }}>
      <Button
        component={RouterLink}
        to="/"
        startIcon={<ArrowBackRoundedIcon />}
        sx={{ mb: 4 }}
      >
        Todas las historias
      </Button>
      {isLoading ? <Skeleton variant="rounded" height={600} /> : null}
      {error ? (
        <Alert
          severity="error"
          action={<button onClick={() => refetch()}>Reintentar</button>}
        >
          {error.message}
        </Alert>
      ) : null}
      {!isLoading && !error && !data ? (
        <Alert severity="info">Esta historia no está disponible.</Alert>
      ) : null}
      {data ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'minmax(320px, .8fr) 1.2fr' },
            gap: { xs: 4, md: 7 },
            alignItems: 'start',
          }}
        >
          <Box
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: '0 22px 60px rgba(32,50,46,.13)',
            }}
          >
            {data.images?.[0]?.detail_url ? (
              <Box
                component="img"
                src={data.images[0].detail_url}
                alt={
                  data.images[0].alt_text || `Fotografía de ${data.full_name}`
                }
                sx={{ width: '100%', maxHeight: 680, objectFit: 'cover' }}
              />
            ) : (
              <StoryImagePlaceholder />
            )}
          </Box>
          <Box>
            <Stack
              direction="row"
              spacing={1}
              useFlexGap
              flexWrap="wrap"
              sx={{ mb: 2 }}
            >
              {data.age !== null ? <Chip label={`${data.age} años`} /> : null}
              {data.gender ? (
                <Chip variant="outlined" label={data.gender} />
              ) : null}
              {data.school_grade ? (
                <Chip variant="outlined" label={data.school_grade} />
              ) : null}
            </Stack>
            <Typography
              variant="h1"
              sx={{ fontSize: { xs: '2.6rem', md: '4.6rem' } }}
            >
              {data.full_name}
            </Typography>
            <Box
              sx={{
                my: 4,
                p: 3,
                bgcolor: 'warning.main',
                borderRadius: '4px 32px 4px 32px',
              }}
            >
              <Typography variant="overline" fontWeight={800}>
                Su aspiración
              </Typography>
              <Typography
                variant="h3"
                sx={{ fontSize: { xs: '1.6rem', md: '2rem' } }}
              >
                {data.future_goal}
              </Typography>
            </Box>
            <Typography variant="h3" sx={{ mb: 2 }}>
              Su historia
            </Typography>
            <Typography
              sx={{
                whiteSpace: 'pre-line',
                fontSize: '1.08rem',
                lineHeight: 1.8,
              }}
            >
              {data.public_story}
            </Typography>
            <Box
              sx={{
                mt: 5,
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 2,
              }}
            >
              {data.favorite_subject ? (
                <Fact
                  label="Asignatura favorita"
                  value={data.favorite_subject}
                />
              ) : null}
              {data.hobby ? <Fact label="Le gusta" value={data.hobby} /> : null}
            </Box>
          </Box>
        </Box>
      ) : null}
    </Container>
  );
}

function Fact({ label, value }) {
  return (
    <Box sx={{ p: 2.5, bgcolor: 'background.paper', borderRadius: 2 }}>
      <Typography variant="overline" color="text.secondary">
        {label}
      </Typography>
      <Typography fontWeight={700}>{value}</Typography>
    </Box>
  );
}
