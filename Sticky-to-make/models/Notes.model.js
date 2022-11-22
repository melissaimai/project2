const { Schema, model } = require("mongoose");

const notesSchema = new Schema(
  {
    title: String,
    description: String,
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    taskDone: {
      type: Boolean,
      default: false
    },
    date: Date
  });

const Notes = model("Notes", notesSchema);

module.exports = Notes;
