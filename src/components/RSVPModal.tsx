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
        {props.attending !== null && (
          <>
            <h2>
              {props.attending
                ? "Great! 🩰 You're coming!"
                : "Sorry you can't make it!"}
            </h2>
            <RSVPForm onClose={props.onClose} attending={props.attending} />
          </>
        )}
      </div>
    </div>
  );
}

export default RSVPModal;
