import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ArchiveRoundedIcon from '@mui/icons-material/ArchiveRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link as RouterLink } from 'react-router-dom';
import {
  archiveBeneficiary,
  getAdminBeneficiaries,
} from '../../services/adminBeneficiaries.js';

const statusLabels = {
  draft: 'Borrador',
  published: 'Publicado',
  archived: 'Archivado',
};
const statusColors = {
  draft: 'default',
  published: 'success',
  archived: 'warning',
};

export default function BeneficiaryListPage() {
  const queryClient = useQueryClient();
  const {
    data = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['admin-beneficiaries'],
    queryFn: getAdminBeneficiaries,
  });
  const archive = useMutation({
    mutationFn: archiveBeneficiary,
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin-beneficiaries'] }),
        queryClient.invalidateQueries({ queryKey: ['admin-beneficiary'] }),
        queryClient.invalidateQueries({ queryKey: ['public-beneficiaries'] }),
        queryClient.invalidateQueries({ queryKey: ['public-beneficiary'] }),
      ]),
  });

  function requestArchive(item) {
    if (
      window.confirm(
        `¿Archivar ${item.full_name || item.code}? Dejará de aparecer en el sitio público.`,
      )
    )
      archive.mutate(item.id);
  }

  return (
    <>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        gap={2}
        alignItems={{ sm: 'center' }}
        justifyContent="space-between"
        sx={{ mb: 4 }}
      >
        <Box>
          <Typography
            variant="h2"
            sx={{ fontSize: { xs: '2rem', md: '2.8rem' } }}
          >
            Beneficiarios
          </Typography>
          <Typography color="text.secondary">
            Crea borradores, revisa historias y publica solo con consentimiento
            confirmado fuera del sistema.
          </Typography>
        </Box>
        <Button
          component={RouterLink}
          to="nuevo"
          variant="contained"
          startIcon={<AddRoundedIcon />}
        >
          Nuevo perfil
        </Button>
      </Stack>
      {error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error.message}
        </Alert>
      ) : null}
      {archive.error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {archive.error.message}
        </Alert>
      ) : null}
      {isLoading ? (
        <CircularProgress aria-label="Cargando beneficiarios" />
      ) : (
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{ border: '1px solid #DDD3C2' }}
        >
          <Table aria-label="Beneficiarios registrados">
            <TableHead>
              <TableRow>
                <TableCell>Código</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Actualizado</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 700 }}>
                    {item.code}
                  </TableCell>
                  <TableCell>{item.full_name || <em>Sin nombre</em>}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      color={statusColors[item.status]}
                      label={statusLabels[item.status]}
                    />
                  </TableCell>
                  <TableCell>
                    {new Intl.DateTimeFormat('es-GT', {
                      dateStyle: 'medium',
                    }).format(new Date(item.updated_at))}
                  </TableCell>
                  <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                    <IconButton
                      component={RouterLink}
                      to={`${item.id}/editar`}
                      aria-label={`Editar ${item.full_name || item.code}`}
                    >
                      <EditRoundedIcon />
                    </IconButton>
                    {item.status !== 'archived' ? (
                      <IconButton
                        onClick={() => requestArchive(item)}
                        aria-label={`Archivar ${item.full_name || item.code}`}
                        disabled={archive.isPending}
                      >
                        <ArchiveRoundedIcon />
                      </IconButton>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))}
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 7 }}>
                    Aún no hay perfiles.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
}
