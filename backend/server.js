const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

const app = express();

app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "citypulse",
    password: "Imgr8@28",
    port: 5432
});

app.get("/", (req, res) => {
    res.send("CityPulse Backend Running");
});

app.get("/complaints", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM complaint");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
    }
});

app.post("/complaints", async (req, res) => {
    const { title, description, department_id, area_id, citizen_id } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO complaint
       (title, description, department_id, area_id, citizen_id)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING *`,
            [title, description, department_id, area_id, citizen_id]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
    }
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});