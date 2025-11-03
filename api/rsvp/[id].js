import Rsvp from "../../models/Rsvp.js";
import { connectDB } from "../../lib/mongodb.js";

export default async function handler(req, res) {
  // Handle GET request to retrieve RSVP by ID
  if (req.method === "GET") {
    try {
      await connectDB();

      const rsvp = await Rsvp.findById(req.query.id);
      if (!rsvp) {
        return res.status(404).json({ message: "RSVP not found" });
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
    // Handle PUT request to update RSVP by ID (admin use - bypasses deadline)
    try {
      await connectDB();

      const rsvp = await Rsvp.findByIdAndUpdate(req.query.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!rsvp) {
        return res
          .status(404)
          .json({ message: "RSVP not found. It may have been deleted." });
      }
      res.json({
        message: "RSVP updated successfully!",
        rsvp,
      });
    } catch (err) {
      if (err.name === "ValidationError") {
        const errors = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({
          message: "Validation failed for this RSVP update:",
          errors: errors,
          note: "Admin can override validation if needed.",
        });
      }
      res
        .status(400)
        .json({ message: "Unable to update RSVP. Please try again." });
    }
  } else if (req.method === "DELETE") {
    // Handle DELETE request to delete RSVP by ID
    try {
      await connectDB();

      const rsvp = await Rsvp.findByIdAndDelete(req.query.id);
      if (!rsvp) {
        return res.status(404).json({
          message: "RSVP not found. It may have already been deleted.",
        });
      }
      res.json({ message: "RSVP deleted successfully!" });
    } catch (err) {
      res.status(500).json({
        message: "Unable to delete RSVP. Please try again later.",
      });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
