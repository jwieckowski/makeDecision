import { createTheme } from '@mui/material/styles';
import '@/index.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#5893CF',
      light: '#61A5E9',
      dark: '#4B7FB3',
      contrastText: '#fff',
    },
    secondary: {
      main: '#424949',
      light: '#667171',
      dark: '#323737',
      contrastText: '#fff',
    },
  },
});

export default theme;
