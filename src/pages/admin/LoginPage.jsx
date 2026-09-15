import LockRoundedIcon from '@mui/icons-material/LockRounded';
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth.js';
import { BrandMark } from '../../components/BrandMark.jsx';
import { hasSupabaseConfig } from '../../config/env.js';

export default function LoginPage() {
  const { isAdmin, signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  if (isAdmin) return <Navigate to="/admin/beneficiarios" replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await signIn(email, password);
      navigate(location.state?.from || '/admin/beneficiarios', {
        replace: true,
      });
    } catch (caught) {
      setError(caught.message || 'No fue posible iniciar sesión.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Container
      maxWidth="sm"
      sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', py: 4 }}
    >
      <Paper
        component="form"
        onSubmit={handleSubmit}
        elevation={0}
        sx={{
          width: '100%',
          p: { xs: 3, sm: 5 },
          border: '1px solid rgba(32,50,46,.12)',
        }}
      >
        <BrandMark />
        <Typography variant="h2" sx={{ mt: 4, fontSize: '2.2rem' }}>
          Área administrativa
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1, mb: 4 }}>
          Acceso exclusivo para cuentas autorizadas por la ONG.
        </Typography>
        {!hasSupabaseConfig ? (
          <Alert severity="warning" sx={{ mb: 3 }}>
            Configura Supabase en las variables de entorno para iniciar sesión.
          </Alert>
        ) : null}
        {error ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) : null}
        <TextField
          label="Correo electrónico"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Contraseña"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          sx={{ mb: 3 }}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          startIcon={<LockRoundedIcon />}
          disabled={submitting || !hasSupabaseConfig}
        >
          {submitting ? 'Verificando…' : 'Ingresar'}
        </Button>
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button href="/">Volver al sitio público</Button>
        </Box>
      </Paper>
    </Container>
  );
}
