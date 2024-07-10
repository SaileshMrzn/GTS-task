import express from "express";
import dotenv from "dotenv";
import { itemsList, courierCharges } from "./itemsList.js";
import bodyparser from "body-parser";
import cors from "cors";

dotenv.config();
const app = express();
app.use(express.json());
app.use(bodyparser.json());
app.use(cors());

const port = process.env.PORT;

function calculateCourierCharge(weight) {
  for (let i = 0; i < courierCharges.length; i++) {
    if (weight <= courierCharges[i].maxWeight) {
      return courierCharges[i].charge;
    }
  }
  return 0;
}

const createPackage = (selectedItems) => {
  const finalPackage = [];
  let currentPackage = {
    items: [],
    totalWeight: 0,
    totalPrice: 0,
  };

  for (let item of selectedItems) {
    const itemDetails = itemsList.find((i) => i.name === item);

    //check if the price limit exceeds
    if (currentPackage.totalPrice + itemDetails.price > 250) {
      console.log("error");

      console.log(finalPackage);
    }

    currentPackage.items.push(itemDetails.name);
    currentPackage.totalWeight += itemDetails.weight;
    currentPackage.totalPrice += itemDetails.price;
  }

  finalPackage.push({
    ...currentPackage,
    courierPrice: calculateCourierCharge(currentPackage.totalWeight),
  });

  // for (let pkg of finalPackage) {
  //   calculateCourierCharge(pkg.totalWeight);
  // }

  return finalPackage;
};

app.post("/place-order", (req, res) => {
  const { selectedItems } = req.body;
  const order = createPackage(selectedItems);
  res.json(order);
});

app.listen(port, () => {
  console.log(`App is listening to port ${port}`);
});
