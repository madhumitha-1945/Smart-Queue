const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); 

const app = express();
const PORT = process.env.PORT || 5010;

app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI;

 

if (!MONGO_URI) {
  console.error("MongoDB URI is missing! Check your .env file.");
  process.exit(1);
}

 

// mongoose.connect('mongodb://115.97.41.128:27017/queuemanagement', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => console.log("MongoDB connected"))
//  .catch((err) => console.error("MongoDB connection error", err));

 
console.log("Attempting to connect to MongoDB...");

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error);
  });

mongoose.connection.on("error", (err) => {
  console.error("❌ Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ Mongoose disconnected");
});


 // User Schema & Model
const UserSchema = new mongoose.Schema({
     email: String,
     pin: Number
  });
  
  const User = mongoose.model("userdetails", UserSchema);
  // Routes
//Creating or reigstring a User
app.post("/api/signup", async (req, res) => {
    try {
      const { email, pin } = req.body;
      const newUser = new User({ email, pin });
      await newUser.save();
      res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error saving user", error });
    }
  });
  
  // API Route for User Login
  app.post("/api/signin", async (req, res) => {
    try {
      const { email, pin } = req.body;
  
      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "User not found", status: 400 });
      }
  
      // Check password
      if (user.pin !== pin) {
        return res.status(400).json({ message: "Invalid pin", status: 400 });
      }
  
      res.json({ message: "Login successful", user });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  
  