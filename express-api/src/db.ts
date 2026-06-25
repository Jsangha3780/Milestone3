import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "aaron123",
  database: "college_events"
});

export default pool;
