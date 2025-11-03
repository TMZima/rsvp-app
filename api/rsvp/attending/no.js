import Rsvp from "../../../models/Rsvp.js";
import { connectDB } from "../../../lib/mongodb.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Handle GET request to retrieve RSVPs with attending: false
  try {
    await connectDB();

    const rsvps = await Rsvp.find({ attending: false });
    res.json({
      message: "Not attending RSVPs retrieved successfully",
      count: rsvps.length,
      rsvps,
    });
  } catch (err) {
    res.status(500).json({
      message:
        "Unable to retrieve non-attending RSVPs. Please try again later.",
    });
  }
}
