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
import { useRevealOnViewport } from '../../hooks/useRevealOnViewport.js';
import { formatAge } from '../../i18n/catalog.js';
import {
  getLocalizedImageAlt,
  selectLocalization,
} from '../../i18n/localization.js';
import { useI18n } from '../../i18n/useI18n.js';
import { StoryAvailabilityNotice } from './StoryAvailabilityNotice.jsx';
import { StoryImagePlaceholder } from './StoryImagePlaceholder.jsx';

export function StoryCard({ beneficiary }) {
  const { locale, t } = useI18n();
  const { ref, isRevealed, reduceMotion } = useRevealOnViewport();
  const image =
    beneficiary.images?.find((item) => item.is_primary) ??
    beneficiary.images?.[0];
  const localization = selectLocalization(beneficiary, locale);
  return (
    <Card
      component="article"
      ref={ref}
      className="story-card"
      data-revealed={isRevealed ? 'true' : 'false'}
      data-reduced-motion={reduceMotion ? 'true' : 'false'}
      sx={{
        height: '100%',
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 16px 44px rgba(48,69,184,.12)',
        opacity: isRevealed || reduceMotion ? 1 : 0,
        transform:
          isRevealed || reduceMotion ? 'translateY(0)' : 'translateY(48px)',
        transition: reduceMotion
          ? 'none'
          : 'opacity 620ms cubic-bezier(.2,.8,.2,1), transform 620ms cubic-bezier(.2,.8,.2,1), box-shadow 180ms ease',
        '&:hover': {
          boxShadow: '0 22px 52px rgba(48,69,184,.2)',
        },
        '&:hover .story-card__image, &:focus-within .story-card__image': {
          transform: reduceMotion ? 'none' : 'scale(1.2)',
        },
      }}
    >
      <Box sx={{ height: 220, overflow: 'hidden' }}>
        {image?.thumbnail_url ? (
          <CardMedia
            component="img"
            image={image.thumbnail_url}
            alt={
              getLocalizedImageAlt(image, locale) ||
              t('gallery.fallbackAlt', {
                name: beneficiary.full_name,
                position: 1,
              })
            }
            loading="lazy"
            className="story-card__image"
            sx={{
              height: '100%',
              objectFit: 'cover',
              transform: 'scale(1)',
              transition: reduceMotion
                ? 'none'
                : 'transform 460ms cubic-bezier(.2,.8,.2,1)',
            }}
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
            <Chip size="small" label={formatAge(locale, beneficiary.age)} />
          ) : null}
          {localization?.school_grade ? (
            <Chip
              size="small"
              variant="outlined"
              label={localization.school_grade}
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
        {localization ? (
          <Box
            sx={{
              borderLeft: '4px solid',
              borderColor: 'warning.main',
              pl: 2,
              mb: 2,
            }}
          >
            <>
              <Typography variant="overline" color="text.secondary">
                {t('story.dreamsOf')}
              </Typography>
              <Typography fontWeight={700}>
                {localization.future_goal}
              </Typography>
            </>
          </Box>
        ) : null}
        {localization ? (
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
            {localization.public_story}
          </Typography>
        ) : (
          <StoryAvailabilityNotice compact />
        )}
        <Button
          component={RouterLink}
          to={`/historias/${beneficiary.code}`}
          endIcon={<ArrowForwardRoundedIcon />}
          sx={{ mt: 'auto', alignSelf: 'flex-start' }}
        >
          {t('story.readStory')}
        </Button>
      </CardContent>
    </Card>
  );
}
