
import './PaymentSuccess.css';

export default function PaymentSuccess() {
  // const urlParams = new URLSearchParams(window.location.search);
  // const sessionId = urlParams.get('session_id');

  return (
    <div className="payment-success-page">
      <div className="payment-success-container">
        <div className="payment-success-card">
          <div className="payment-success-icon">
            <svg className="payment-success-checkmark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="payment-success-title">Payment Successful!</h2>
          <p className="payment-success-message">
            Thank you for your purchase. Your subscription is now active.
          </p>
          <div className="payment-success-footer">
            <p className="payment-success-footer-text">
              Click the top-left logo to return to your user home and view your subscription details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}