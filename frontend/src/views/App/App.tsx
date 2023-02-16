import { 
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import Layout from '../Layout'

import Home from '../HomePage';
import Calculation from '../CalculationPage';
import Methods from '../MethodsPage'
import About from '../AboutPage';
import Contact from '../ContactPage';

function App() {
return (
  <BrowserRouter>
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
  </BrowserRouter>
);
}

export default App;