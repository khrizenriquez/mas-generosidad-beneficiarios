import AddPhotoAlternateRoundedIcon from '@mui/icons-material/AddPhotoAlternateRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Typography,
} from '@mui/material';
import { useRef, useState } from 'react';
import { processImage } from '../../utils/imageProcessing.js';
import {
  removeBeneficiaryImage,
  uploadBeneficiaryImage,
} from '../../services/adminBeneficiaries.js';

export function PhotoManager({ beneficiaryId, images = [], onChanged }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const remaining = 3 - images.length;

  async function handleFiles(event) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';
    if (files.length > remaining) {
      setError(
        `Puedes agregar ${remaining} ${remaining === 1 ? 'fotografía más' : 'fotografías más'}.`,
      );
      return;
    }
    setBusy(true);
    setError('');
    try {
      const usedOrders = new Set(images.map((image) => image.sort_order));
      const availableOrders = [0, 1, 2].filter(
        (order) => !usedOrders.has(order),
      );
      for (let index = 0; index < files.length; index += 1) {
        const variants = await processImage(files[index]);
        await uploadBeneficiaryImage({
          beneficiaryId,
          ...variants,
          altText: '',
          sortOrder: availableOrders[index],
        });
      }
      await onChanged();
    } catch (caught) {
      setError(
        caught.message ||
          'No fue posible subir la fotografía. Puedes reintentar.',
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleRemove(image) {
    if (!window.confirm('¿Eliminar esta fotografía del perfil?')) return;
    setBusy(true);
    setError('');
    try {
      await removeBeneficiaryImage(image);
      await onChanged();
    } catch (caught) {
      setError(caught.message || 'No fue posible eliminar la fotografía.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 1 }}>
        Fotografías
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Hasta tres archivos JPG, PNG o WebP de 10 MB. El navegador crea
        versiones WebP y no conserva el original.
      </Typography>
      {error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : null}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
          gap: 2,
          mb: 3,
        }}
      >
        {images.map((image, index) => (
          <Box
            key={image.id}
            sx={{
              position: 'relative',
              borderRadius: 2,
              overflow: 'hidden',
              bgcolor: '#E9E1D2',
              aspectRatio: '4 / 3',
            }}
          >
            {image.thumbnail_url ? (
              <Box
                component="img"
                src={image.thumbnail_url}
                alt={image.alt_text || `Fotografía ${index + 1}`}
                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : null}
            <IconButton
              onClick={() => handleRemove(image)}
              disabled={busy}
              aria-label={`Eliminar fotografía ${index + 1}`}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                bgcolor: 'rgba(255,255,255,.92)',
                '&:hover': { bgcolor: 'white' },
              }}
            >
              <DeleteOutlineRoundedIcon />
            </IconButton>
          </Box>
        ))}
      </Box>
      <input
        ref={inputRef}
        hidden
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={handleFiles}
      />
      <Button
        variant="outlined"
        startIcon={
          busy ? (
            <CircularProgress size={18} />
          ) : (
            <AddPhotoAlternateRoundedIcon />
          )
        }
        onClick={() => inputRef.current?.click()}
        disabled={busy || remaining === 0}
      >
        {remaining === 0
          ? 'Límite de 3 alcanzado'
          : `Agregar ${remaining === 1 ? 'fotografía' : 'fotografías'}`}
      </Button>
    </Box>
  );
}
