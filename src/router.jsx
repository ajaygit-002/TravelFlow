import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import LoadingSpinner from './components/LoadingSpinner';

/* Lazy-loaded pages */
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Destinations = lazy(() => import('./pages/Destinations'));
const Contact = lazy(() => import('./pages/Contact'));
const Currencies = lazy(() => import('./pages/Currencies'));
const DestinationDetails = lazy(() => import('./pages/DestinationDetails'));
const Booking = lazy(() => import('./pages/Booking'));
const HelpCenter = lazy(() => import('./pages/HelpCenter'));
const FAQs = lazy(() => import('./pages/FAQs'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const GetStarted = lazy(() => import('./pages/GetStarted'));
const FlightBooking = lazy(() => import('./pages/FlightBooking'));
const FlightDetails = lazy(() => import('./pages/FlightDetails'));
const TicketView = lazy(() => import('./pages/TicketView'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const MyBookings = lazy(() => import('./pages/MyBookings'));
const NotFound = lazy(() => import('./pages/NotFound'));

function SuspenseWrap({ children }) {
  return <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <SuspenseWrap><Home /></SuspenseWrap> },
      { path: 'about', element: <SuspenseWrap><About /></SuspenseWrap> },
      { path: 'destinations', element: <SuspenseWrap><Destinations /></SuspenseWrap> },
      { path: 'destination/:id', element: <SuspenseWrap><DestinationDetails /></SuspenseWrap> },
      { path: 'booking/:id', element: <SuspenseWrap><Booking /></SuspenseWrap> },
      { path: 'currencies', element: <SuspenseWrap><Currencies /></SuspenseWrap> },
      { path: 'contact', element: <SuspenseWrap><Contact /></SuspenseWrap> },
      { path: 'help', element: <SuspenseWrap><HelpCenter /></SuspenseWrap> },
      { path: 'faqs', element: <SuspenseWrap><FAQs /></SuspenseWrap> },
      { path: 'privacy', element: <SuspenseWrap><PrivacyPolicy /></SuspenseWrap> },
      { path: 'terms', element: <SuspenseWrap><TermsOfService /></SuspenseWrap> },
      { path: 'get-started', element: <SuspenseWrap><GetStarted /></SuspenseWrap> },
      { path: 'flights', element: <SuspenseWrap><FlightBooking /></SuspenseWrap> },
      { path: 'flight/:flightId', element: <SuspenseWrap><FlightDetails /></SuspenseWrap> },
      { path: 'ticket', element: <SuspenseWrap><TicketView /></SuspenseWrap> },
      { path: 'wishlist', element: <SuspenseWrap><Wishlist /></SuspenseWrap> },
      { path: 'my-bookings', element: <SuspenseWrap><MyBookings /></SuspenseWrap> },
      { path: '*', element: <SuspenseWrap><NotFound /></SuspenseWrap> },
    ],
  },
]);

export default router;
