import express from "express";
import { db } from "./db.js";
import { cars } from "./schema.js";

const app = express();
const PORT = 3000;

const router = express.Router();

app.use(express.json());

app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.send("Hello from Car API!");
});

router.get("/cars", async (req, res) => {
  await db
    .select()
    .from(cars)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.error("Select error:", err);
      res.status(500).json({ error: "Failed to fetch cars" });
    });
});

router.post("/cars", async (req, res, next) => {
  const { make, model, year, price } = req.body;

  if (!make || !model || !year || !price) {
    return res.status(400).json({
      error: "Please provide make, model, year, and price",
    });
  }

  try {
    const [newCar] = await db
      .insert(cars)
      .values({
        make,
        model,
        year,
        price,
      })
      .returning();

    res.status(201).json(newCar);
  } catch (err) {
    console.error("Insert error:", err);
    next(err);
  }
});

router.put("/cars/:id", async (req, res, next) => {
  const carId = parseInt(req.params.id);
  const { make, model, year, price } = req.body;

  try {
    const update = {};
    if (make) update.make = make;
    if (model) update.model = model;
    if (year) update.year = parseInt(year);
    if (price) update.price = parseFloat(price);

    const [updatedCar] = await db
      .update(cars)
      .set(update)
      .where(cars.id.eq(carId))
      .returning();

    if (!updatedCar) {
      return res.status(404).json({ error: "Car not found" });
    }

    res.json(updatedCar);
  } catch (err) {
    console.error("Update error:", err);
    next(err);
  }
});

router.delete("/cars/:id", async (req, res, next) => {
  const carId = parseInt(req.params.id);

  try {
    const [deletedCar] = await db
      .delete(cars)
      .where(cars.id.eq(carId))
      .returning();

    if (!deletedCar) {
      return res.status(404).json({ error: "Car not found" });
    }

    res.json({
      message: "Car deleted successfully",
      car: deletedCar,
    });
  } catch (err) {
    console.error("Delete error:", err);
    next(err);
  }
});

router.get("/cars/:id", async (req, res, next) => {
  const carId = parseInt(req.params.id);

  try {
    const [car] = await db.select().from(cars).where(cars.id.eq(carId));

    if (!car) {
      return res.status(404).json({ error: "Car not found" });
    }

    res.json(car);
  } catch (err) {
    console.error("Select one error:", err);
    next(err);
  }
});

app.use("/api/v1", router);

app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({
    error: "Something went wrong!",
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
