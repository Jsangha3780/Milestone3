import { Router, Request, Response } from "express";
import pool from "../db";

const router = Router();

// GET all colleges
router.get("/", async (_req: Request, res: Response) => {
  const [rows] = await pool.query("SELECT * FROM colleges");
  res.json(rows);
});

// POST a new college
router.post("/", async (req: Request, res: Response) => {
  const { college_name, location } = req.body;

  if (!college_name || !location) {
    res.status(400).json({
      error: "college_name and location are required"
    });
    return;
  }

  const [result]: any = await pool.query(
    "INSERT INTO colleges (college_name, location) VALUES (?, ?)",
    [college_name, location]
  );

  res.status(201).json({
    id: result.insertId,
    college_name,
    location
  });
});

export default router;
