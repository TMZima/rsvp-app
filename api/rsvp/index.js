import Rsvp from "../../models/Rsvp.js";
import { connectDB } from "../../lib/mongodb.js";

export default async function handler(req, res) {
  // Handle POST request to create a new RSVP
  if (req.method === "POST") {
    try {
      await connectDB();

      // Check if RSVP deadline has passed
      const now = new Date();
      const rsvpDeadline = new Date(process.env.RSVP_DEADLINE);
      if (now > rsvpDeadline) {
        return res.status(403).json({
          message: `RSVP deadline has passed for ${process.env.EVENT_NAME}. New RSVPs are no longer accepted.`,
          eventName: process.env.EVENT_NAME,
          deadline: rsvpDeadline,
          eventDate: process.env.EVENT_DATE,
        });
      }
      // Validate number of children does not exceed number of guests
      if (
        req.body.attending === true &&
        typeof req.body.numOfGuests === "number" &&
        typeof req.body.numOfChildren === "number" &&
        req.body.numOfChildren > req.body.numOfGuests
      ) {
        return res.status(400).json({
          message: "Number of children cannot exceed total number of guests.",
        });
      }
      const rsvp = await Rsvp.create(req.body);
      // For Vercel/Next.js serverless: get protocol and host from headers
      const protocol = req.headers["x-forwarded-proto"] || "http";
      const host = req.headers.host;
      res.status(201).json({
        message: "RSVP submitted successfully! Save your update link.",
        rsvp,
        updateLink: `${protocol}://${host}/update/${rsvp.updateToken}`,
      });
    } catch (err) {
      // Handle duplicate email (unique constraint violation)
      if (err.code === 11000 && err.keyPattern?.email) {
        const existingRsvp = await Rsvp.findOne({ email: req.body.email });
        const protocol = req.headers["x-forwarded-proto"] || "http";
        const host = req.headers.host;
        return res.status(409).json({
          message:
            "You have already submitted an RSVP. Use your update link to make changes.",
          existingRsvp: {
            name: existingRsvp.name,
            email: existingRsvp.email,
            attending: existingRsvp.attending,
          },
          updateLink: `${protocol}://${host}/update/${existingRsvp.updateToken}`,
        });
      }

      if (err.name === "ValidationError") {
        const errors = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({
          message: "We found some issues with your RSVP information:",
          errors: errors,
          help: "Please fix the issues above and submit your RSVP again.",
        });
      }
      res
        .status(400)
        .json({ message: "Unable to submit RSVP. Please try again." });
    }
  } else if (req.method === "GET") {
    // Handle GET request to retrieve all RSVPs
    try {
      await connectDB();
      const rsvps = await Rsvp.find();
      res.json({
        message: "RSVPs retrieved successfully",
        count: rsvps.length,
        rsvps,
      });
    } catch (err) {
      res.status(500).json({
        message: "Unable to retrieve RSVPs. Please try again later.",
      });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
