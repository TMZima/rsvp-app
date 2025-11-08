import { useState } from "react";

import "./RSVPForm.css";

interface RSVPFormProps {
  onClose: () => void;
  attending?: boolean;
  initialValues?: {
    name: string;
    email: string;
    attending: boolean;
    numOfGuests?: number;
    numOfChildren?: number;
    updateToken: string;
  };
  mode?: "create" | "update";
}

export default function RSVPForm({
  onClose,
  attending: attendingProp = true,
  initialValues,
  mode,
}: RSVPFormProps) {
  const [attending, setAttending] = useState(
    initialValues?.attending ?? attendingProp
  );
  const [name, setName] = useState(initialValues?.name || "");
  const [email, setEmail] = useState(initialValues?.email || "");
  const [numOfGuests, setNumOfGuests] = useState(
    initialValues?.numOfGuests ?? 1
  );
  const [numOfChildren, setNumOfChildren] = useState(
    initialValues?.numOfChildren ?? 0
  );
  const [updateLink, setUpdateLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // email validation regex
  function validateEmail(email: string) {
    return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/.test(email);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Always include guests/children, set to 0 if not attending
    const payload = {
      name,
      email,
      attending,
      numOfGuests: attending ? numOfGuests : 0,
      numOfChildren: attending ? numOfChildren : 0,
    };

    const isUpdate = mode === "update" && initialValues?.updateToken;
    const url = isUpdate
      ? `/api/rsvp/token/${initialValues.updateToken}`
      : "/api/rsvp";
    const method = isUpdate ? "PUT" : "POST";

    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    if (!email.trim() || !validateEmail(email)) {
      setError("A valid email is required");
      return;
    }
    if (attending) {
      if (numOfGuests < 1) {
        setError("Number of guests must be at least 1");
        return;
      }
      if (numOfChildren < 0) {
        setError("Number of children cannot be negative");
        return;
      }
      if (numOfChildren > numOfGuests) {
        setError("Children cannot exceed guests");
        return;
      }
    }

    setLoading(true);
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Submission failed. Please try again.");
      } else {
        const data = await res.json();
        setUpdateLink(data.updateLink);
        setSuccess(true);
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="form-success">
        <p className="form-success-message">
          {attending ? (
            "We look forward to seeing you!"
          ) : (
            <>
              When the Land of Sweets is all aglow,
              <br />
              And birthday candles start to show,
              <br />
              For friends afar who cannot be near,
              <br />
              A Google Meet will bring you here!
              <br />
              We'll share the link before the day,
              <br />
              So you can join the song and say Hooray!
            </>
          )}
        </p>
        {updateLink && (
          <div className="update-link-box">
            <p style={{ marginBottom: "0.5rem" }}>
              Save this link to update your RSVP:
            </p>
            <a href={updateLink} target="_blank" rel="noopener noreferrer">
              {updateLink}
            </a>
          </div>
        )}
        <button className="rsvp-button" type="button" onClick={onClose}>
          Close
        </button>
      </div>
    );
  }

  return (
    <form className="rsvp-form" onSubmit={handleSubmit} noValidate>
      {mode === "update" && (
        <div className="attending-toggle">
          <button
            type="button"
            className={attending ? "selected" : ""}
            onClick={() => {
              setAttending(true);
              setNumOfGuests((prev) => (prev === 0 ? 1 : prev));
              setNumOfChildren((prev) => (prev < 0 ? 0 : prev));
            }}
          >
            Will Attend
          </button>
          <button
            type="button"
            className={!attending ? "selected" : ""}
            onClick={() => setAttending(false)}
          >
            Will not attend
          </button>
        </div>
      )}
      <label>
        Name*
        <input
          className="form-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>
      <label>
        Email*
        <input
          className="form-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      {attending && (
        <>
          <label>
            Total Number of Guests*
            <input
              className="form-input"
              type="number"
              min={1}
              value={numOfGuests}
              onChange={(e) => setNumOfGuests(Number(e.target.value))}
              required
            />
          </label>
          <label>
            Number of Children
            <input
              className="form-input"
              type="number"
              min={0}
              value={numOfChildren}
              onChange={(e) => setNumOfChildren(Number(e.target.value))}
              required
            />
          </label>
        </>
      )}
      {error && <div className="form-error">{error}</div>}
      <div className="form-actions">
        <button className="rsvp-button" type="submit" disabled={loading}>
          {loading
            ? mode === "update"
              ? "Updating..."
              : "Submitting..."
            : mode === "update"
            ? "Update RSVP"
            : "Submit RSVP"}
        </button>
        <button
          className="rsvp-button"
          type="button"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
