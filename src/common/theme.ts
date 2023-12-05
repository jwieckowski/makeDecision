import { createTheme } from '@mui/material/styles';
import '@/index.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#29B6F6',
      dark: '#1C7FB1',
      light: '#7ACFF4',
      contrastText: '#fff',
    },
    secondary: {
      main: '#707070',
      dark: '#424242',
      light: '#A5A5A5',
      contrastText: '#fff',
    },
    error: {
      main: '#FF5252',
      dark: '#B51C1C',
      light: '#FF8A80',
    },
    warning: {
      main: '#FFD740',
      dark: '#FFAB00',
      light: '#FFE57F',
    },
    info: {
      main: '#40C4FF',
      dark: '#0091EA',
      light: '#80D8FF',
    },
    success: {
      main: '#4CAF50',
      dark: '#388E3C',
      light: '#81C784',
    },
  },
});

export default theme;
