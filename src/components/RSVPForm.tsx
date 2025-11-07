import { useState } from "react";

import "./RSVPForm.css";

interface RSVPFormProps {
  onClose: () => void;
}

export default function RSVPForm({ onClose }: RSVPFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [numOfGuests, setNumOfGuests] = useState(1);
  const [numOfChildren, setNumOfChildren] = useState(0);
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

    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    if (!email.trim() || !validateEmail(email)) {
      setError("A valid email is required");
      return;
    }
    if (numOfGuests < 1) {
      setError("Number of guests must be at least 1");
      return;
    }
    if (numOfChildren < 0) {
      setError("Number of children cannot be negative");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          numOfGuests,
          numOfChildren,
          attending: true,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Submission failed. Please try again.");
      } else {
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
        <p>Thank you for your RSVP! We look forward to seeing you 🎉</p>
        <button className="rsvp-button" type="button" onClick={onClose}>
          Close
        </button>
      </div>
    );
  }

  return (
    <form className="rsvp-form" onSubmit={handleSubmit}>
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
      <label>
        Number of Guests*
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
      {error && <div className="form-error">{error}</div>}
      <div className="form-actions">
        <button className="rsvp-button" type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit RSVP"}
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
