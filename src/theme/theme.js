import { createTheme } from '@mui/material/styles';

const robotoFontFamily = 'Roboto, system-ui, sans-serif';

export const brand = Object.freeze({
  surface: '#F6F8FF',
  surfaceElevated: '#FFFFFF',
  ink: '#14203D',
  muted: '#52617E',
  blue: '#4B63D6',
  blueDark: '#3045B8',
  blueLight: '#E0E6FF',
  cyan: '#13C8E0',
  cyanDark: '#007D95',
  cyanLight: '#E2F9FC',
  divider: '#CBD5F5',
});

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: brand.blue,
      dark: brand.blueDark,
      light: brand.blueLight,
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: brand.cyan,
      dark: brand.cyanDark,
      light: brand.cyanLight,
      contrastText: brand.ink,
    },
    background: { default: brand.surface, paper: brand.surfaceElevated },
    text: { primary: brand.ink, secondary: brand.muted },
    divider: brand.divider,
    info: { main: brand.blue, dark: brand.blueDark, light: brand.blueLight },
    warning: { main: brand.cyan, dark: brand.cyanDark, light: brand.cyanLight },
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: robotoFontFamily,
    h1: {
      fontFamily: robotoFontFamily,
      fontWeight: 700,
      lineHeight: 1.05,
    },
    h2: {
      fontFamily: robotoFontFamily,
      fontWeight: 700,
      lineHeight: 1.1,
    },
    h3: {
      fontFamily: robotoFontFamily,
      fontWeight: 600,
      lineHeight: 1.15,
    },
    h4: { fontFamily: robotoFontFamily, fontWeight: 600 },
    button: { fontWeight: 700, textTransform: 'none' },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { minHeight: 44, borderRadius: 999 } },
    },
    MuiTextField: { defaultProps: { variant: 'outlined', fullWidth: true } },
    MuiCard: { styleOverrides: { root: { backgroundImage: 'none' } } },
    MuiLink: { defaultProps: { underline: 'hover' } },
  },
});
