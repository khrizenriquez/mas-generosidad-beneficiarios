import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded';
import { Box, Typography } from '@mui/material';

export function StoryImagePlaceholder({ compact = false }) {
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
          'radial-gradient(circle at 20% 20%, rgba(232,180,74,.72) 0 10%, transparent 10.5%), radial-gradient(circle at 80% 70%, rgba(169,214,207,.8) 0 16%, transparent 16.5%), #E9E1D2',
      }}
    >
      <Box>
        <AutoStoriesRoundedIcon sx={{ fontSize: compact ? 38 : 52, mb: 1 }} />
        <Typography variant="body2" fontWeight={700}>
          Historia sin fotografía
        </Typography>
      </Box>
    </Box>
  );
}
