import RSVPForm from "./RSVPForm.tsx";

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
        {props.attending ? (
          <>
            <h2>Great! 🩰 You're coming!</h2>
            <RSVPForm onClose={props.onClose} />
          </>
        ) : (
          <>
            <h2>Sorry you can't make it!</h2>
            <button onClick={props.onClose}>Close</button>
          </>
        )}
      </div>
    </div>
  );
}

export default RSVPModal;
