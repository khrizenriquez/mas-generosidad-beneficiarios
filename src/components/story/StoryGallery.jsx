import { Box } from '@mui/material';
import { getLocalizedImageAlt } from '../../i18n/localization.js';
import { useI18n } from '../../i18n/useI18n.js';
import { StoryImagePlaceholder } from './StoryImagePlaceholder.jsx';

const emptyImages = [];

export function StoryGallery({ images = emptyImages, beneficiaryName }) {
  const { locale, t } = useI18n();
  const galleryImages = images
    .filter((image) => Boolean(image.detail_url))
    .sort(
      (first, second) =>
        Number(second.is_primary) - Number(first.is_primary) ||
        first.sort_order - second.sort_order,
    );

  if (galleryImages.length === 0) return <StoryImagePlaceholder />;

  const [primaryImage, ...supportingImages] = galleryImages;

  return (
    <Box
      component="section"
      aria-label={t('gallery.title', { name: beneficiaryName })}
      sx={{ display: 'grid', gap: 1.5 }}
    >
      <GalleryImage
        image={primaryImage}
        featured
        fallbackAlt={t('gallery.fallbackAlt', {
          name: beneficiaryName,
          position: 1,
        })}
        locale={locale}
      />
      {supportingImages.length > 0 ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: `repeat(${supportingImages.length}, minmax(0, 1fr))`,
            gap: 1.5,
          }}
        >
          {supportingImages.map((image, index) => (
            <GalleryImage
              key={image.id}
              image={image}
              fallbackAlt={t('gallery.fallbackAlt', {
                name: beneficiaryName,
                position: index + 2,
              })}
              locale={locale}
            />
          ))}
        </Box>
      ) : null}
    </Box>
  );
}

function GalleryImage({ image, fallbackAlt, featured = false, locale }) {
  return (
    <Box
      component="img"
      src={image.detail_url}
      alt={getLocalizedImageAlt(image, locale) || fallbackAlt}
      loading={featured ? 'eager' : 'lazy'}
      fetchPriority={featured ? 'high' : 'auto'}
      sx={{
        width: '100%',
        aspectRatio: featured ? '4 / 5' : '4 / 3',
        maxHeight: featured ? 680 : 260,
        objectFit: 'cover',
        borderRadius: featured ? '8px 44px 8px 8px' : 2,
        boxShadow: featured
          ? '0 22px 60px rgba(48,69,184,.16)'
          : '0 10px 28px rgba(48,69,184,.11)',
      }}
    />
  );
}
