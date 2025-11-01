import "./App.css";

function App() {
  return (
    <div className="app-container">
      <div className="banner"></div>
      <div className="content">
        <h1 className="welcome-title">Welcome</h1>
        <p className="to-text">to</p>
        <h2 className="script-font name-title">McKinsley's</h2>
        <h3 className="event-title">Winter One-derland</h3>
        <p className="date">December 6th, 2025</p>
        <p className="rsvp-text">Please RSVP below</p>
        {/* Your RSVP form will go here */}
      </div>
    </div>
  );
}

export default App;
