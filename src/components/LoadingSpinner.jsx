import '../styles/spinner.css';

export default function LoadingSpinner() {
  return (
    <div className="spinner-overlay">
      <div className="spinner-wrapper">
        <div className="spinner-plane">✈</div>
        <div className="spinner-ring" />
        <div className="spinner-ring spinner-ring-2" />
        <p className="spinner-text">Loading...</p>
      </div>
    </div>
  );
}
