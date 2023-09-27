import { createTheme } from '@mui/material/styles';
import '@/index.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#29B6F6',
      light: '#71D4FA',
      dark: '#0288D1',
      contrastText: '#fff',
    },
    secondary: {
      main: '#707070',
      light: '#A0A0A0',
      dark: '#505050',
      contrastText: '#fff',
    },
  },
});

export default theme;
