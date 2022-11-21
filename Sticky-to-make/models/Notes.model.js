const { Schema, model } = require("mongoose");

const notesSchema = new Schema(
  {
    title: String,
    description: String,
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  });

const Notes = model("Notes", notesSchema);

module.exports = Notes;
