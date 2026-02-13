import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const BookingAuthContext = createContext();

const BOOKINGS_KEY = 'travelflow-bookings';
const AUTH_KEY = 'travelflow-auth';

// Generate a simple 6-digit PIN
function generatePin() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// Demo seed bookings — available out of the box for testing
const DEMO_BOOKINGS = [
  {
    bookingId: 'TF-FL-0001-DEMO01',
    email: 'demo@travelflow.com',
    name: 'John Traveler',
    phone: '+1 234 567 8901',
    date: '2026-03-15',
    airline: 'Emirates',
    airlineLogo: '🛫',
    flightNumber: 'EK-501',
    aircraft: 'Airbus A380',
    originCode: 'JFK',
    originCity: 'New York',
    destCode: 'DXB',
    destCity: 'Dubai',
    departure: '22:30',
    arrival: '19:10',
    duration: '12h 40m',
    cabinClass: 'Business',
    seats: '4A, 4B',
    passengers: 2,
    totalPaid: '$8,450 USD',
    pin: '482916',
    status: 'confirmed',
    createdAt: Date.now() - 86400000 * 3,
    ticketUrl: '',
  },
  {
    bookingId: 'TF-FL-0002-DEMO02',
    email: 'demo@travelflow.com',
    name: 'John Traveler',
    phone: '+1 234 567 8901',
    date: '2026-04-20',
    airline: 'Singapore Airlines',
    airlineLogo: '✈️',
    flightNumber: 'SQ-322',
    aircraft: 'Boeing 777',
    originCode: 'LHR',
    originCity: 'London',
    destCode: 'SIN',
    destCity: 'Singapore',
    departure: '09:45',
    arrival: '06:15',
    duration: '13h 30m',
    cabinClass: 'Economy',
    seats: '32A',
    passengers: 1,
    totalPaid: '$1,240 USD',
    pin: '739215',
    status: 'confirmed',
    createdAt: Date.now() - 86400000 * 1,
    ticketUrl: '',
  },
  {
    bookingId: 'TF-FL-0003-DEMO03',
    email: 'test@travelflow.com',
    name: 'Jane Explorer',
    phone: '+44 789 012 3456',
    date: '2026-05-10',
    airline: 'Qatar Airways',
    airlineLogo: '🌍',
    flightNumber: 'QR-008',
    aircraft: 'Boeing 787 Dreamliner',
    originCode: 'DOH',
    originCity: 'Doha',
    destCode: 'CDG',
    destCity: 'Paris',
    departure: '07:20',
    arrival: '13:05',
    duration: '6h 45m',
    cabinClass: 'First Class',
    seats: '1A',
    passengers: 1,
    totalPaid: '$6,780 USD',
    pin: '156348',
    status: 'confirmed',
    createdAt: Date.now() - 86400000 * 5,
    ticketUrl: '',
  },
];

export function BookingAuthProvider({ children }) {
  // All bookings stored locally — seed demo data if empty
  const [bookings, setBookings] = useState(() => {
    try {
      const saved = localStorage.getItem(BOOKINGS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) return parsed;
      }
      // Seed demo bookings on first load
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(DEMO_BOOKINGS));
      return DEMO_BOOKINGS;
    } catch {
      return DEMO_BOOKINGS;
    }
  });

  // Authenticated user session: { email, name, pin } or null
  const [authUser, setAuthUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem(AUTH_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Persist bookings
  useEffect(() => {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
  }, [bookings]);

  // Persist auth session
  useEffect(() => {
    if (authUser) {
      sessionStorage.setItem(AUTH_KEY, JSON.stringify(authUser));
    } else {
      sessionStorage.removeItem(AUTH_KEY);
    }
  }, [authUser]);

  // Save a new booking after payment success
  const saveBooking = useCallback((booking) => {
    const pin = generatePin();
    const record = {
      ...booking,
      pin,
      createdAt: Date.now(),
      status: 'confirmed', // confirmed | modified | cancelled
    };
    setBookings((prev) => [record, ...prev]);
    return pin; // return pin so the user can be shown it
  }, []);

  // Authenticate: user provides email + bookingId + pin
  const authenticate = useCallback((email, bookingId, pin) => {
    const booking = bookings.find(
      (b) => b.bookingId === bookingId && b.email.toLowerCase() === email.toLowerCase() && b.pin === pin
    );
    if (booking) {
      setAuthUser({ email: booking.email, name: booking.name, pin: booking.pin, bookingId: booking.bookingId });
      return { success: true, booking };
    }
    return { success: false };
  }, [bookings]);

  // Quick auth: email only — returns all bookings for that email
  const authenticateByEmail = useCallback((email) => {
    const userBookings = bookings.filter((b) => b.email.toLowerCase() === email.toLowerCase());
    if (userBookings.length > 0) {
      setAuthUser({ email: email.toLowerCase(), name: userBookings[0].name });
      return { success: true, bookings: userBookings };
    }
    return { success: false };
  }, [bookings]);

  // Logout
  const logout = useCallback(() => {
    setAuthUser(null);
    sessionStorage.removeItem(AUTH_KEY);
  }, []);

  // Get bookings for authenticated user
  const getMyBookings = useCallback(() => {
    if (!authUser) return [];
    return bookings.filter((b) => b.email.toLowerCase() === authUser.email.toLowerCase());
  }, [authUser, bookings]);

  // Get a specific booking (only if auth'd)
  const getBooking = useCallback((bookingId) => {
    if (!authUser) return null;
    return bookings.find(
      (b) => b.bookingId === bookingId && b.email.toLowerCase() === authUser.email.toLowerCase()
    ) || null;
  }, [authUser, bookings]);

  // Modify a booking (change date, seats, etc.)
  const modifyBooking = useCallback((bookingId, updates) => {
    if (!authUser) return false;
    setBookings((prev) =>
      prev.map((b) => {
        if (b.bookingId === bookingId && b.email.toLowerCase() === authUser.email.toLowerCase()) {
          return { ...b, ...updates, status: 'modified', modifiedAt: Date.now() };
        }
        return b;
      })
    );
    return true;
  }, [authUser]);

  // Cancel a booking
  const cancelBooking = useCallback((bookingId) => {
    if (!authUser) return false;
    setBookings((prev) =>
      prev.map((b) => {
        if (b.bookingId === bookingId && b.email.toLowerCase() === authUser.email.toLowerCase()) {
          return { ...b, status: 'cancelled', cancelledAt: Date.now() };
        }
        return b;
      })
    );
    return true;
  }, [authUser]);

  const isAuthenticated = !!authUser;

  return (
    <BookingAuthContext.Provider
      value={{
        authUser,
        isAuthenticated,
        bookings,
        saveBooking,
        authenticate,
        authenticateByEmail,
        logout,
        getMyBookings,
        getBooking,
        modifyBooking,
        cancelBooking,
      }}
    >
      {children}
    </BookingAuthContext.Provider>
  );
}

export const useBookingAuth = () => useContext(BookingAuthContext);
