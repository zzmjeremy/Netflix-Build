// import mongoose from "mongoose";
// import User from "./database/User.js";
// mongoose.connect("mongodb://127.0.0.1:27017/Netflix-Project");
// const user = await User.create({

// });
// await user.save();
import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./database/User.js";
import Session from "./database/Session.js";

const app = express();
const PORT = process.env.PORT || 8000;

// automatically parse JSON body
app.use(express.json());

// connect to MongoDB
await mongoose.connect("mongodb://127.0.0.1:27017/Netflix-Project");

// Registration interface
app.post("/api/auth/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user already exists
    const exists = await User.findOne({ email });
    if (exists) {
      return res
        .status(400)
        .json({ msg: "This email has already been registered" });
    }

    // Password salting and hashing
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Storage
    const newUser = await User.create({ email, password: hash });

    // Delete the previous session of this IP
    await Session.deleteMany({ ip: req.ip });

    // Create a session record
    await Session.create({
      email: newUser.email,
      ip: req.ip,
    });

    // Return a simplified message (do not return the password hash)
    res.status(201).json({ id: newUser._id, email: newUser.email });
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ msg: "This email has already been registered" });
    }
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
});

// Login interface
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "The User doesn't exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Incorrect Password" });
    }
    // Delete the previous session of this IP
    await Session.deleteMany({ ip: req.ip });

    // Create a session record
    await Session.create({
      email: user.email,
      ip: req.ip,
    });

    // Login successful, return simplified user information
    res.status(200).json({ id: user._id, email: user.email });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ msg: "This email has already logined in" });
    }
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
});

// session 检查接口
app.get("/api/auth/session", async (req, res) => {
  try {
    const session = await Session.findOne({ ip: req.ip });
    if (!session) {
      // 未登录，正常返回
      return res.json({ loggedIn: false });
    }
    const user = await User.findOne({ email: session.email });
    if (!user) {
      return res.json({ loggedIn: false });
    }
    // 登录了，返回用户信息
    return res.json({
      loggedIn: true,
      id: user._id,
      email: user.email,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server Error" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
