import { Box, Typography } from '@mui/material';

export function BrandMark({
  compact = false,
  color = 'inherit',
  name = 'Más Generosidad',
  tagline = 'historias que acercan',
}) {
  return (
    <Box
      sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.25, color }}
    >
      <Box
        aria-hidden="true"
        sx={{
          width: compact ? 32 : 38,
          height: compact ? 32 : 38,
          borderRadius: '50% 50% 42% 58%',
          bgcolor: 'secondary.main',
          position: 'relative',
          transform: 'rotate(-8deg)',
          '&::after': {
            content: '""',
            position: 'absolute',
            width: '48%',
            height: '48%',
            right: -3,
            top: -3,
            borderRadius: '60% 10% 60% 10%',
            bgcolor: 'primary.main',
          },
        }}
      />
      <Box>
        <Typography
          component="span"
          sx={{
            display: 'block',
            fontWeight: 700,
            lineHeight: 1,
          }}
        >
          {name}
        </Typography>
        {compact ? null : (
          <Typography component="span" variant="caption" sx={{ opacity: 0.78 }}>
            {tagline}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
