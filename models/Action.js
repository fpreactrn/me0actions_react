const mongoose = require('mongoose');

const actionsSchema = new mongoose.Schema({
    userId: mongoose.Schema.ObjectId,
    actions: [
      {
        text: String,
        checked: Boolean,
        id: String,
        deleted: Boolean
      }
    ]
  });

module.exports = mongoose.model('Actions', actionsSchema)
