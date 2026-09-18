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
import { getPublicBeneficiaries } from '../services/publicBeneficiaries.js';
import { normalizeForSearch } from '../utils/normalize.js';

export default function HomePage() {
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const {
    data = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['public-beneficiaries'],
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
            Personas, sueños y comunidad
          </Typography>
          <Typography
            variant="h1"
            sx={{
              maxWidth: 820,
              mt: 1,
              fontSize: { xs: '2.7rem', sm: '4rem', md: '5.2rem' },
            }}
          >
            Cada historia merece ser escuchada.
          </Typography>
          <Typography
            sx={{
              mt: 3,
              maxWidth: 660,
              fontSize: { xs: '1.05rem', md: '1.25rem' },
              color: 'text.secondary',
            }}
          >
            Conoce a las personas que forman parte de Más Generosidad: lo que
            disfrutan, lo que aprenden y el futuro que imaginan.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Box sx={{ maxWidth: 660, mb: 5 }}>
          <TextField
            label="Buscar por nombre"
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
              ? 'Cargando historias…'
              : `${filtered.length} ${filtered.length === 1 ? 'historia encontrada' : 'historias encontradas'}`}
          </Typography>
        </Box>

        {error ? (
          <Alert
            severity="info"
            action={<button onClick={() => refetch()}>Reintentar</button>}
            sx={{ mb: 4 }}
          >
            {error.message}
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
            <Typography variant="h3">
              Aún no hay una historia con ese nombre.
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Prueba con otra forma de escribirlo.
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
