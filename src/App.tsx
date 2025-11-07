import { useState } from "react";
import { useEventInfo } from "./hooks/useEventInfo.ts";

import EventHeader from "./components/EventHeader.tsx";
import EventContent from "./components/EventContent.tsx";
import EventActions from "./components/EventActions.tsx";
import RSVPModal from "./components/RSVPModal";

import "./App.css";

function App() {
  const [attending, setAttending] = useState<boolean | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { eventInfo, isLoading, apiError } = useEventInfo();

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
        <EventHeader />
        <EventContent
          isLoading={isLoading}
          apiError={apiError}
          eventDate={eventInfo?.eventInfo?.eventDate}
        />
        <EventActions
          onWillAttend={handleWillAttend}
          onWillNotAttend={handleWillNotAttend}
        />
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
