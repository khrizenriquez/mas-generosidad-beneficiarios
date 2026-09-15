import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { StoryImagePlaceholder } from './StoryImagePlaceholder.jsx';

export function StoryCard({ beneficiary }) {
  const image =
    beneficiary.images?.find((item) => item.is_primary) ??
    beneficiary.images?.[0];
  return (
    <Card
      component="article"
      sx={{
        height: '100%',
        overflow: 'hidden',
        border: '1px solid rgba(32,50,46,.08)',
        boxShadow: '0 16px 44px rgba(32,50,46,.08)',
        transition: 'transform 180ms ease, box-shadow 180ms ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 22px 52px rgba(32,50,46,.13)',
        },
      }}
    >
      <Box sx={{ height: 220, overflow: 'hidden' }}>
        {image?.thumbnail_url ? (
          <CardMedia
            component="img"
            image={image.thumbnail_url}
            alt={image.alt_text || `Fotografía de ${beneficiary.full_name}`}
            loading="lazy"
            sx={{ height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <StoryImagePlaceholder compact />
        )}
      </Box>
      <CardContent
        sx={{ p: 3, display: 'flex', minHeight: 280, flexDirection: 'column' }}
      >
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
          {beneficiary.age !== null ? (
            <Chip size="small" label={`${beneficiary.age} años`} />
          ) : null}
          {beneficiary.school_grade ? (
            <Chip
              size="small"
              variant="outlined"
              label={beneficiary.school_grade}
            />
          ) : null}
        </Box>
        <Typography
          variant="h4"
          component="h2"
          sx={{ fontSize: '1.55rem', mb: 1.5 }}
        >
          {beneficiary.full_name}
        </Typography>
        <Box
          sx={{
            borderLeft: '4px solid',
            borderColor: 'warning.main',
            pl: 2,
            mb: 2,
          }}
        >
          <Typography variant="overline" color="text.secondary">
            Sueña con
          </Typography>
          <Typography fontWeight={700}>
            {beneficiary.future_goal || 'seguir aprendiendo'}
          </Typography>
        </Box>
        <Typography
          color="text.secondary"
          sx={{
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {beneficiary.public_story}
        </Typography>
        <Button
          component={RouterLink}
          to={`/historias/${beneficiary.code}`}
          endIcon={<ArrowForwardRoundedIcon />}
          sx={{ mt: 'auto', alignSelf: 'flex-start' }}
        >
          Leer su historia
        </Button>
      </CardContent>
    </Card>
  );
}
