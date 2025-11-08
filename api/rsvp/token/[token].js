import Rsvp from "../../../models/Rsvp.js";
import { connectDB } from "../../../lib/mongodb.js";

export default async function handler(req, res) {
  if (req.method === "GET") {
    // Handle GET request to retrieve RSVP by token
    try {
      await connectDB();

      const rsvp = await Rsvp.findOne({ updateToken: req.query.token });
      if (!rsvp) {
        return res
          .status(404)
          .json({ message: "RSVP not found or invalid update link." });
      }
      res.json({
        message: "RSVP retrieved successfully",
        rsvp,
      });
    } catch (err) {
      res.status(500).json({
        message: "Unable to retrieve RSVP. Please try again later.",
      });
    }
  } else if (req.method === "PUT") {
    // Handle PUT request to update RSVP by token
    try {
      await connectDB();

      const existingRsvp = await Rsvp.findOne({ updateToken: req.query.token });
      if (!existingRsvp) {
        return res.status(404).json({
          message: "RSVP not found or invalid update link.",
        });
      }

      // Check RSVP deadline (event-wide deadline)
      const now = new Date();
      const rsvpDeadline = new Date(process.env.RSVP_DEADLINE);
      if (now > rsvpDeadline) {
        return res.status(403).json({
          message: `RSVP deadline has passed for ${process.env.EVENT_NAME}. Updates are no longer allowed.`,
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

      // Handle No → Yes transition: provide defaults for required fields
      if (req.body.attending === true) {
        req.body.numOfGuests = req.body.numOfGuests || 1;
        req.body.numOfChildren = req.body.numOfChildren || 0;
      }

      const rsvp = await Rsvp.findOneAndUpdate(
        { updateToken: req.query.token },
        req.body,
        { new: true, runValidators: true }
      );
      if (!rsvp) {
        return res.status(404).json({
          message: "RSVP not found or invalid update link.",
        });
      }
      res.json({
        message: "RSVP updated successfully!",
        rsvp,
      });
    } catch (err) {
      if (err.name === "ValidationError") {
        const errors = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({
          message: "We found some issues with your updated information:",
          errors: errors,
          help: "Please fix the issues above and try updating again.",
        });
      }
      res
        .status(400)
        .json({ message: "Unable to update RSVP. Please try again." });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
