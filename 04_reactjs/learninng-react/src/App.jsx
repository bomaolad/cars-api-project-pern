import React from "react";
import { useState } from "react";
import Cars from "./components/car";
import { useEffect } from "react";

const App = () => {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    fetch("/api/v1/cars")
      .then((response) => response.json())
      .then((data) => setCars(data))
      .catch((error) => console.error("Error fetching cars:", error));
  }, []);

  console.log(cars);

  return (
    <div>
      <h1>Welcome to the Car API</h1>
      {cars.map((car) => (
        <Cars key={car.id} {...car} />
      ))}
    </div>
  );
};

export default App;
