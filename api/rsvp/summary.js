import { connectDB } from "../../lib/mongodb.js";
import Rsvp from "../../models/Rsvp.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Handle GET request to retrieve RSVP summary
  try {
    await connectDB();

    const totalRsvps = await Rsvp.countDocuments();
    const attendingRsvps = await Rsvp.find({ attending: true });
    const notAttendingCount = await Rsvp.countDocuments({ attending: false });

    const totalGuests = attendingRsvps.reduce(
      (sum, rsvp) => sum + (rsvp.numOfGuests || 0),
      0
    );
    const totalChildren = attendingRsvps.reduce(
      (sum, rsvp) => sum + (rsvp.numOfChildren || 0),
      0
    );
    const totalAttending = attendingRsvps.length;

    res.json({
      message: "RSVP summary retrieved successfully",
      summary: {
        totalResponses: totalRsvps,
        attending: totalAttending,
        notAttending: notAttendingCount,
        totalGuests,
        totalChildren,
        totalPeople: totalGuests + totalChildren,
      },
    });
  } catch (err) {
    console.error("Error in summary:", err);
    res.status(500).json({
      message: "Unable to retrieve RSVP summary. Please try again later.",
      error: err.message,
    });
  }
}
