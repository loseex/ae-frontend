import express from "express";
import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

import authMiddleware from "./middleware/auth.js";

const require = createRequire(import.meta.url);
const jsonServer = require("json-server");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

const SECRET_KEY = "your-super-secret-key-change-me";
const DB_PATH = path.join(__dirname, "database.json");

const router = jsonServer.router(DB_PATH);
const middlewares = jsonServer.defaults({ bodyParser: false });

app.use(middlewares);

app.use("/api/v1/auth", express.json());

app.post("/api/v1/auth/authenticate", (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({
      error: 'Поля "name" и "password" обязательны',
    });
  }

  const users = router.db.get("users").value();
  const user = users.find((u) => u.user === name && u.password === password);

  if (!user) {
    return res.status(401).json({
      error: "Неверное имя пользователя или пароль",
    });
  }

  const payload = {
    sub: user.user,
    name: user.name,
    role: user.role,
  };

  const access_token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });

  res.json({
    access_token,
    data: {
      user: user.user,
      name: user.name,
      role: user.role,
    },
  });
});

app.get("/api/v1/auth/me", authMiddleware, (req, res) => {
  res.json({
    user: req.user.sub,
    name: req.user.name,
    role: req.user.role,
  });
});

app.use("/api/v1", router);

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
