import { lazy, Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import { PublicLayout } from './components/layout/PublicLayout.jsx';
import { AdminGuard } from './auth/AdminGuard.jsx';

const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const StoryPage = lazy(() => import('./pages/StoryPage.jsx'));
const LoginPage = lazy(() => import('./pages/admin/LoginPage.jsx'));
const AdminLayout = lazy(() => import('./components/layout/AdminLayout.jsx'));
const BeneficiaryListPage = lazy(
  () => import('./pages/admin/BeneficiaryListPage.jsx'),
);
const BeneficiaryFormPage = lazy(
  () => import('./pages/admin/BeneficiaryFormPage.jsx'),
);
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/historias/:code', element: <StoryPage /> },
    ],
  },
  { path: '/admin/login', element: <LoginPage /> },
  {
    path: '/admin',
    element: (
      <AdminGuard>
        <AdminLayout />
      </AdminGuard>
    ),
    children: [
      { index: true, element: <Navigate to="beneficiarios" replace /> },
      { path: 'beneficiarios', element: <BeneficiaryListPage /> },
      { path: 'beneficiarios/nuevo', element: <BeneficiaryFormPage /> },
      { path: 'beneficiarios/:id/editar', element: <BeneficiaryFormPage /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);

export default function App() {
  return (
    <Suspense
      fallback={
        <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
          <CircularProgress aria-label="Cargando" />
        </Box>
      }
    >
      <RouterProvider router={router} />
    </Suspense>
  );
}
