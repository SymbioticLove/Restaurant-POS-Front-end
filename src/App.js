import React, { useState, useEffect } from 'react';
import SizeButtons from './components/sizeButtons';
import FlavorButtons from './components/flavorButtons';
import SyrupToppingButtons from './components/syrupToppingButtons';
import DiscountButtons from './components/discountButtons';
import './App.css';

const App = () => {
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedFlavors, setSelectedFlavors] = useState([]);
  const [toppingsPrice, setToppingsPrice] = useState(0);
  const [syrupToppings, setSyrupToppings] = useState([
    { name: 'Sweet Cold Foam', price: 0.99, isActive: false, soldCount: 0 },
    { name: 'Caramel Drizzle', price: 0.79, isActive: false, soldCount: 0 },
    { name: 'Whipped Cream', price: 0.49, isActive: false, soldCount: 0 },
    { name: 'Chocolate Shavings', price: 0.69, isActive: false, soldCount: 0 },
    { name: 'Cinnamon Powder', price: 0.59, isActive: false, soldCount: 0 },
    { name: 'Vanilla Syrup', price: 0.89, isActive: false, soldCount: 0 },
    { name: 'Hazelnut Syrup', price: 1.29, isActive: false, soldCount: 0 },
    { name: 'Caramel Syrup', price: 1.19, isActive: false, soldCount: 0 },
    { name: 'Mocha Syrup', price: 1.39, isActive: false, soldCount: 0 },
    { name: 'Toffee Nut Syrup', price: 1.49, isActive: false, soldCount: 0 },
    { name: 'Peppermint Syrup', price: 1.59, isActive: false, soldCount: 0 },
    { name: 'Coconut Milk', price: 0.99, isActive: false, soldCount: 0 },
    { name: 'Almond Milk', price: 0.99, isActive: false, soldCount: 0 },
    { name: 'Oat Milk', price: 0.99, isActive: false, soldCount: 0 },
    { name: 'Soy Milk', price: 0.99, isActive: false, soldCount: 0 },
    { name: 'Caramel Sauce', price: 1.09, isActive: false, soldCount: 0 },
    { name: 'Chocolate Sauce', price: 1.09, isActive: false, soldCount: 0 },
    { name: 'Caramel Whipped Cream', price: 1.29, isActive: false, soldCount: 0 },
    { name: 'Chocolate Whipped Cream', price: 1.29, isActive: false, soldCount: 0 },
    { name: 'Vanilla Whipped Cream', price: 1.29, isActive: false, soldCount: 0 },
  ]);
  
  const discounts = [
    { name: 'Quality 25%', discount: 0.25 },
    { name: 'Quality 50%', discount: 0.5 },
    { name: 'Quality 75%', discount: 0.75 },
    { name: 'Quality 100%', discount: 1.00 },
    { name: 'Service 25%', discount: 0.25 },
    { name: 'Service 50%', discount: 0.5 },
    { name: 'Service 75%', discount: 0.75 },
    { name: 'Service 100%', discount: 1.00 },
    { name: 'Friends and Family', discount: 0.2 },
    { name: 'Employee', discount: 0.25 },
    { name: 'Manager', discount: 1.00 },
  ];

  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginNumber, setLoginNumber] = useState("");
  const [accessLevel, setAccessLevel] = useState("");

  useEffect(() => {
    const logs = [];

    const logToConsole = (message) => {
      logs.push(message);
      setConsoleLogs([...logs]);
    };

    console.log = (message) => logToConsole(message);

    return () => {
      console.log = console.log;
    };
  }, []);

  const calculateRunningTotal = () => {
    let sizePrice = selectedSize ? getSizePrice(selectedSize) : 0;
    let flavorPrice = selectedFlavors.length * 0.89;
    let total = sizePrice + flavorPrice + toppingsPrice;

    if (selectedDiscount) {
      const discount = discounts.find((discount) => discount.name === selectedDiscount);
      if (discount) {
        const discountMultiplier = 1 - discount.discount;
        total *= discountMultiplier;
      }
    }

    return total.toFixed(2);
  };

  const handlePayNow = () => {
    if (!selectedSize) {
      console.log("Select a Size!"); // Make User Select Size
      return;
    }

    let name = prompt("Enter customer name:"); // Prompt for customer name

      while (!name) {
        name = prompt("Enter customer name:"); // Re-prompt for customer name
      }

      setCustomerName(name); // Set the customer name

  
    let sizePrice = getSizePrice(selectedSize);
    let flavorPrice = selectedFlavors.length * 0.89;
    let addInsPrice = toppingsPrice;
    let total = sizePrice + flavorPrice + addInsPrice;
  
    // Apply discount if selected
    let originalTotal = total;
    let discountAmount = 0;
    let discountType = "None"; // Default value for discount type
    if (selectedDiscount) {
      const discount = discounts.find((discount) => discount.name === selectedDiscount);
      if (discount) {
        const discountMultiplier = 1 - discount.discount;
        const discountedSizePrice = sizePrice * discountMultiplier;
        const discountedFlavorPrice = flavorPrice * discountMultiplier;
        const discountedAddInsPrice = addInsPrice * discountMultiplier;
        discountAmount = originalTotal - (discountedSizePrice + discountedFlavorPrice + discountedAddInsPrice);
        total = discountedSizePrice + discountedFlavorPrice + discountedAddInsPrice;
        discountType = discount.name; // Store the discount type
      }
    }
  
    // Reset selections
    setSelectedSize(null);
    setSelectedFlavors([]);
    setToppingsPrice(0);
    setSelectedDiscount(null); // Deselect the currently selected discount
    
    console.log('');
    console.log('');
    console.log(`Size: ${selectedSize ? selectedSize.charAt(0).toUpperCase() + selectedSize.slice(1) : null}`);
  
    let flavorsText = selectedFlavors.length > 0 ? selectedFlavors.join(", ") : "None";
    console.log(`Flavors: ${flavorsText}`);
  
    // Accumulate selected add-ins and their sold counts
    const nonCustomAddIns = syrupToppings.filter((topping) => topping.isActive && !topping.custom);
    const selectedAddIns = nonCustomAddIns.map((topping) => topping.name);
    const nonCustomAddInCounts = nonCustomAddIns.map((topping) => topping.soldCount + 1);
  
    if (selectedAddIns.length > 0) {
      console.log(`Add-ins: ${selectedAddIns.join(", ")}`);
    } else {
      console.log("Add-ins: None");
    }
  
    // Calculate tax
    const tax = (originalTotal * 0.056).toFixed(2);
  
    // Calculate total with tax
    const totalWithTax = (parseFloat(originalTotal) + parseFloat(tax)).toFixed(2);
  
    console.log('');
    console.log(`Subtotal: $${originalTotal.toFixed(2)}`);
    console.log(`Tax: $${tax}`);
  
    if (selectedDiscount) {
      const discountedTotalWithTax = (parseFloat(total) + parseFloat(tax)).toFixed(2);
  
      console.log(`Discounted Total: $${discountedTotalWithTax}`);
      console.log('');
      console.log(`Total Discount: $${discountAmount.toFixed(2)}`);
      console.log(`Discount Type: ${discountType}`);
      console.log('');
    } else {
      console.log(`Total: $${totalWithTax}`);
      console.log('');
    }
  
    nonCustomAddIns.forEach((addIn, index) => {
      const addInCount = nonCustomAddInCounts[index];
      console.log(`Total ${addIn.name} sold: ${addInCount}`);
    });
  
    // Update syrup toppings
    const updatedToppings = syrupToppings.map((topping) => {
      const updatedTopping = { ...topping };
      if (updatedTopping.isActive) {
        updatedTopping.soldCount += 1;
      }
      updatedTopping.isActive = false;
      return updatedTopping;
    });
  
    setSyrupToppings(updatedToppings);
  };                 
  
  const getSizePrice = (size) => {
    switch (size) {
      case 'Small':
        return 2.49;
      case 'Medium':
        return 3.29;
      case 'Large':
        return 4.19;
      default:
        return 0;
    }
  };

  const handleAddTopping = (price) => {
    setToppingsPrice((prevPrice) => prevPrice + price);
  };  

  const handleSelectDiscount = (discount) => {
    if (selectedDiscount === discount) {
      setSelectedDiscount(null); // Deselect the currently selected discount
    } else {
      setSelectedDiscount(discount); // Select the clicked discount
    }
  };

  const handleNumberPadClick = (number) => {
    if (loginNumber.length < 4) {
      setLoginNumber(loginNumber + number); // Append the clicked number to the current login number
    }
  };

  const handleEnterButtonClick = () => {
    // Check if the login number matches any entries in the dataset
    const dataset = [
      { Login: "1111", "Access-level": "user" },
      { Login: "9999", "Access-level": "admin" },
    ];

    const matchedEntry = dataset.find((entry) => entry.Login === loginNumber);

    if (matchedEntry) {
      setIsLoggedIn(true); // Set the login status to true if a match is found
      setAccessLevel(matchedEntry["Access-level"]); // Set the access level based on the matched entry
    } else {
      setLoginNumber(""); // Clear the login number if no match is found
    }
  };

  const handleLogoutButtonClick = () => {
    setIsLoggedIn(false); // Set isLoggedIn to false to log out the user
    setLoginNumber(""); // Clear the login number
    setConsoleLogs([]); // Clear the console logs
    setCustomerName(""); // Clear the customer name
  };

  return (
    <div className="pos-container">
      {!isLoggedIn && (
        <div className="login-container">
          <h2>Login</h2>
          <div className="login-window">{loginNumber}</div>
          <div className="number-pad">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((number) => (
              <button key={number} onClick={() => handleNumberPadClick(number)}>
                {number}
              </button>
            ))}
            <button onClick={handleEnterButtonClick}>Enter</button>
          </div>
        </div>
      )}
      {isLoggedIn && accessLevel === "admin" && (
        <>
          <SizeButtons selectedSize={selectedSize} onSelectSize={setSelectedSize} />
          <FlavorButtons
            selectedFlavors={selectedFlavors}
            onSelectFlavor={setSelectedFlavors}
          />
          <SyrupToppingButtons
            syrupToppings={syrupToppings}
            setSyrupToppings={setSyrupToppings}
            onAddTopping={handleAddTopping}
          />
          <DiscountButtons
            selectedDiscount={selectedDiscount}
            onSelectDiscount={handleSelectDiscount}
            discounts={discounts}
          />
          <div className="running-total">
            Running Subtotal: ${calculateRunningTotal()}
          </div>
          <button className="pay-now-button" onClick={handlePayNow}>
            Pay Now
          </button>
          <div className="selection-logs">
            <h3>Printer Ticket</h3>
            {customerName && <h3>{customerName}</h3>} {/* Display customer name */}
            {consoleLogs
              .filter(
                (log) =>
                  log.startsWith("Size:") ||
                  log.startsWith("Flavors:") ||
                  log.startsWith("Add-ins:")
              )
              .map((log, index) => (
                <p key={index}>{log}</p>
              ))}
          </div>
          <div className="total-logs">
            <h3>Payment API information</h3>
            {consoleLogs
              .filter(
                (log) =>
                  log.startsWith("Subtotal:") ||
                  log.startsWith("Tax:") ||
                  log.startsWith("Total:") ||
                  log.startsWith("Discounted Total:")
              )
              .map((log, index) => (
                <p key={index}>{log}</p>
              ))}
          </div>
          <div className="discount-logs">
            <h3>Discount Logs</h3>
            {consoleLogs
              .filter(
                (log) =>
                  log.startsWith("Total Discount:") ||
                  log.startsWith("Discount Type:")
              )
              .map((log, index) => (
                <p key={index}>{log}</p>
              ))}
          </div>
          <div className="sold-logs">
            <h3>Total Sold Logs</h3>
            {consoleLogs
              .filter((log) => log.includes("Total") && log.includes("sold:"))
              .map((log, index) => (
                <p key={index}>{log}</p>
              ))}
          </div>
          <button onClick={handleLogoutButtonClick}>Logout</button>
        </>
      )}
      {isLoggedIn && accessLevel === "user" && (
      <div>
        <SizeButtons selectedSize={selectedSize} onSelectSize={setSelectedSize} />
        <FlavorButtons
          selectedFlavors={selectedFlavors}
          onSelectFlavor={setSelectedFlavors}
        />
        <SyrupToppingButtons
          syrupToppings={syrupToppings}
          setSyrupToppings={setSyrupToppings}
          onAddTopping={handleAddTopping}
        />
        <div className="running-total">
          Running Subtotal: ${calculateRunningTotal()}
        </div>
        <button className="pay-now-button" onClick={handlePayNow}>
          Pay Now
        </button>
        <div className="selection-logs">
          <h3>Printer Ticket</h3>
          {customerName && <h3>{customerName}</h3>}
          {consoleLogs
            .filter(
              (log) =>
                log.startsWith("Size:") ||
                log.startsWith("Flavors:") ||
                log.startsWith("Add-ins:")
            )
            .map((log, index) => (
              <p key={index}>{log}</p>
            ))}
        </div>
        <div className="total-logs">
          <h3>Payment API information</h3>
          {consoleLogs
            .filter(
              (log) =>
                log.startsWith("Subtotal:") ||
                log.startsWith("Tax:") ||
                log.startsWith("Total:") ||
                log.startsWith("Discounted Total:")
            )
            .map((log, index) => (
              <p key={index}>{log}</p>
            ))}
        </div>
        <button onClick={handleLogoutButtonClick}>Logout</button>
      </div>
    )}
    </div>
  );
};

export default App;