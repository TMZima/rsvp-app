import mongoose from "mongoose";
import crypto from "crypto";

const rsvpSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your full name"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email address"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
        "Please enter a valid email address (example: name@email.com)",
      ],
    },
    attending: {
      type: Boolean,
      required: [true, "Please let us know if you'll be attending (yes or no)"],
    },
    numOfGuests: {
      type: Number,
      required: [
        function () {
          return this.attending === true;
        },
        "Please specify the number of guests when attending",
      ],
      min: [0, "Number of guests cannot be negative"],
      validate: {
        validator: function (value) {
          // For updates, use this.getUpdate() and fallback to this.attending
          let attending;
          if (typeof this.getUpdate === "function") {
            const update = this.getUpdate();
            attending = update.attending;
            // If $set is used
            if (update.$set && typeof update.$set.attending !== "undefined") {
              attending = update.$set.attending;
            }
          } else {
            attending = this.attending;
          }
          if (attending) {
            return value >= 1;
          }
          return value === 0;
        },
        message: "Invalid number of guests for attending status.",
      },
    },
    numOfChildren: {
      type: Number,
      required: [
        function () {
          return this.attending === true;
        },
        "Please specify the number of children when attending (enter 0 if none)",
      ],
      min: [0, "Number of children cannot be negative"],
      validate: {
        validator: function (value) {
          let attending, numOfGuests;
          if (typeof this.getUpdate === "function") {
            const update = this.getUpdate();
            attending = update.attending;
            numOfGuests = update.numOfGuests;
            if (update.$set) {
              if (typeof update.$set.attending !== "undefined")
                attending = update.$set.attending;
              if (typeof update.$set.numOfGuests !== "undefined")
                numOfGuests = update.$set.numOfGuests;
            }
          } else {
            attending = this.attending;
            numOfGuests = this.numOfGuests;
          }
          if (attending) {
            return value <= numOfGuests;
          }
          return value === 0;
        },
        message: "Invalid number of children for attending status.",
      },
    },
    // Token for secure updates
    updateToken: {
      type: String,
      required: true,
      default: function () {
        return crypto.randomUUID();
      },
    },
  },
  {
    timestamps: true,
  }
);

const Rsvp = mongoose.model("RSVP", rsvpSchema);

export default Rsvp;
