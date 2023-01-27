import { 
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from 'react-router-dom';

import Layout from './Layout'

import Home from './Content/Home';
import Calculation from './Content/Calculation';
import Technologies from './Content/Technologies';
import About from './Content/About';
import Contact from './Content/Contact';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path='/home' element={<Home />}/>
          <Route path='/calculation' element={<Calculation />}/>
          <Route path='/technologies' element={<Technologies />}/>
          <Route path='/about' element={<About />}/>
          <Route path='/contact' element={<Contact />}/>
          <Route path="*" element={<Navigate to='/home' replace={true} />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;