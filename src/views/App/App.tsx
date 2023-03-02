import { 
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import { SnackbarProvider} from 'notistack';

import Layout from '../Layout'

import Home from '../HomePage';
import Calculation from '../CalculationPage';
import Methods from '../MethodsPage'
import About from '../AboutPage';
import Contact from '../ContactPage';

import {APP_NAME_PATH} from '../../common/const'

function App() {
return (
  <BrowserRouter>
    <SnackbarProvider maxSnack={4}>
      <Layout>
        <Routes>
          <Route path={`/${APP_NAME_PATH}`} element={<Home />}/>
          <Route path={`/${APP_NAME_PATH}/calculation`} element={<Calculation />}/>
          <Route path={`/${APP_NAME_PATH}/methods`} element={<Methods />}/>
          <Route path={`/${APP_NAME_PATH}/about`} element={<About />}/>
          <Route path={`/${APP_NAME_PATH}/contact`} element={<Contact />}/>
          <Route path="*" element={<Navigate to={`/${APP_NAME_PATH}`} replace={true} />} />
        </Routes>
      </Layout>
    </SnackbarProvider>
  </BrowserRouter>
);
}

export default App;