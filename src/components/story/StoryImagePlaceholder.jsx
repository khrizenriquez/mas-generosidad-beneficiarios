import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded';
import { Box, Typography } from '@mui/material';
import { useI18n } from '../../i18n/useI18n.js';

export function StoryImagePlaceholder({ compact = false }) {
  const { t } = useI18n();

  return (
    <Box
      sx={{
        minHeight: compact ? 180 : 320,
        height: '100%',
        display: 'grid',
        placeItems: 'center',
        textAlign: 'center',
        p: 3,
        color: 'primary.dark',
        background:
          'radial-gradient(circle at 20% 20%, rgba(19,200,224,.72) 0 10%, transparent 10.5%), radial-gradient(circle at 80% 70%, rgba(83,109,230,.28) 0 16%, transparent 16.5%), #E2F9FC',
      }}
    >
      <Box>
        <AutoStoriesRoundedIcon sx={{ fontSize: compact ? 38 : 52, mb: 1 }} />
        <Typography variant="body2" fontWeight={700}>
          {t('gallery.noPhoto')}
        </Typography>
      </Box>
    </Box>
  );
}
