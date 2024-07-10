import { useState } from "react";
import { itemsList } from "../itemsList.ts";
import axios from "axios";

const App: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<String[]>([]);
  const [packages, setPackages] = useState<any[]>([]);

  const handleItemSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const itemName = e.target.value;
    if (e.target.checked) {
      setSelectedItems([...selectedItems, itemName]);
    } else {
      setSelectedItems(selectedItems.filter((item) => item !== itemName));
    }
  };

  console.log("selecteditems", selectedItems);

  const handlePlaceOrder = async () => {
    try {
      const response = await axios.post("http://localhost:5555/place-order", {
        selectedItems,
      });
      setPackages((prevPackages) => [...prevPackages, ...response.data]);
      console.log(response.data);
      setSelectedItems([]); // Clear the selection
      console.log("posted");
    } catch (error: any) {
      console.log(error.message);
    }
    console.log("packages", packages);
  };

  return (
    <div>
      <h1>Place Your Order</h1>
      <ul>
        {itemsList.map((item) => (
          <li key={item.name}>
            <label>
              <input
                type="checkbox"
                value={item.name}
                onChange={handleItemSelection}
                checked={selectedItems.includes(item.name)}
              />
              {item.name} - ${item.price} - {item.weight}g
            </label>
          </li>
        ))}
      </ul>
      <button onClick={handlePlaceOrder}>Place Order</button>
      <h2>Packages</h2>
      {packages.length === 0 ? (
        <p> No any packages</p>
      ) : (
        packages.map((pkg, index) =>
          pkg.totalPrice > 250 ? (
            <div>Total price in a package cannot exceed $250</div>
          ) : (
            <div key={index}>
              <h3>Package {index + 1}</h3>
              <p>Items: {pkg.items.join(", ")}</p>
              <p>Total weight: {pkg.totalWeight}g</p>
              <p>Total price: ${pkg.totalPrice}</p>
              <p>Courier price: ${pkg.courierPrice}</p>
            </div>
          )
        )
      )}
    </div>
  );
};

export default App;
