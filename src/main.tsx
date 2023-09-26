import React from 'react'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from '@mui/material/styles';

// APP
import App from '@/App'

// SLICES
import store from '@/state'

// TRANSLATIONS
import "@/translations";

// STYLE
import theme from '@/common/theme'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <App />
      </Provider>
    </ThemeProvider>
  </React.StrictMode>,
)
