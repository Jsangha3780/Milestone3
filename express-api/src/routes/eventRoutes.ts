import { Router, Request, Response } from "express";
import pool from "../db";

const router = Router();

// GET all events
router.get("/", async (_req: Request, res: Response) => {
  const [rows] = await pool.query("SELECT * FROM events");
  res.json(rows);
});

// POST new event
router.post("/", async (req: Request, res: Response) => {
  const { title, event_date, location } = req.body;

  // Validation
  if (!title || !event_date || !location) {
    res.status(400).json({
      error: "title, event_date and location are required"
    });
    return;
  }

  // Insert into database
  const [result]: any = await pool.query(
    "INSERT INTO events (title, event_date, location) VALUES (?, ?, ?)",
    [title, event_date, location]
  );

  // Send response
  res.status(201).json({
    id: result.insertId,
    title,
    event_date,
    location
  });
});

export default router;