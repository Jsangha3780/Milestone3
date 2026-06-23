import { Router, Request, Response } from "express";
import pool from "../db";

const router = Router();

// GET all registrations
router.get("/", async (_req: Request, res: Response) => {
  const [rows] = await pool.query("SELECT * FROM registrations");
  res.json(rows);
});

// POST new registration
router.post("/", async (req: Request, res: Response) => {
  const { user_id, event_id } = req.body;

  // Validation
  if (!user_id || !event_id) {
    res.status(400).json({
      error: "user_id and event_id are required"
    });
    return;
  }

  // Insert into database
  const [result]: any = await pool.query(
    "INSERT INTO registrations (user_id, event_id) VALUES (?, ?)",
    [user_id, event_id]
  );

  // Send response
  res.status(201).json({
    id: result.insertId,
    user_id,
    event_id
  });
});

export default router;