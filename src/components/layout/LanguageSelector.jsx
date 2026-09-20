import TranslateRoundedIcon from '@mui/icons-material/TranslateRounded';
import { Button, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import { supportedLocales } from '../../i18n/catalog.js';
import { useI18n } from '../../i18n/useI18n.js';

export function LanguageSelector() {
  const { locale, setLocale, t } = useI18n();
  const [anchorElement, setAnchorElement] = useState(null);
  const isOpen = Boolean(anchorElement);

  function chooseLocale(nextLocale) {
    setLocale(nextLocale);
    setAnchorElement(null);
  }

  return (
    <>
      <Button
        id="language-selector"
        aria-controls={isOpen ? 'language-menu' : undefined}
        aria-expanded={isOpen ? 'true' : undefined}
        aria-haspopup="menu"
        aria-label={t('language.current', {
          language: t(`language.${locale}`),
        })}
        onClick={(event) => setAnchorElement(event.currentTarget)}
        startIcon={<TranslateRoundedIcon />}
        sx={{ minWidth: 0, px: { xs: 1.25, sm: 2 } }}
      >
        {t(`language.${locale}`)}
      </Button>
      <Menu
        id="language-menu"
        anchorEl={anchorElement}
        open={isOpen}
        onClose={() => setAnchorElement(null)}
        slotProps={{ list: { 'aria-labelledby': 'language-selector' } }}
      >
        {supportedLocales.map((option) => (
          <MenuItem
            key={option}
            selected={option === locale}
            onClick={() => chooseLocale(option)}
          >
            {t(`language.${option}`)}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
