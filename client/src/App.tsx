import { useState } from "react";
import { itemsList } from "../itemsList.ts";
import axios from "axios";

const App: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<String[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  //item selection
  const handleItemSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const itemName = e.target.value;
    if (e.target.checked) {
      setSelectedItems([...selectedItems, itemName]);
    } else {
      setSelectedItems(selectedItems.filter((item) => item !== itemName));
    }
  };
  
//place order
  const handlePlaceOrder = async () => {
    try {
      const response = await axios.post("http://localhost:5555/place-order", {
        selectedItems,
      });
      setPackages((prevPackages) => [...prevPackages, ...response.data]);
      setSelectedItems([]);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  //Previous and next control
  const totalPages = Math.ceil(itemsList.length / itemsPerPage);
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = itemsList.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      <h1 className="text-center text-xl py-4 border-b border-slate-400">Courier Service</h1>

      <div className="flex justify-between px-12 py-5">
        <div className="itemsList w-[60%]">
          <div className="title flex justify-between px-2 mr-28">
            <p>Name:</p>
            <p>Price:</p>
            <p>Weight:</p>
            <p></p>
          </div>
          {currentItems.map((item) => (
            <div
              key={item.name}
              className="bg-[#D1CEF3] my-4 mr-28 rounded w-full"
            >
              <div className="flex justify-between items-center py-2 px-4">
                <p>{item.name}</p>
                <p>${item.price}</p>
                <p>{item.weight}g</p>
                <input
                  type="checkbox"
                  value={item.name}
                  onChange={handleItemSelection}
                  checked={selectedItems.includes(item.name)}
                  className="mr-28"
                />
              </div>
            </div>
          ))}

          {/* prev and next buttons */}
          <div className="flex justify-between text-sm">
            <button onClick={handlePrevPage} disabled={currentPage === 1}>
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>

          <div className="place-order w-full flex justify-center mt-6">
            <button
              onClick={handlePlaceOrder}
              className="border px-6 py-2 bg-black rounded text-white"
            >
              Place Order
            </button>
          </div>
        </div>

        <div className="packagesList w-[30%] h-[75vh]">
          <h2 className="mb-3 font-bold">Your packages:</h2>
          {packages.length === 0 ? (
            <p> Place order to view packages</p>
          ) : (
            packages.map((pkg, index) =>
              pkg.totalPrice > 250 ? (
                <div key={index} className="mb-4 bg-red-200 rounded px-4 py-2">
                  <h3>Package {index + 1}</h3>
                  <div>Total price in a package cannot exceed $250</div>
                </div>
              ) : (
                <div key={index} className="mb-4 bg-[#94F0D6] rounded px-4 py-2">
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
      </div>
    </>
  );
};

export default App;
