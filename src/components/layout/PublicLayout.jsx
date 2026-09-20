import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import { AppBar, Box, Button, Container, Link, Toolbar } from '@mui/material';
import { Link as RouterLink, Outlet } from 'react-router-dom';
import { useI18n } from '../../i18n/useI18n.js';
import { BrandMark } from '../BrandMark.jsx';
import { LanguageSelector } from './LanguageSelector.jsx';

const organizationUrl = 'https://masgenerosidad.org/';

export function PublicLayout() {
  const { t } = useI18n();

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Link className="skip-link" href="#contenido">
        {t('layout.skipToContent')}
      </Link>
      <AppBar
        position="static"
        elevation={0}
        color="transparent"
        sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
      >
        <Container maxWidth="lg">
          <Toolbar
            disableGutters
            sx={{ minHeight: { xs: 72, md: 82 }, gap: 2 }}
          >
            <Link
              component={RouterLink}
              to="/"
              underline="none"
              color="text.primary"
              aria-label={t('layout.homeLink')}
            >
              <BrandMark name={t('brand.name')} tagline={t('brand.tagline')} />
            </Link>
            <Box sx={{ flex: 1 }} />
            <LanguageSelector />
            <Button
              component="a"
              href={organizationUrl}
              target="_blank"
              rel="noreferrer"
              endIcon={<OpenInNewRoundedIcon />}
              sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
            >
              {t('layout.organizationLink')}
            </Button>
          </Toolbar>
        </Container>
      </AppBar>

      <Box component="main" id="contenido" sx={{ flex: 1 }}>
        <Outlet />
      </Box>

      <Box
        component="footer"
        sx={{
          mt: 10,
          bgcolor: 'primary.dark',
          color: 'white',
          py: { xs: 4, md: 5 },
        }}
      >
        <Container maxWidth="lg">
          <Box
            data-testid="footer-links"
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              flexWrap: 'wrap',
              gap: { xs: 2, sm: 3 },
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            <Link
              href="https://khrizenriquez.github.io/khrizenriquez/"
              target="_blank"
              rel="noreferrer"
              color="inherit"
            >
              {t('layout.footerCredit')}
            </Link>
            <Box
              aria-hidden="true"
              sx={{
                display: { xs: 'none', sm: 'block' },
                width: 6,
                height: 6,
                borderRadius: '50%',
                bgcolor: 'secondary.main',
              }}
            />
            <Link
              href={organizationUrl}
              target="_blank"
              rel="noreferrer"
              color="inherit"
            >
              {t('layout.organizationDomain')}
            </Link>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
