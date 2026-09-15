import { createTheme } from '@mui/material/styles';

export const brand = {
  paper: '#F8F2E7',
  paperLight: '#FFFDF8',
  ink: '#20322E',
  leaf: '#2E6A58',
  leafDark: '#19483A',
  maize: '#E8B44A',
  clay: '#C96C4A',
  sky: '#A9D6CF',
};

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: brand.leaf,
      dark: brand.leafDark,
      contrastText: '#FFFFFF',
    },
    secondary: { main: brand.clay, contrastText: '#FFFFFF' },
    background: { default: brand.paper, paper: brand.paperLight },
    text: { primary: brand.ink, secondary: '#566963' },
    warning: { main: brand.maize },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: 'Manrope, system-ui, sans-serif',
    h1: {
      fontFamily: 'Fraunces, Georgia, serif',
      fontWeight: 700,
      lineHeight: 1.05,
    },
    h2: {
      fontFamily: 'Fraunces, Georgia, serif',
      fontWeight: 700,
      lineHeight: 1.1,
    },
    h3: {
      fontFamily: 'Fraunces, Georgia, serif',
      fontWeight: 600,
      lineHeight: 1.15,
    },
    h4: { fontFamily: 'Fraunces, Georgia, serif', fontWeight: 600 },
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
