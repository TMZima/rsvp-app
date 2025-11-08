import "./EventFooter.css";

export default function EventFooter() {
  return (
    <footer className="event-footer">
      <div className="footer-banner">
        <span>Website designed &amp; maintained by McKinsley's CTO</span>
      </div>
      <div className="footer-contact">
        For your own RSVP site or other website inquiries email{" "}
        <a href="mailto:trey.m.zima@gmail.com">trey.m.zima@gmail.com</a>
      </div>
    </footer>
  );
}
