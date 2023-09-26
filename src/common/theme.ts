import { createTheme } from '@mui/material/styles';
import '@/index.css'

const theme = createTheme({
  palette: {
    primary: {
      main: '#5893CF',
      light: '#5893CF',
      dark: '#5893CF',
      contrastText: '#fff',
    },
    secondary: {
      main: '#424949',
      light: '#424949',
      dark: '#424949',
      contrastText: '#fff',
    },
  },
});

export default theme;