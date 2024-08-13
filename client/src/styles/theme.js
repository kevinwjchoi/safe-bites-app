import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#c42300', // Primary color
      light: '#ff5747', // Lighter shade of primary color
      dark: '#8c1b00', // Darker primary color
    },
    secondary: {
      main: '#ff9800', // Bold orange
      light: '#ffb74d', // Lighter orange
      dark: '#f57c00', // Darker orange
    },
    background: {
      default: '#f5f5f5', // Light gray
      paper: '#e0e0e0', // Off gray
    },
    text: {
      primary: '#212121', // Dark grey text
      secondary: '#757575', // Medium grey text
    },
  },
  typography: {
    fontFamily: '"Montserrat", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700, // Bold font weight
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 700, // Bold font weight
      fontSize: '2rem',
    },
    h4: {
      fontWeight: 700, // Bold font weight
      fontSize: '2rem',
    },
    body1: {
      fontWeight: 700, // Bold font weight
      fontSize: '1rem',
    },
    h6: {
      fontWeight: 700, // Bold font weight
      fontSize: '1.5rem',
    }
  },
});
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '# ', // Updated primary color
      light: '#FF6659', // Lighter shade of primary color
      dark: '#C62828', // Darker primary color
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
      main: '#FF9800', // Bold orange
      light: '#FFB74D', // Lighter orange
      dark: '#F57C00', // Darker orange
    },
  },
  typography: {
    fontFamily: '"Montserrat", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700, // Bold font weight
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 700, // Bold font weight
      fontSize: '2rem',
    },
    h4: {
      fontWeight: 700, // Bold font weight
      fontSize: '2rem',
    },
    body1: {
      fontWeight: 700, // Bold font weight
      fontSize: '1rem',
    },
    h6: {
      fontWeight: 700, // Bold font weight
      fontSize: '1.5rem',
    }
  },
});

export { lightTheme, darkTheme };
