import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from '@mui/material';
import { Link as RouterLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth.js';
import { BrandMark } from '../BrandMark.jsx';

export default function AdminLayout() {
  const { signOut } = useAuth();
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="sticky"
        color="inherit"
        elevation={0}
        sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ gap: 1.5, flexWrap: 'wrap', py: 1 }}>
            <BrandMark compact />
            <Typography
              variant="caption"
              sx={{ px: 1, py: 0.5, bgcolor: 'warning.main', borderRadius: 1 }}
            >
              Administración
            </Typography>
            <Box sx={{ flex: 1 }} />
            <Button
              component={RouterLink}
              to="/"
              startIcon={<PublicRoundedIcon />}
            >
              Ver sitio
            </Button>
            <Button
              color="inherit"
              onClick={signOut}
              startIcon={<LogoutRoundedIcon />}
            >
              Salir
            </Button>
          </Toolbar>
        </Container>
      </AppBar>
      <Container
        component="main"
        id="contenido"
        maxWidth="xl"
        sx={{ py: { xs: 3, md: 5 } }}
      >
        <Outlet />
      </Container>
    </Box>
  );
}
