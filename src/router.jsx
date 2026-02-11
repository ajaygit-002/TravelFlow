import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import About from './pages/About';
import Destinations from './pages/Destinations';
import Contact from './pages/Contact';
import Currencies from './pages/Currencies';
import DestinationDetails from './pages/DestinationDetails';
import Booking from './pages/Booking';
import HelpCenter from './pages/HelpCenter';
import FAQs from './pages/FAQs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'destinations', element: <Destinations /> },
      { path: 'destination/:id', element: <DestinationDetails /> },
      { path: 'booking/:id', element: <Booking /> },
      { path: 'currencies', element: <Currencies /> },
      { path: 'contact', element: <Contact /> },
      { path: 'help', element: <HelpCenter /> },
      { path: 'faqs', element: <FAQs /> },
      { path: 'privacy', element: <PrivacyPolicy /> },
      { path: 'terms', element: <TermsOfService /> },
    ],
  },
]);

export default router;
