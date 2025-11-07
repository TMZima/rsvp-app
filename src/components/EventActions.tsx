interface EventActionsProps {
  onWillAttend: () => void;
  onWillNotAttend: () => void;
}

function EventActions({ onWillAttend, onWillNotAttend }: EventActionsProps) {
  const handleWillAttend = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.blur(); // Remove focus to prevent blue border
    onWillAttend();
  };

  const handleWillNotAttend = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.blur();
    onWillNotAttend();
  };

  return (
    <>
      <button className="rsvp-button" onClick={handleWillAttend}>
        Will attend
      </button>
      <button className="rsvp-button" onClick={handleWillNotAttend}>
        Will not attend
      </button>
    </>
  );
}

export default EventActions;
