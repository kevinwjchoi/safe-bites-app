import { createTheme } from '@mui/material/styles';


const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#79A76B', // Sage green
      light: '#79A76B', // Sage garden
      dark: '#4A5D23', // Darker sage green
    },
    secondary: {
      main: '#FF9800', // Bold orange
      light: '#FFB74D', // Lighter orange
      dark: '#F57C00', // Darker orange
    },
    background: {
      default: '#C7D1C5', // Frosted Sage
      paper: '#C7D1C5', // Frosted Sage
    },
    text: {
      primary: '#212121', // Dark grey text
      secondary: '#757575', // Medium grey text
    },
  },
  typography: {
    fontFamily: '"Nunito", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    body1: {
      fontWeight: 400,
      fontSize: '1rem',
    },
    h6: {
      fontWeight: 800,
      fontSize: '1.5rem',
    }
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#007AFF', // Accent blue
      light: '#4D9CFF', // Lighter blue
      dark: '#0051A1', // Darker blue
    },
    background: {
      default: '#1E1E1E', // Primary background
      paper: '#2C2C2C', // Secondary background
    },
    text: {
      primary: '#E0E0E0', // Primary text
      secondary: '#A0A0A0', // Secondary text
    },
    secondary: {
      main: '#FF9800', // Bold orange (same as light)
      light: '#FFB74D', // Lighter orange
      dark: '#F57C00', // Darker orange
    },
  },
  typography: {
    fontFamily: '"Nunito", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    body1: {
      fontWeight: 400,
      fontSize: '1rem',
    },
    h6: {
      fontWeight: 800,
      fontSize: '1.5rem',

    }
  },
});

export { lightTheme, darkTheme };
