import { useState, useEffect } from "react";

interface EventApiResponse {
  message: string;
  eventInfo: {
    canStillRSVP: boolean;
    daysUntilDeadline: number;
    daysUntilEvent: number;
    eventDate?: string;
    eventLocation: string;
    eventName: string;
    isDeadlinePassed: boolean;
    rsvpDeadline: string;
  };
}
export function useEventInfo() {
  const [eventInfo, setEventInfo] = useState<EventApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEventInfo = async (retryCount = 0) => {
      try {
        // timeout for potential cold starts
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const response = await fetch("/api/rsvp/event-info", {
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setEventInfo(data);
        setApiError(null); // Clear any previous errors
      } catch (err) {
        console.error(
          `Error fetching event info (attempt ${retryCount + 1}):`,
          err
        );

        const error = err as Error;

        // Retry logic for cold starts or network issues
        if (
          retryCount < 2 &&
          (error.name === "AbortError" ||
            error.message?.includes("Failed to fetch"))
        ) {
          console.log(`Retrying... (attempt ${retryCount + 2})`);
          setTimeout(() => fetchEventInfo(retryCount + 1), 1000); // Wait 1 second before retry
          return;
        }

        setApiError(
          "Could not load event information. Please refresh to try again."
        );
      } finally {
        if (retryCount === 0 || apiError) {
          // Only set loading false on first attempt or final failure
          setIsLoading(false);
        }
      }
    };

    fetchEventInfo();
  }, []);

  return { eventInfo, isLoading, apiError };
}
