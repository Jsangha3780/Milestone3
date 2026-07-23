import { Router, Request, Response } from "express";
import pool from "../db";

const router = Router();

// GET all users
router.get("/", async (_req: Request, res: Response) => {
  const [rows] = await pool.query("SELECT * FROM users");
  res.json(rows);
});

// GET one user
router.get("/:id", async (req: Request, res: Response) => {
  const [rows]: any = await pool.query("SELECT * FROM users WHERE user_id = ?", [req.params.id]);
  if (!rows || rows.length === 0) {
    return res.status(404).json({ message: `User ${req.params.id} not found` });
  }
  res.json(rows[0]);
});

// POST new user
router.post("/", async (req: Request, res: Response) => {
  const { name, email, last_name, college_id } = req.body;

  if (!email) {
    res.status(400).json({
      error: "email is required"
    });
    return;
  }

  const [result]: any = await pool.query(
    "INSERT INTO users (email, college_id, last_name) VALUES (?, ?, ?)",
    [email, college_id ?? null, last_name ?? name ?? null]
  );

  res.status(201).json({
    id: result.insertId,
    name: last_name ?? name ?? null,
    email,
    college_id: college_id ?? null
  });
});

// UPDATE user
router.put("/:id", async (req: Request, res: Response) => {
  const { name, email, last_name, college_id } = req.body;
  const userId = req.params.id;

  const [existingRows]: any = await pool.query("SELECT * FROM users WHERE user_id = ?", [userId]);
  if (!existingRows || existingRows.length === 0) {
    return res.status(404).json({ message: `User ${userId} not found` });
  }

  const existing = existingRows[0];
  const updatedEmail = email ?? existing.email;
  const updatedCollegeId = college_id ?? existing.college_id ?? null;
  const updatedLastName = last_name ?? name ?? existing.last_name ?? null;

  await pool.query(
    "UPDATE users SET email = ?, college_id = ?, last_name = ? WHERE user_id = ?",
    [updatedEmail, updatedCollegeId, updatedLastName, userId]
  );

  res.json({ message: `User ${userId} updated` });
});

// PATCH user
router.patch("/:id", async (req: Request, res: Response) => {
  const { name, email, last_name, college_id } = req.body;
  const userId = req.params.id;

  const [existingRows]: any = await pool.query("SELECT * FROM users WHERE user_id = ?", [userId]);
  if (!existingRows || existingRows.length === 0) {
    return res.status(404).json({ message: `User ${userId} not found` });
  }

  const existing = existingRows[0];
  const updatedEmail = email ?? existing.email;
  const updatedCollegeId = college_id ?? existing.college_id ?? null;
  const updatedLastName = last_name ?? name ?? existing.last_name ?? null;

  await pool.query(
    "UPDATE users SET email = ?, college_id = ?, last_name = ? WHERE user_id = ?",
    [updatedEmail, updatedCollegeId, updatedLastName, userId]
  );

  res.json({ message: `User ${userId} updated` });
});

// DELETE user
router.delete("/:id", async (req: Request, res: Response) => {
  const [result]: any = await pool.query("DELETE FROM users WHERE user_id = ?", [req.params.id]);
  if (result.affectedRows === 0) {
    return res.status(404).json({ message: `User ${req.params.id} not found` });
  }
  res.json({ message: `User ${req.params.id} deleted` });
});

export default router;
