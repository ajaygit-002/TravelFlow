import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import '../styles/payment.css';

const CARD_TYPES = {
  visa: { name: 'Visa', icon: '💳', color: '#1a1f71' },
  mastercard: { name: 'Mastercard', icon: '🔴', color: '#eb001b' },
  amex: { name: 'Amex', icon: '💠', color: '#006fcf' },
  rupay: { name: 'RuPay', icon: '🇮🇳', color: '#0072bc' },
};

function detectCardType(number) {
  const n = number.replace(/\s/g, '');
  if (/^4/.test(n)) return 'visa';
  if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return 'mastercard';
  if (/^3[47]/.test(n)) return 'amex';
  if (/^6[0-9]/.test(n) || /^81/.test(n) || /^82/.test(n)) return 'rupay';
  return null;
}

function formatCardNumber(val) {
  const v = val.replace(/\D/g, '').slice(0, 16);
  return v.replace(/(.{4})/g, '$1 ').trim();
}

const UPI_APPS = [
  { id: 'gpay', name: 'Google Pay', icon: '🟢', color: '#4285f4' },
  { id: 'phonepe', name: 'PhonePe', icon: '🟣', color: '#5f259f' },
  { id: 'paytm', name: 'Paytm', icon: '🔵', color: '#00baf2' },
  { id: 'bhim', name: 'BHIM', icon: '🇮🇳', color: '#00529b' },
];

const NET_BANKS = [
  { id: 'sbi', name: 'State Bank of India', icon: '🏦' },
  { id: 'hdfc', name: 'HDFC Bank', icon: '🏦' },
  { id: 'icici', name: 'ICICI Bank', icon: '🏦' },
  { id: 'axis', name: 'Axis Bank', icon: '🏦' },
  { id: 'kotak', name: 'Kotak Mahindra', icon: '🏦' },
  { id: 'pnb', name: 'Punjab National Bank', icon: '🏦' },
];

export default function PaymentGateway({
  amount,
  gstAmount,
  basePrice,
  destination,
  travelers,
  travelDate,
  customerName,
  customerEmail,
  onSuccess,
  onBack,
}) {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [selectedUpi, setSelectedUpi] = useState(null);
  const [selectedBank, setSelectedBank] = useState(null);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const cardPreviewRef = useRef(null);
  const gatewayRef = useRef(null);

  const cardType = detectCardType(cardNumber);

  // Animate card preview on number change
  useEffect(() => {
    if (cardPreviewRef.current) {
      gsap.fromTo(cardPreviewRef.current,
        { rotateY: 5, scale: 0.98 },
        { rotateY: 0, scale: 1, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, [cardNumber, cardName, expiry]);

  // Animate method switch
  const switchMethod = (method) => {
    gsap.to('.pg-method-body', {
      opacity: 0, y: 15, duration: 0.2,
      onComplete: () => {
        setPaymentMethod(method);
        // Reset selections when switching
        setSelectedUpi(null);
        setSelectedBank(null);
        setSelectedWallet(null);
        gsap.fromTo('.pg-method-body',
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' }
        );
      },
    });
  };

  const handlePayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setProcessingStep(0);

    // Animate processing overlay
    gsap.fromTo('.pg-processing',
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out' }
    );

    // Simulate payment steps
    const steps = [
      'Verifying payment details...',
      'Connecting to payment gateway...',
      'Processing transaction...',
      'Applying GST & generating invoice...',
      'Payment successful!',
    ];

    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i < steps.length) {
        setProcessingStep(i);
        gsap.fromTo('.pg-processing-step',
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' }
        );
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsProcessing(false);
          onSuccess();
        }, 800);
      }
    }, 1200);
  };

  const processingSteps = [
    'Verifying payment details...',
    'Connecting to payment gateway...',
    'Processing transaction...',
    'Applying GST & generating invoice...',
    'Payment successful! ✓',
  ];

  return (
    <div className="payment-gateway" ref={gatewayRef}>
      {/* Processing Overlay */}
      {isProcessing && (
        <div className="pg-processing">
          <div className="pg-processing-card">
            <div className="pg-processing-spinner" />
            <h3 className="pg-processing-title">Processing Payment</h3>
            <p className="pg-processing-step">{processingSteps[processingStep]}</p>
            <div className="pg-processing-bar">
              <div
                className="pg-processing-fill"
                style={{ width: `${((processingStep + 1) / processingSteps.length) * 100}%` }}
              />
            </div>
            <div className="pg-processing-amount">${amount.toFixed(2)}</div>
            <div className="pg-processing-meta">
              <span>incl. GST ${gstAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      <div className="pg-grid">
        {/* Left: Payment Methods */}
        <div className="pg-card pg-section">
          <div className="pg-header">
            <button className="pg-back-btn" onClick={onBack}>← Back</button>
            <div>
              <h2 className="pg-title">Payment</h2>
              <p className="pg-subtitle">Choose your preferred payment method</p>
            </div>
          </div>

          {/* Method Tabs */}
          <div className="pg-tabs">
            {[
              { id: 'card', label: 'Card', icon: '💳' },
              { id: 'upi', label: 'UPI', icon: '📲' },
              { id: 'netbanking', label: 'Net Banking', icon: '🏦' },
              { id: 'wallet', label: 'Wallet', icon: '👛' },
            ].map((m) => (
              <button
                key={m.id}
                className={`pg-tab ${paymentMethod === m.id ? 'active' : ''}`}
                onClick={() => switchMethod(m.id)}
              >
                <span className="pg-tab-icon">{m.icon}</span>
                <span>{m.label}</span>
              </button>
            ))}
          </div>

          {/* Method Body */}
          <div className="pg-method-body">
            {/* CARD */}
            {paymentMethod === 'card' && (
              <form onSubmit={handlePayment} className="pg-card-form">
                {/* Live Card Preview */}
                <div className="pg-card-preview" ref={cardPreviewRef}>
                  <div
                    className="pg-card-visual"
                    style={{ background: cardType ? `linear-gradient(135deg, ${CARD_TYPES[cardType]?.color}, #1f2937)` : 'linear-gradient(135deg, #1f2937, #374151)' }}
                  >
                    <div className="pg-card-visual-top">
                      <span className="pg-card-chip">🔲</span>
                      <span className="pg-card-type-icon">
                        {cardType ? `${CARD_TYPES[cardType].icon} ${CARD_TYPES[cardType].name}` : '💳'}
                      </span>
                    </div>
                    <div className="pg-card-visual-number">
                      {cardNumber || '•••• •••• •••• ••••'}
                    </div>
                    <div className="pg-card-visual-bottom">
                      <div>
                        <span className="pg-card-visual-label">Card Holder</span>
                        <span className="pg-card-visual-value">{cardName || 'YOUR NAME'}</span>
                      </div>
                      <div>
                        <span className="pg-card-visual-label">Expires</span>
                        <span className="pg-card-visual-value">{expiry || 'MM/YY'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pg-form-group">
                  <label className="pg-label">Card Number</label>
                  <input
                    className="pg-input"
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    maxLength={19}
                    required
                  />
                </div>
                <div className="pg-form-group">
                  <label className="pg-label">Name on Card</label>
                  <input
                    className="pg-input"
                    type="text"
                    placeholder="John Doe"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    required
                  />
                </div>
                <div className="pg-form-row">
                  <div className="pg-form-group">
                    <label className="pg-label">Expiry Date</label>
                    <input
                      className="pg-input"
                      type="text"
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={(e) => {
                        let v = e.target.value.replace(/\D/g, '').slice(0, 4);
                        if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2);
                        setExpiry(v);
                      }}
                      maxLength={5}
                      required
                    />
                  </div>
                  <div className="pg-form-group">
                    <label className="pg-label">CVV</label>
                    <input
                      className="pg-input"
                      type="password"
                      placeholder="•••"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      maxLength={4}
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary btn-lg pg-pay-btn">
                  Pay ${amount.toFixed(2)} →
                </button>
              </form>
            )}

            {/* UPI */}
            {paymentMethod === 'upi' && (
              <div className="pg-upi-section">
                <div className="pg-upi-apps">
                  {UPI_APPS.map((app) => (
                    <button
                      key={app.id}
                      className={`pg-upi-app ${selectedUpi === app.id ? 'active' : ''}`}
                      onClick={() => setSelectedUpi(app.id)}
                    >
                      <span className="pg-upi-app-icon">{app.icon}</span>
                      <span>{app.name}</span>
                    </button>
                  ))}
                </div>
                <div className="pg-form-group" style={{ marginTop: 20 }}>
                  <label className="pg-label">UPI ID</label>
                  <input
                    className="pg-input"
                    type="text"
                    placeholder="yourname@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                  />
                </div>
                <button
                  className="btn btn-primary btn-lg pg-pay-btn"
                  onClick={handlePayment}
                  disabled={!upiId}
                >
                  Pay ${amount.toFixed(2)} via UPI →
                </button>
              </div>
            )}

            {/* NET BANKING */}
            {paymentMethod === 'netbanking' && (
              <div className="pg-netbanking-section">
                <p className="pg-nb-label">Select Your Bank</p>
                <div className="pg-bank-grid">
                  {NET_BANKS.map((bank) => (
                    <button
                      key={bank.id}
                      className={`pg-bank-btn ${selectedBank === bank.id ? 'active' : ''}`}
                      onClick={() => setSelectedBank(bank.id)}
                    >
                      <span className="pg-bank-icon">{bank.icon}</span>
                      <span>{bank.name}</span>
                    </button>
                  ))}
                </div>
                <button
                  className="btn btn-primary btn-lg pg-pay-btn"
                  onClick={handlePayment}
                  disabled={!selectedBank}
                  style={{ marginTop: 24 }}
                >
                  Pay ${amount.toFixed(2)} via Net Banking →
                </button>
              </div>
            )}

            {/* WALLET */}
            {paymentMethod === 'wallet' && (
              <div className="pg-wallet-section">
                <div className="pg-wallet-grid">
                  {[
                    { id: 'paytm', name: 'Paytm Wallet', icon: '🔵', bal: '$1,240.00' },
                    { id: 'amazon', name: 'Amazon Pay', icon: '🟠', bal: '$856.50' },
                    { id: 'mobikwik', name: 'MobiKwik', icon: '🔴', bal: '$320.00' },
                    { id: 'freecharge', name: 'Freecharge', icon: '🟢', bal: '$150.75' },
                  ].map((w) => (
                    <button
                      key={w.id}
                      className={`pg-wallet-btn ${selectedWallet === w.id ? 'active' : ''}`}
                      onClick={() => setSelectedWallet(w.id)}
                    >
                      <span className="pg-wallet-icon">{w.icon}</span>
                      <div className="pg-wallet-info">
                        <span className="pg-wallet-name">{w.name}</span>
                        <span className="pg-wallet-bal">Balance: {w.bal}</span>
                      </div>
                    </button>
                  ))}
                </div>
                <button
                  className="btn btn-primary btn-lg pg-pay-btn"
                  onClick={handlePayment}
                  disabled={!selectedWallet}
                  style={{ marginTop: 24 }}
                >
                  Pay ${amount.toFixed(2)} via Wallet →
                </button>
              </div>
            )}
          </div>

          {/* Security badges */}
          <div className="pg-security">
            <span className="pg-security-badge">🔒 256-bit SSL Encrypted</span>
            <span className="pg-security-badge">✓ PCI DSS Compliant</span>
            <span className="pg-security-badge">🛡️ Secure Gateway</span>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="pg-summary pg-section">
          <h3 className="pg-summary-title">Order Summary</h3>

          <div className="pg-summary-dest">
            <img className="pg-summary-img" src={destination.thumb} alt={destination.name} />
            <div>
              <h4>{destination.flag} {destination.name}</h4>
              <p>{destination.duration} · {travelers} Traveler{travelers > 1 ? 's' : ''}</p>
              <p className="pg-summary-date">📅 {travelDate}</p>
            </div>
          </div>

          <div className="pg-summary-rows">
            <div className="pg-summary-row">
              <span>Base ({travelers} × ${destination.price})</span>
              <span>${basePrice.toFixed(2)}</span>
            </div>
            <div className="pg-summary-divider" />
            <div className="pg-summary-row pg-gst-label">
              <span>CGST @ 9%</span>
              <span>${(gstAmount / 2).toFixed(2)}</span>
            </div>
            <div className="pg-summary-row pg-gst-label">
              <span>SGST @ 9%</span>
              <span>${(gstAmount / 2).toFixed(2)}</span>
            </div>
            <div className="pg-summary-row pg-gst-highlight">
              <span>Total GST (18%)</span>
              <span>${gstAmount.toFixed(2)}</span>
            </div>
            <div className="pg-summary-divider" />
            <div className="pg-summary-row pg-summary-total">
              <span>Total</span>
              <span>${amount.toFixed(2)}</span>
            </div>
          </div>

          <div className="pg-summary-customer">
            <h4>Billing Details</h4>
            <p>👤 {customerName}</p>
            <p>📧 {customerEmail}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
