import { useState } from "react";

import "./App.css";
import RSVPModal from "./components/RSVPModal";

function App() {
  const [attending, setAttending] = useState<boolean | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        <p className="date">December 6th, 2027</p>
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
