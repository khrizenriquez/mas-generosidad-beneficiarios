import { Box, Button, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function NotFoundPage() {
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
          No encontramos esta página.
        </Typography>
        <Button component={RouterLink} to="/" variant="contained">
          Volver al inicio
        </Button>
      </Box>
    </Box>
  );
}
