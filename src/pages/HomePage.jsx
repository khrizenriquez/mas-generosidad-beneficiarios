import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import {
  Alert,
  Box,
  Container,
  InputAdornment,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useDeferredValue, useMemo, useState } from 'react';
import { StoryCard } from '../components/story/StoryCard.jsx';
import { env } from '../config/env.js';
import { useI18n } from '../i18n/useI18n.js';
import { getPublicBeneficiaries } from '../services/publicBeneficiaries.js';
import { normalizeForSearch } from '../utils/normalize.js';

export default function HomePage() {
  const { t, tPlural } = useI18n();
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const {
    data = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['public-beneficiaries', env.useDemoData ? 'demo' : 'remote'],
    queryFn: getPublicBeneficiaries,
  });
  const filtered = useMemo(() => {
    const query = normalizeForSearch(deferredSearch);
    if (!query) return data;
    return data.filter((item) =>
      normalizeForSearch(item.full_name).includes(query),
    );
  }, [data, deferredSearch]);

  return (
    <>
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          pt: { xs: 7, md: 11 },
          pb: { xs: 8, md: 12 },
        }}
      >
        <Box
          aria-hidden="true"
          sx={{
            position: 'absolute',
            width: 360,
            height: 360,
            borderRadius: '50%',
            bgcolor: 'secondary.light',
            opacity: 0.78,
            right: { xs: -220, md: -80 },
            top: -180,
          }}
        />
        <Container maxWidth="lg" sx={{ position: 'relative' }}>
          <Typography
            variant="overline"
            color="primary"
            fontWeight={800}
            letterSpacing=".14em"
          >
            {t('home.eyebrow')}
          </Typography>
          <Typography
            variant="h1"
            sx={{
              maxWidth: 820,
              mt: 1,
              fontSize: { xs: '2.7rem', sm: '4rem', md: '5.2rem' },
            }}
          >
            {t('home.title')}
          </Typography>
          <Typography
            sx={{
              mt: 3,
              maxWidth: 660,
              fontSize: { xs: '1.05rem', md: '1.25rem' },
              color: 'text.secondary',
            }}
          >
            {t('home.description')}
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Box sx={{ maxWidth: 660, mb: 5 }}>
          <TextField
            label={t('home.searchLabel')}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon />
                  </InputAdornment>
                ),
              },
            }}
            inputProps={{ 'aria-describedby': 'search-result-count' }}
          />
          <Typography
            id="search-result-count"
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1.5 }}
            aria-live="polite"
          >
            {isLoading
              ? t('home.loading')
              : tPlural('home.resultCount', filtered.length)}
          </Typography>
        </Box>

        {error ? (
          <Alert
            severity="info"
            action={
              <button onClick={() => refetch()}>{t('home.retry')}</button>
            }
            sx={{ mb: 4 }}
          >
            {t(`errors.${error.message}`) || t('errors.unknown')}
          </Alert>
        ) : null}

        {isLoading ? (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 3,
            }}
          >
            {[0, 1, 2].map((item) => (
              <Skeleton key={item} variant="rounded" height={500} />
            ))}
          </Box>
        ) : null}

        {!isLoading && !error && filtered.length === 0 ? (
          <Stack sx={{ py: 8, textAlign: 'center' }}>
            <Typography variant="h3">{t('home.emptyTitle')}</Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              {t('home.emptyDescription')}
            </Typography>
          </Stack>
        ) : null}

        {!isLoading && !error && filtered.length > 0 ? (
          <Box
            className="story-grid"
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)',
              },
              gap: 3,
            }}
          >
            {filtered.map((beneficiary) => (
              <StoryCard key={beneficiary.id} beneficiary={beneficiary} />
            ))}
          </Box>
        ) : null}
      </Container>
    </>
  );
}
