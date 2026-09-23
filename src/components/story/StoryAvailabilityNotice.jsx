import TranslateRoundedIcon from '@mui/icons-material/TranslateRounded';
import { Alert } from '@mui/material';
import { useI18n } from '../../i18n/useI18n.js';

export function StoryAvailabilityNotice({ compact = false }) {
  const { t } = useI18n();
  return (
    <Alert
      icon={<TranslateRoundedIcon fontSize="inherit" />}
      severity="info"
      variant={compact ? 'outlined' : 'standard'}
      sx={compact ? { mt: 2 } : undefined}
    >
      {compact ? t('story.unavailableOnCard') : t('story.unavailableForLocale')}
    </Alert>
  );
}
