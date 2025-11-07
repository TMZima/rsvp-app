import { useState, useEffect } from "react";

import "./Countdown.css";

interface CountdownProps {
  eventDate: string;
}

function Countdown({ eventDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const calculateTimeLeft = () => {
    const now = new Date().getTime();
    const eventTime = new Date(eventDate).getTime();
    const difference = eventTime - now;

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    } else {
      console.log("Event date has passed");
    }
  };

  useEffect(() => {
    calculateTimeLeft();

    const timer = setInterval(() => {
      calculateTimeLeft();
    }, 1000);

    return () => clearInterval(timer);
  }, [eventDate]);

  return (
    <div className="countdown-container">
      <h3 className="countdown-title">Party Starts in:</h3>
      <div className="countdown-display">
        <span className="time-number">{timeLeft.days} Days </span>
        <span className="time-number">{timeLeft.hours} Hours </span>
        <span className="time-number">{timeLeft.minutes} Minutes </span>
        <span className="time-number">{timeLeft.seconds} Seconds </span>
      </div>
    </div>
  );
}

export default Countdown;
