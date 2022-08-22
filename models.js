const mongoose = require('mongoose');

mongoose.model("Users", new mongoose.Schema({
  email: String,
  name: String,
  password: String,
  is_admin: Boolean,
  created_at: String
}))

mongoose.model("Tickets", new mongoose.Schema({
  date: String,
  venue: String,
  location: String,
  created_at: String
}))