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

function App() {
return (
  <BrowserRouter>
    <SnackbarProvider maxSnack={4}>
      <Layout>
        <Routes>
          <Route path='/home' element={<Home />}/>
          <Route path='/calculation' element={<Calculation />}/>
          <Route path='/methods' element={<Methods />}/>
          <Route path='/about' element={<About />}/>
          <Route path='/contact' element={<Contact />}/>
          <Route path="*" element={<Navigate to='/home' replace={true} />} />
        </Routes>
      </Layout>
    </SnackbarProvider>
  </BrowserRouter>
);
}

export default App;