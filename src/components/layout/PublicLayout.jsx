import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import { AppBar, Box, Button, Container, Link, Toolbar } from '@mui/material';
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
        sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
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
        sx={{
          mt: 10,
          bgcolor: 'primary.dark',
          color: 'white',
          py: { xs: 4, md: 5 },
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: { xs: 2, sm: 3 },
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            <Link
              href="https://khrizenriquez.github.io/khrizenriquez/"
              target="_blank"
              rel="noreferrer"
              color="inherit"
            >
              Made with love by Christofer Enríquez ❤️
            </Link>
            <Box
              aria-hidden="true"
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                bgcolor: 'secondary.main',
              }}
            />
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
