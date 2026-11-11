import './LoadingScreen.css';

// Full-height placeholder shown while data loads, or an error with a retry button
export default function LoadingScreen({ message, error, onRetry }) {
  if (error) {
    return (
      <div className="loading-screen">
        <p className="loading-screen__message" role="alert">
          {error}
        </p>
        {onRetry && (
          <button type="button" className="loading-screen__retry" onClick={onRetry}>
            Try again
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="loading-screen">
      <div className="loading-screen__spinner" aria-hidden="true" />
      <p className="loading-screen__message" role="status">
        {message}
      </p>
    </div>
  );
}
