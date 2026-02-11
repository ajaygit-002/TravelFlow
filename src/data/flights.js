import destinations from './destinations';

// ===== AIRLINES DATA =====
const airlines = [
  { id: 'emirates', name: 'Emirates', code: 'EK', logo: '🛩️', country: 'UAE', flag: '🇦🇪', rating: 4.8, alliance: 'None' },
  { id: 'singapore', name: 'Singapore Airlines', code: 'SQ', logo: '✈️', country: 'Singapore', flag: '🇸🇬', rating: 4.9, alliance: 'Star Alliance' },
  { id: 'qatar', name: 'Qatar Airways', code: 'QR', logo: '🛫', country: 'Qatar', flag: '🇶🇦', rating: 4.8, alliance: 'Oneworld' },
  { id: 'ana', name: 'ANA (All Nippon)', code: 'NH', logo: '🔵', country: 'Japan', flag: '🇯🇵', rating: 4.7, alliance: 'Star Alliance' },
  { id: 'lufthansa', name: 'Lufthansa', code: 'LH', logo: '🟡', country: 'Germany', flag: '🇩🇪', rating: 4.5, alliance: 'Star Alliance' },
  { id: 'british', name: 'British Airways', code: 'BA', logo: '🇬🇧', country: 'UK', flag: '🇬🇧', rating: 4.4, alliance: 'Oneworld' },
  { id: 'air-france', name: 'Air France', code: 'AF', logo: '🇫🇷', country: 'France', flag: '🇫🇷', rating: 4.3, alliance: 'SkyTeam' },
  { id: 'delta', name: 'Delta Air Lines', code: 'DL', logo: '🔺', country: 'USA', flag: '🇺🇸', rating: 4.3, alliance: 'SkyTeam' },
  { id: 'united', name: 'United Airlines', code: 'UA', logo: '🌐', country: 'USA', flag: '🇺🇸', rating: 4.1, alliance: 'Star Alliance' },
  { id: 'american', name: 'American Airlines', code: 'AA', logo: '🦅', country: 'USA', flag: '🇺🇸', rating: 4.0, alliance: 'Oneworld' },
  { id: 'cathay', name: 'Cathay Pacific', code: 'CX', logo: '🟢', country: 'Hong Kong', flag: '🇭🇰', rating: 4.6, alliance: 'Oneworld' },
  { id: 'thai', name: 'Thai Airways', code: 'TG', logo: '🟣', country: 'Thailand', flag: '🇹🇭', rating: 4.3, alliance: 'Star Alliance' },
  { id: 'garuda', name: 'Garuda Indonesia', code: 'GA', logo: '🦅', country: 'Indonesia', flag: '🇮🇩', rating: 4.4, alliance: 'SkyTeam' },
  { id: 'turkish', name: 'Turkish Airlines', code: 'TK', logo: '🔴', country: 'Turkey', flag: '🇹🇷', rating: 4.5, alliance: 'Star Alliance' },
  { id: 'etihad', name: 'Etihad Airways', code: 'EY', logo: '🌟', country: 'UAE', flag: '🇦🇪', rating: 4.6, alliance: 'None' },
  { id: 'air-india', name: 'Air India', code: 'AI', logo: '🇮🇳', country: 'India', flag: '🇮🇳', rating: 3.9, alliance: 'Star Alliance' },
  { id: 'korean', name: 'Korean Air', code: 'KE', logo: '🔵', country: 'South Korea', flag: '🇰🇷', rating: 4.5, alliance: 'SkyTeam' },
  { id: 'swiss', name: 'SWISS', code: 'LX', logo: '🇨🇭', country: 'Switzerland', flag: '🇨🇭', rating: 4.5, alliance: 'Star Alliance' },
  { id: 'qantas', name: 'Qantas', code: 'QF', logo: '🦘', country: 'Australia', flag: '🇦🇺', rating: 4.4, alliance: 'Oneworld' },
  { id: 'air-nz', name: 'Air New Zealand', code: 'NZ', logo: '🥝', country: 'New Zealand', flag: '🇳🇿', rating: 4.6, alliance: 'Star Alliance' },
];

// ===== CABIN CLASSES =====
const cabinClasses = [
  { id: 'economy', name: 'Economy', icon: '💺', multiplier: 1.0 },
  { id: 'premium-economy', name: 'Premium Economy', icon: '🪑', multiplier: 1.6 },
  { id: 'business', name: 'Business', icon: '🛋️', multiplier: 3.0 },
  { id: 'first', name: 'First Class', icon: '👑', multiplier: 5.5 },
];

// Helper to generate seeded random
function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

// ===== GENERATE FLIGHTS FOR ALL DESTINATIONS =====
function generateFlights() {
  const flights = [];
  const originCities = [
    { code: 'JFK', city: 'New York', country: 'United States', flag: '🇺🇸' },
    { code: 'LHR', city: 'London', country: 'United Kingdom', flag: '🇬🇧' },
    { code: 'DXB', city: 'Dubai', country: 'UAE', flag: '🇦🇪' },
    { code: 'SIN', city: 'Singapore', country: 'Singapore', flag: '🇸🇬' },
    { code: 'DEL', city: 'New Delhi', country: 'India', flag: '🇮🇳' },
    { code: 'SYD', city: 'Sydney', country: 'Australia', flag: '🇦🇺' },
  ];

  const destAirports = {
    paris: { code: 'CDG', city: 'Paris' },
    tokyo: { code: 'NRT', city: 'Tokyo' },
    bali: { code: 'DPS', city: 'Bali (Denpasar)' },
    'new-york': { code: 'JFK', city: 'New York' },
  };

  let flightId = 1;

  destinations.forEach((dest) => {
    const airport = destAirports[dest.id] || { code: dest.name.substring(0, 3).toUpperCase(), city: dest.name };

    // Pick 4-6 airlines per destination
    const rand = seededRandom(dest.name.length * 17 + dest.price);
    const numAirlines = 4 + Math.floor(rand() * 3);
    const shuffled = [...airlines].sort(() => rand() - 0.5).slice(0, numAirlines);

    shuffled.forEach((airline) => {
      // Pick 2-3 origins per airline
      const numOrigins = 2 + Math.floor(rand() * 2);
      const origins = [...originCities]
        .filter((o) => o.city !== airport.city)
        .sort(() => rand() - 0.5)
        .slice(0, numOrigins);

      origins.forEach((origin) => {
        // Generate departure times
        const hours = [6, 8, 10, 14, 16, 20, 22];
        const depHour = hours[Math.floor(rand() * hours.length)];
        const depMin = Math.floor(rand() * 4) * 15;
        const duration = 2 + Math.floor(rand() * 14);
        const durationMin = Math.floor(rand() * 4) * 15;
        const arrHour = (depHour + duration) % 24;
        const stops = rand() > 0.6 ? 0 : rand() > 0.4 ? 1 : 2;

        // Base price by distance factor
        const basePriceUSD = Math.round(120 + duration * 45 + rand() * 200);

        // Capacity
        const totalSeats = 150 + Math.floor(rand() * 200);
        const booked = Math.floor(totalSeats * (0.4 + rand() * 0.5));
        const available = totalSeats - booked;

        flights.push({
          id: `FL-${String(flightId++).padStart(4, '0')}`,
          airline: airline,
          flightNumber: `${airline.code}${100 + Math.floor(rand() * 900)}`,
          origin: origin,
          destination: { code: airport.code, city: airport.city, country: dest.country, flag: dest.flag },
          destinationId: dest.id,
          departure: `${String(depHour).padStart(2, '0')}:${String(depMin).padStart(2, '0')}`,
          arrival: `${String(arrHour).padStart(2, '0')}:${String(durationMin).padStart(2, '0')}`,
          duration: `${duration}h ${durationMin > 0 ? durationMin + 'm' : '00m'}`,
          stops,
          basePriceUSD,
          capacity: {
            total: totalSeats,
            booked,
            available,
          },
          aircraft: ['Boeing 777', 'Boeing 787 Dreamliner', 'Airbus A380', 'Airbus A350', 'Boeing 737 MAX'][Math.floor(rand() * 5)],
          amenities: [
            rand() > 0.3 ? 'Wi-Fi' : null,
            rand() > 0.4 ? 'In-flight Entertainment' : null,
            rand() > 0.5 ? 'USB Charging' : null,
            rand() > 0.6 ? 'Meal Included' : null,
            rand() > 0.7 ? 'Extra Legroom' : null,
          ].filter(Boolean),
        });
      });
    });
  });

  return flights;
}

const flights = generateFlights();

export { airlines, cabinClasses };
export default flights;
