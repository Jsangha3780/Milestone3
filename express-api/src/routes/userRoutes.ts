import { Router, Request, Response } from "express";
import pool from "../db";

const router = Router();

// GET all users
router.get("/", async (_req: Request, res: Response) => {
  const [rows] = await pool.query("SELECT * FROM users");
  res.json(rows);
});

// POST new user
router.post("/", async (req: Request, res: Response) => {
  const { name, email } = req.body;

  // Validation
  if (!name || !email) {
    res.status(400).json({
      error: "name and email are required"
    });
    return;
  }

  // Insert into database
  const [result]: any = await pool.query(
    "INSERT INTO users (name, email) VALUES (?, ?)",
    [name, email]
  );

  // Send response
  res.status(201).json({
    id: result.insertId,
    name,
    email
  });
});

export default router;