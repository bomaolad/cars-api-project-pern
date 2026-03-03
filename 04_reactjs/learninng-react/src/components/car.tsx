import React from "react";

interface CarsProps {
  make: string;
  model: string;
  year: number;
  price: number;
}

const Cars: React.FC<CarsProps> = ({ make, model, year, price }) => {
  return (
    <li>
      <p> Make: {make}</p>
      <p> Model: {model}</p>
      <p> Year: {year}</p>
      <p> Price: {price}</p>
    </li>
  );
};

export default Cars;
