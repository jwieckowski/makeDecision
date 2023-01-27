import { 
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import Layout from '../Layout'

import Home from '../HomePage';
import Calculation from '../CalculationPage';
import AboutPage from '../AboutPage';
import ContactPage from '../ContactPage';

function App() {
return (
  <BrowserRouter>
    <Layout>
      <Routes>
        <Route path='/home' element={<Home />}/>
        <Route path='/calculation' element={<Calculation />}/>
        <Route path='/about' element={<AboutPage />}/>
        <Route path='/contact' element={<ContactPage />}/>
        <Route path="*" element={<Navigate to='/home' replace={true} />} />
      </Routes>
    </Layout>
  </BrowserRouter>
);
}

export default App;