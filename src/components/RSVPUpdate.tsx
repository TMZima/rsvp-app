import { useParams, useNavigate } from "react-router-dom";
import { useRsvpByToken } from "../hooks/useRsvpByToken";
import RSVPForm from "./RSVPForm";

export default function RSVPUpdate() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { rsvp, isLoading, apiError } = useRsvpByToken(token);

  return (
    <div className="app-container">
      <div className="banner"></div>
      <div className="content">
        <div className="modal-overlay">
          <div className="modal-content">
            {isLoading ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <div className="spinner"></div>
                <div className="loading-text">Getting RSVP details...</div>
              </div>
            ) : (
              <>
                <h2>Update Your RSVP</h2>
                {apiError ? (
                  <div style={{ color: "red" }}>{apiError}</div>
                ) : rsvp ? (
                  <RSVPForm
                    initialValues={rsvp}
                    onClose={() => navigate("/")}
                    mode="update"
                  />
                ) : (
                  <div>RSVP not found.</div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
