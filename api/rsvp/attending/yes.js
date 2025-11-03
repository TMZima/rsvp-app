import Rsvp from "../../../models/Rsvp.js";
import { connectDB } from "../../../lib/mongodb.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Handle GET request to retrieve RSVPs with attending: true
  try {
    await connectDB();

    const rsvps = await Rsvp.find({ attending: true });
    const totalGuests = rsvps.reduce(
      (sum, rsvp) => sum + (rsvp.numOfGuests || 0),
      0
    );
    const totalChildren = rsvps.reduce(
      (sum, rsvp) => sum + (rsvp.numOfChildren || 0),
      0
    );

    res.json({
      message: "Attending RSVPs retrieved successfully",
      count: rsvps.length,
      totalGuests,
      totalChildren,
      rsvps,
    });
  } catch (err) {
    res.status(500).json({
      message: "Unable to retrieve attending RSVPs. Please try again later.",
    });
  }
}
