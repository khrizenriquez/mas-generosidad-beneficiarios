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
import { StoryGallery } from '../components/story/StoryGallery.jsx';
import { env } from '../config/env.js';
import { formatAge, translateGender } from '../i18n/catalog.js';
import { useI18n } from '../i18n/useI18n.js';
import { getPublicBeneficiary } from '../services/publicBeneficiaries.js';

export default function StoryPage() {
  const { locale, t } = useI18n();
  const { code } = useParams();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['public-beneficiary', code, env.useDemoData ? locale : 'remote'],
    queryFn: () => getPublicBeneficiary(code, locale),
  });

  return (
    <Container maxWidth="lg" sx={{ pt: { xs: 4, md: 7 } }}>
      <Button
        component={RouterLink}
        to="/"
        startIcon={<ArrowBackRoundedIcon />}
        sx={{ mb: 4 }}
      >
        {t('story.allStories')}
      </Button>
      {isLoading ? <Skeleton variant="rounded" height={600} /> : null}
      {error ? (
        <Alert
          severity="error"
          action={<button onClick={() => refetch()}>{t('home.retry')}</button>}
        >
          {t(`errors.${error.message}`) || t('errors.unknown')}
        </Alert>
      ) : null}
      {!isLoading && !error && !data ? (
        <Alert severity="info">{t('story.unavailable')}</Alert>
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
          <StoryGallery images={data.images} beneficiaryName={data.full_name} />
          <Box>
            <Stack
              direction="row"
              spacing={1}
              useFlexGap
              sx={{ mb: 2, flexWrap: 'wrap' }}
            >
              {data.age !== null ? (
                <Chip label={formatAge(locale, data.age)} />
              ) : null}
              {data.gender ? (
                <Chip
                  variant="outlined"
                  label={translateGender(locale, data.gender)}
                />
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
                {t('story.aspiration')}
              </Typography>
              <Typography
                variant="h3"
                sx={{ fontSize: { xs: '1.6rem', md: '2rem' } }}
              >
                {data.future_goal}
              </Typography>
            </Box>
            <Typography variant="h3" sx={{ mb: 2 }}>
              {t('story.history')}
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
                  label={t('story.favoriteSubject')}
                  value={data.favorite_subject}
                />
              ) : null}
              {data.hobby ? (
                <Fact label={t('story.hobby')} value={data.hobby} />
              ) : null}
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
