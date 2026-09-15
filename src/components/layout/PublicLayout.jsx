import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import {
  AppBar,
  Box,
  Button,
  Container,
  Link,
  Toolbar,
  Typography,
} from '@mui/material';
import { Link as RouterLink, Outlet } from 'react-router-dom';
import { BrandMark } from '../BrandMark.jsx';

const organizationUrl = 'https://masgenerosidad.org/';

export function PublicLayout() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar
        position="static"
        elevation={0}
        color="transparent"
        sx={{ borderBottom: '1px solid', borderColor: 'rgba(32,50,46,.12)' }}
      >
        <Container maxWidth="lg">
          <Toolbar
            disableGutters
            sx={{ minHeight: { xs: 72, md: 82 }, gap: 2 }}
          >
            <Link
              component={RouterLink}
              to="/"
              underline="none"
              color="text.primary"
              aria-label="Ir al inicio"
            >
              <BrandMark />
            </Link>
            <Box sx={{ flex: 1 }} />
            <Button
              component="a"
              href={organizationUrl}
              target="_blank"
              rel="noreferrer"
              endIcon={<OpenInNewRoundedIcon />}
              sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
            >
              Conoce la ONG
            </Button>
          </Toolbar>
        </Container>
      </AppBar>

      <Box component="main" id="contenido" sx={{ flex: 1 }}>
        <Outlet />
      </Box>

      <Box
        component="footer"
        sx={{ mt: 10, bgcolor: 'primary.dark', color: 'white', py: 5 }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 3,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <BrandMark compact color="white" />
            <Typography variant="body2" sx={{ maxWidth: 480, opacity: 0.82 }}>
              Este espacio comparte historias autorizadas por la ONG y protege
              los datos privados de cada beneficiario.
            </Typography>
            <Link
              href={organizationUrl}
              target="_blank"
              rel="noreferrer"
              color="inherit"
            >
              masgenerosidad.org
            </Link>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
