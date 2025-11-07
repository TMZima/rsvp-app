import Countdown from "./Countdown";

interface EventContentProps {
  isLoading: boolean;
  apiError: string | null;
  eventDate?: string;
}

function EventContent({ isLoading, apiError, eventDate }: EventContentProps) {
  // If loading, show loading spinner
  if (isLoading) {
    return (
      <div className="loading-container">
        <p className="loading-text">Loading event countdown...</p>
        <div className="spinner"></div>
      </div>
    );
  }

  // If error, show error message
  if (apiError) {
    return (
      <div className="error-container">
        <p className="error-text">{apiError}</p>
      </div>
    );
  }

  // If we have event date, show countdown
  if (eventDate) {
    return <Countdown eventDate={eventDate} />;
  }

  // Fallback - no content to show
  return null;
}

export default EventContent;
