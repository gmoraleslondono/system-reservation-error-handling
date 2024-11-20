import express from "express";
import { createReservation, getReservation } from "./database.js";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to our API");
});

app.post("/reserve", (req, res) => {
  createReservation(req.body, (error, reservation) => {
    if (error) {
      return res.status(500).json({ message: error });
    }
    res
      .status(201)
      .json({ message: "Reservation successful", data: reservation });
  });
});

app.get("/reservation/:id", async (req, res) => {
  try {
    const result = await getReservation(req.params.id);
    console.error("result", result);
    res.status(200).json({ message: "Reservation found", data: result });
  } catch (error) {
    console.error("Error fetching reservation:", error);
    res.status(500).json({ message: error });
  }
});

app.get("/broken-route", (req, res) => {
  throw new Error("Broken route");
});

app.use((error, req, res, next) => {
  console.error(error.message || error);
  if (error.message && error.message.includes("Database")) {
    res
      .status(500)
      .json({ message: "there was an monkey (error) with the database!" });
  } else {
    res.status(500).json({
      message: "Something went bananas (wrong) on the server!",
    });
  }
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
