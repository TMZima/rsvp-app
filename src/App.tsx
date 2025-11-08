import { useState } from "react";
import { useEventInfo } from "./hooks/useEventInfo.ts";
import { Routes, Route } from "react-router-dom";

import EventHeader from "./components/EventHeader.tsx";
import EventContent from "./components/EventContent.tsx";
import EventActions from "./components/EventActions.tsx";
import EventFooter from "./components/EventFooter.tsx";
import RSVPModal from "./components/RSVPModal";
import RSVPUpdate from "./components/RSVPUpdate.tsx";

import "./App.css";

function App() {
  const [attending, setAttending] = useState<boolean | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { eventInfo, isLoading, apiError } = useEventInfo();

  function handleWillAttend() {
    setIsModalOpen(true);
    setAttending(true);
  }

  function handleWillNotAttend() {
    setIsModalOpen(true);
    setAttending(false);
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
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
            <EventFooter />
          </div>
        }
      />
      <Route path="/update/:token" element={<RSVPUpdate />} />
    </Routes>
  );
}

export default App;
