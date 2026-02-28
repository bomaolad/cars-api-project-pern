import express from "express";

const app = express();
const PORT = 3000;
const router = express.Router();

app.use(express.json());

app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}\n`);
  next();
});

let cars = [
  { id: 1, make: "Toyota", model: "Camry", year: 2020, price: 25000 },
  { id: 2, make: "Honda", model: "Civic", year: 2019, price: 22000 },
  { id: 3, make: "Ford", model: "Mustang", year: 2021, price: 35000 },
];

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Car API" });
});

router.get("/", (req, res) => {
  res.json(cars);
});

router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const car = cars.find((car) => car.id === id);
  if (!car) return res.status(404).json({ message: "Car not found" });
  res.json(car);
});

router.post("", (req, res) => {
  const { make, model, year, price } = req.body;

  if (!make || !model || !year || !price) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const newCar = {
    id: cars.length + 1,
    make,
    model,
    year: Number(year),
    price: Number(price),
  };
  cars.push(newCar);
  res.status(201).json({ message: "Created a new car" });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { make, model, year, price } = req.body;
  const carIndex = cars.findIndex((car) => car.id === Number(id));
  if (carIndex === -1)
    return res.status(404).json({ message: "Car not found" });

  if (!make || !model || !year || !price) {
    return res.status(400).json({ message: "All fields are required" });
  }

  cars[carIndex] = {
    id: Number(id),
    make,
    model,
    year: Number(year),
    price: Number(price),
  };
  res.json({ message: `Updated car with ID: ${id}` });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const carIndex = cars.findIndex((car) => car.id === Number(id));
  if (carIndex === -1)
    return res.status(404).json({ message: "Car not found" });
  cars.splice(carIndex, 1);
  res.json({ message: `Deleted car with ID: ${id}` });
});

app.use("/api/v1/cars", router);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
