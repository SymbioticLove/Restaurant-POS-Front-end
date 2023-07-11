import React, { useState, useEffect } from 'react';
import SizeButtons from './components/sizeButtons';
import FlavorButtons from './components/flavorButtons';
import SyrupToppingButtons from './components/syrupToppingButtons';
import DiscountButtons from './components/discountButtons';
import AddNewUser from './components/AddNewUser';
import axios from 'axios';
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
  const [loginNumberTracking, setLoginNumberTracking] = useState("");
  const [employeeName, setEmployeeName] = useState("");

  const logToConsole = (message) => {
    setConsoleLogs((prevLogs) => [...prevLogs, message]);
  };

  useEffect(() => {
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

  const handlePayNow = async () => {
    if (!selectedSize) {
      alert("Select a Size!"); // Make User Select Size
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
  
    const logs = [];
    logs.push('');
    logs.push('');
    logs.push(`Size: ${selectedSize ? selectedSize.charAt(0).toUpperCase() + selectedSize.slice(1) : null}`);
  
    const flavorsText = selectedFlavors.length > 0 ? selectedFlavors.join(", ") : "None";
    logs.push(`Flavors: ${flavorsText}`);
  
    const nonCustomAddIns = syrupToppings.filter((topping) => topping.isActive && !topping.custom);
    const selectedAddIns = nonCustomAddIns.map((topping) => topping.name);
  
    if (selectedAddIns.length > 0) {
      logs.push(`Add-ins: ${selectedAddIns.join(", ")}`);
    } else {
      logs.push("Add-ins: None");
    }
  
    const tax = (originalTotal * 0.056).toFixed(2);
    const totalWithTax = (parseFloat(originalTotal) + parseFloat(tax)).toFixed(2);
  
    logs.push('');
    logs.push(`Subtotal: $${originalTotal.toFixed(2)}`);
    logs.push(`Tax: $${tax}`);
    logs.push(`Total: $${totalWithTax}`);
    logs.push('');
  
    setConsoleLogs(logs); // Update the console logs with the new order information
  
    const updatedToppings = syrupToppings.map((topping) => {
      const updatedTopping = { ...topping };
      if (updatedTopping.isActive) {
        updatedTopping.soldCount += 1;
      }
      updatedTopping.isActive = false;
      return updatedTopping;
    });
  
    setSyrupToppings(updatedToppings);
    setSelectedSize(null); // Reset selectedSize to null
    setSelectedFlavors([]); // Reset selectedFlavors to an empty array
    setToppingsPrice(0); // Reset toppingsPrice to 0
    setSelectedDiscount(null); // Reset selectedDiscount to null
  
    const soldLogs = syrupToppings
      .filter((topping) => topping.isActive && !topping.custom)
      .map((topping) => {
        return {
          name: topping.name,
          price: topping.price,
          isActive: topping.isActive,
          soldCount: topping.soldCount + 1
        };
      });
  
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(soldLogs)
    };
  
    try {
      const response = await fetch('http://localhost:5000/inventory', requestOptions);
      if (response.ok) {
        // Sold logs successfully updated in the inventory
        console.log('Sold logs updated in the inventory.');
      } else {
        console.error('Failed to update sold logs in the inventory.');
      }
    } catch (error) {
      console.error('Error occurred while updating sold logs in the inventory:', error);
    }
  
    // Send the relevant information to the simulated payment API
    const paymentData = {
      subtotal: originalTotal.toFixed(2),
      tax: tax,
      total: totalWithTax,
      discount: selectedDiscount ? true : false,
      discountAmount: discountAmount.toFixed(2),
      discountType: discountType
    };
  
    try {
      const paymentResponse = await fetch('http://localhost:5000/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      });
  
      if (paymentResponse.ok) {
        const paymentResult = await paymentResponse.text();
        console.log('Payment API response:', paymentResult);
        alert("Please Present Payment");
      } else {
        console.error('Failed to send payment data to the API.');
      }
    } catch (error) {
      console.error('Error occurred while sending payment data to the API:', error);
    }
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
    const usersData = require('./data/users.json');
    const matchedEntry = usersData.find((user) => user.UserId === loginNumber);
  
    if (matchedEntry) {
      if (!matchedEntry.IsClockedIn) {
        alert('Please Clock In'); // Display an alert if the user is not clocked in
        return;
      }
  
      setIsLoggedIn(true); // Set the login status to true if a match is found
      setLoginNumberTracking(loginNumber); // Capture the login number if it is a successful login
      setEmployeeName(`${matchedEntry.FName} ${matchedEntry.LName}`); // Capture the employee name
      setAccessLevel(matchedEntry.AccessLevel); // Set the access level based on the matched entry's AccessLevel property
    } else {
      alert('No match found');
      setLoginNumber(''); // Clear the login number if no match is found
    }
  };    
  
  const handleClockInOut = async () => {
    const usersData = require('./data/users.json');
    const matchedIndex = usersData.findIndex((user) => user.UserId === loginNumber);
  
    if (matchedIndex !== -1) {
      const matchedEntry = usersData[matchedIndex];
      if (!matchedEntry.IsClockedIn) {
        const confirmClockIn = window.confirm('Would you like to clock in?');
        if (confirmClockIn) {
          // Update the IsClockedIn flag to true
          matchedEntry.IsClockedIn = true;
          try {
            await axios.post('http://localhost:5000/users', matchedEntry);
            alert('You have clocked in successfully.');
          } catch (error) {
            console.error('Error updating user data:', error);
            alert('Failed to update user data. Check the "users.json" file and error message!');
          }
        } else {
          return;
        }
      } else {
        const confirmClockOut = window.confirm('Would you like to clock out?');
        if (confirmClockOut) {
          // Update the IsClockedIn flag to false
          matchedEntry.IsClockedIn = false;
          try {
            await axios.post('http://localhost:5000/users', matchedEntry);
            alert('You have clocked out successfully.');
            setLoginNumber('');
          } catch (error) {
            console.error('Error updating user data:', error);
            alert('Failed to update user data. Please try again.');
          }
        } else {
          return;
        }
      }
      // Update the usersData array with the updated entry
      usersData[matchedIndex] = matchedEntry;
    } else {
      alert('User Not Found');
    }
  };    

  const handleLogoutButtonClick = () => {
    setIsLoggedIn(false); // Set isLoggedIn to false to log out the user
    setLoginNumber(""); // Clear the login number
    setLoginNumberTracking(""); // Clear the login number tracking
    setEmployeeName(""); // Clear the stored employee name
    setConsoleLogs([]); // Clear the console logs
    setCustomerName(""); // Clear the customer name
    setSelectedSize(null); // Reset selectedSize to null
    setSelectedFlavors([]); // Reset selectedFlavors to an empty array
    setToppingsPrice(0); // Reset toppingsPrice to 0
    setSelectedDiscount(null); // Reset selectedDiscount to null
    setSyrupToppings((prevToppings) => {
      // Reset all topping buttons to isActive: false and soldCount: 0
      return prevToppings.map((topping) => ({
        ...topping,
        isActive: false,
      }));
    });
  };
  
  const handleClearButtonClick = () => {
    setLoginNumber('');
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
          <button onClick={handleClockInOut}>Clock In/Out</button>
          <button onClick={handleClearButtonClick}>Clear</button>
        </div>
      </div>
      )}
      {isLoggedIn && accessLevel === "Admin" && (
        <>
        <h1>{employeeName} - mgr.</h1>
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
            <h3>Subtotal</h3>
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
          <button onClick={handleLogoutButtonClick}>Logout</button>
          <AddNewUser />
        </>
      )}
      {isLoggedIn && accessLevel === "User" && (
      <div>
        <h1>{employeeName}</h1>
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
          <h3>Subtotal</h3>
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