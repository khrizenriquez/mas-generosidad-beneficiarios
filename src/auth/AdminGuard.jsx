import { Box, CircularProgress } from '@mui/material';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth.js';

export function AdminGuard({ children }) {
  const { isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <CircularProgress aria-label="Verificando acceso" />
      </Box>
    );
  }

  if (!isAdmin) {
    return (
      <Navigate to="/admin/login" state={{ from: location.pathname }} replace />
    );
  }
  return children;
}
