import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Pool } from "pg";
import { urls } from "./lib/data/urls";

dotenv.config();
const app = express();

const PORT = process.env.PORT;

const user = process.env.DB_USER;
const host = process.env.DB_HOST;
const database = process.env.DB_NAME;
const password = process.env.DB_PASSWORD;
const port = process.env.DB_PORT;

// console.log(user, host, database, password, port);

export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432"),
  ssl: {
    rejectUnauthorized: false,
  },
});

// Middleware
app.use(cors());
app.use(express.json());

async function createPictureUrlsTable() {
  try {
    // Create the pictureUrls table
    await pool.query(`
        CREATE TABLE pictureUrls (
          id SERIAL PRIMARY KEY,
          url VARCHAR(255)
        );
      `);
    console.log("pictureUrls table created successfully");
  } catch (error) {
    console.error("Error creating pictureUrls table:", error);
  }
}

async function insertIntoPictureUrlsTable(url: string) {
  try {
    // Create the pictureUrls table
    await pool.query(
      `
        INSERT INTO pictureUrls (url)
        VALUES ($1);
      `,
      [url]
    );
    console.log("Row added successfully");
  } catch (error) {
    console.error(`Error adding row ${url}:`, error);
  }
}

async function getDaily() {
  const day = new Date().getDate();
  const query = `
    SELECT *
    FROM pictureUrls
    WHERE id = $1
  ;`;
  try {
    const result = await pool.query(query, [day]);
    // console.log(result.rows[0]);
    return result.rows[0].url;
  } catch (err) {
    // console.log(err);
    return null;
  }
}

pool.connect(async (err, client, release) => {
  if (err) {
    return console.error("Error acquiring client", err.stack);
  }
  // console.log("Pool connected successfully");

  // await createPictureUrlsTable();

  // for (const url of urls) {
  //   await insertIntoPictureUrlsTable(url);
  // }

  release(); // Release the client back to the pool
});

app.get("/daily", async (req: Request, res: Response) => {
  const pictureUrl = await getDaily();
  // console.log(pictureUrl);
  if (pictureUrl) {
    return res.json({
      status: "ok",
      code: 200,
      url: pictureUrl,
    });
  } else {
    return res.json({
      status: "error",
      code: 404,
      message: "Picture not found",
    });
  }
});

app.listen(PORT, async () => {
  console.log(`Server is listening on port ${PORT}`);
  // console.log(pool);
});

export default app;
