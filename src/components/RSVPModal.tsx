import "./RSVPModal.css";

interface RSVPModalProps {
  isModalOpen: boolean;
  attending: boolean | null;
  onClose: () => void;
}

function RSVPModal(props: RSVPModalProps) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>
          {props.attending
            ? "Great! You're coming!"
            : "Sorry you can't make it!"}
        </h2>
        <button onClick={props.onClose}>Close</button>
      </div>
    </div>
  );
}

export default RSVPModal;
