import { useState, useEffect } from "react";

interface RsvpApiResponse {
  message: string;
  rsvp?: {
    name: string;
    email: string;
    attending: boolean;
    numOfGuests?: number;
    numOfChildren?: number;
    updateToken: string;
  };
}

export function useRsvpByToken(token: string | undefined) {
  const [rsvp, setRsvp] = useState<RsvpApiResponse["rsvp"] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    setIsLoading(true);

    const fetchRsvp = async (retryCount = 0) => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(`/api/rsvp/token/${token}`, {
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data: RsvpApiResponse = await response.json();
        if (data.rsvp) {
          setRsvp(data.rsvp);
          setApiError(null);
        } else {
          setApiError(data.message || "RSVP not found.");
        }
      } catch (err) {
        const error = err as Error;
        if (
          retryCount < 2 &&
          (error.name === "AbortError" ||
            error.message?.includes("Failed to fetch"))
        ) {
          setTimeout(() => fetchRsvp(retryCount + 1), 300);
          return;
        }
        setApiError("Could not load RSVP. Please refresh to try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchRsvp();
  }, [token]);

  return { rsvp, isLoading, apiError };
}
