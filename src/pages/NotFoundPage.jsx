import { Box, Button, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useI18n } from '../i18n/useI18n.js';

export default function NotFoundPage() {
  const { t } = useI18n();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        textAlign: 'center',
        p: 3,
      }}
    >
      <Box>
        <Typography variant="h1" sx={{ fontSize: '5rem' }}>
          404
        </Typography>
        <Typography variant="h4" sx={{ mb: 3 }}>
          {t('notFound.title')}
        </Typography>
        <Button component={RouterLink} to="/" variant="contained">
          {t('notFound.backHome')}
        </Button>
      </Box>
    </Box>
  );
}
