import { connectDB } from "../../lib/mongodb.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Handle GET request to retrieve event information
  try {
    await connectDB();

    const now = new Date();
    const rsvpDeadline = new Date(process.env.RSVP_DEADLINE);
    const eventDate = new Date(process.env.EVENT_DATE);
    const isDeadlinePassed = now > rsvpDeadline;

    res.json({
      message: "Event information retrieved successfully",
      eventInfo: {
        eventName: process.env.EVENT_NAME,
        eventDate,
        eventLocation: process.env.EVENT_LOCATION,
        rsvpDeadline,
        isDeadlinePassed,
        canStillRSVP: !isDeadlinePassed,
        daysUntilDeadline: isDeadlinePassed
          ? 0
          : Math.ceil((rsvpDeadline - now) / (1000 * 60 * 60 * 24)),
        daysUntilEvent: Math.ceil((eventDate - now) / (1000 * 60 * 60 * 24)),
      },
    });
  } catch (err) {
    console.error("Error in event-info:", err);
    res.status(500).json({
      message: "Unable to retrieve event information.",
      error: err.message,
    });
  }
}
