import { useState, useEffect } from "react";

import RSVPModal from "./components/RSVPModal";
import Countdown from "./components/Countdown";
import "./App.css";

interface EventApiResponse {
  message: string;
  eventInfo: {
    canStillRSVP: boolean;
    daysUntilDeadline: number;
    daysUntilEvent: number;
    eventDate?: string;
    eventLocation: string;
    eventName: string;
    isDeadlinePassed: boolean;
    rsvpDeadline: string;
  };
}

function App() {
  const [attending, setAttending] = useState<boolean | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventInfo, setEventInfo] = useState<EventApiResponse | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEventInfo = async () => {
      try {
        const response = await fetch("/api/rsvp/event-info");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setEventInfo(data);
      } catch (err) {
        console.error("Error fetching event info:", err);
        setApiError("Could not load event information");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventInfo();
  }, []);

  function handleWillAttend() {
    console.log("Will Attend clicked!");
    setIsModalOpen(true);
    setAttending(true);
    console.log("Modal should be open, attending: true (just set it)");
  }

  function handleWillNotAttend() {
    console.log("Will NOT Attend clicked!");
    setIsModalOpen(true);
    setAttending(false);
    console.log("Modal should be open, attending: false (just set it)");
  }

  return (
    <div className="app-container">
      <div className="banner"></div>
      <div className="content">
        <h2 className="script-font name-title">McKinsley's</h2>
        <h3 className="event-title">Winter One-derland</h3>
        <p className="date">December 6th, 2025</p>
        {isLoading ? (
          <div className="loading-container">
            <p className="loading-text">Loading event information...</p>
            <div className="spinner"></div>
          </div>
        ) : apiError ? (
          <div className="error-container">
            <p className="error-text">{apiError}</p>
            <p className="error-fallback">December 6th, 2025</p>
          </div>
        ) : (
          eventInfo?.eventInfo?.eventDate && (
            <Countdown eventDate={eventInfo.eventInfo.eventDate!} />
          )
        )}
        <button className="rsvp-button" onClick={handleWillAttend}>
          Will attend
        </button>
        <button className="rsvp-button" onClick={handleWillNotAttend}>
          Will not attend
        </button>
        {isModalOpen && (
          <RSVPModal
            isModalOpen={isModalOpen}
            attending={attending}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
}

export default App;
