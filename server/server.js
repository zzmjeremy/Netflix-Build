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

const app = express();
const PORT = process.env.PORT || 8000;

// 中间件：自动 parse JSON body
app.use(express.json());

// 1) 连接 MongoDB
await mongoose.connect("mongodb://127.0.0.1:27017/Netflix-Project");

// 2) 注册接口
app.post("/api/auth/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    // a) 检查用户是否已存在
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ msg: "This email has already been registered" });
    }

    // b) 密码加盐并哈希
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // c) 存库
    const newUser = await User.create({ email, password: hash });

    // d) 返回简化信息（不要返回密码哈希）
    res.status(201).json({ id: newUser._id, email: newUser.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "服务器内部错误" });
  }
});

// 3) 登录接口（示例）
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "用户不存在" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "密码错误" });
    }

    // 登录成功，返回用户基本信息或 JWT
    res.json({ id: user._id, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "服务器内部错误" });
  }
});

// 4) 启动服务
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
