// Importing necessary libraries and hooks
import React, {useState} from 'react';
import SizeButtons from './components/sizeButtons';
import FlavorButtons from './components/flavorButtons';
import SyrupToppingButtons from './components/syrupToppingButtons';
import DiscountButtons from './components/discountButtons';
import AddNewUser from './components/AddNewUser';
import LoginContainer from './components/loginContainer';
import axios from 'axios';
import './App.css';

// This program is a highly modular and customizable demo MVP of a new, better POS system. It is designed to handle
// every need of a small restaurant or retailer, from inventory to employee data, payroll and ordering, reporting and more.
// This POS system is created single-handedly by an individual with 14 years of experience in the restaurant industry,
// with 10 of those in management. This system is designed to be highly secure, running entirely on a local server.
// This server is built as an API with Flask ('server.py'), and this API is the only way in which this data can ever be
// written or modified. Even with malicious intent and from a POS terminal on the local network, it would be challenging
// to modify data in any way other than in the normal course of business. The only access points to the system are through
// the credit card terminal and through any internet connection on the machine that is running the Flask server.
// Data is stored in .json files (currently 'orders', 'users', and 'inventory' in the 'data' directory) and accessed through
// a Python reporting script ('reports.py') that currently generates sales, sales/emp., labor, discounts/emp.,
// clocked-in reports, and tax reports. Taxes are calculated based on a faux payment API built into the demo server
// at a rate of 5.6%. Scripts to zip, label, store, and properly re-initialize empty .json files weekly, and access and
// categorize these files in weekly/monthly/anual directories are in progress. Through these, a 2tb hard-drive could 
// theoretically store years worth of data for a small business in a highly secure, local manner. Also in progress
// is a complete inventory program that also interacts with the API to manage inventory in a more comprehensive manner,
// alerting businesses when stock falls low or when things were not received, etc.

const App = () => {
  // State variables
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginNumber, setLoginNumber] = useState("");
  const [accessLevel, setAccessLevel] = useState("");
  const [loginNumberTracking, setLoginNumberTracking] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [orderItems, setOrderItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [runningTotals, setRunningTotals] = useState([]);
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

  // Function to calculate the total price of an item 
  const calculateItemTotal = (item) => {
    let sizePrice = getSizePrice(item.size);
    let flavorPrice = item.flavors.length * 0.89;

    return sizePrice + flavorPrice + item.toppingsPrice;
  };

  // Function to calculate the running total of the order
  const calculateRunningTotal = () => {
    let total = 0;
  
    if (runningTotals.length === 0) {
      return 0; // Return 0 when the array is empty
    }
  
    for (const itemTotal of runningTotals) {
      total += itemTotal;
    }
  
    if (selectedDiscount) {
      const discount = discounts.find((discount) => discount.name === selectedDiscount);
      if (discount) {
        const discountMultiplier = 1 - discount.discount;
        total *= discountMultiplier;
      }
    }
  
    // Check if total is NaN before applying toFixed
    return isNaN(total) ? 0 : total.toFixed(2);
  };  
  
  // Function to handle adding an item to the order
  const handleAddToOrder = () => {
    if (!selectedSize) {
      alert("Select a Size!");
      return;
    }
  
    const item = {
      size: selectedSize,
      flavors: selectedFlavors,
      toppingsPrice: toppingsPrice,
    };
  
    setOrderItems((prevItems) => [...prevItems, item]);
    setSubtotal((prevSubtotal) => prevSubtotal + calculateItemTotal(item));
    setRunningTotals((prevTotals) => [...prevTotals, calculateItemTotal(item)]);
  
    setSelectedSize(null);
    setSelectedFlavors([]);
    setToppingsPrice(0);
    setSyrupToppings((prevToppings) =>
      prevToppings.map((topping) => ({
        ...topping,
        isActive: false,
      }))
    );
  };  

  // Function to get the price of a size
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

  // Function to handle adding a topping
  const handleAddTopping = (price) => {
    setToppingsPrice((prevPrice) => prevPrice + price);
  };

  // Function to calculate the total price of the current item
  const calculateCurrentItem = () => {
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

  // Function to handle removing an item from the order
  const handleRemoveOrder = (index) => {
    const removedItem = orderItems[index];
    const removedItemTotal = calculateItemTotal(removedItem);

    setOrderItems((prevItems) => prevItems.filter((_, i) => i !== index));
    setRunningTotals((prevTotals) => prevTotals.filter((_, i) => i !== index));

    setSubtotal((prevSubtotal) => {
      const newSubtotal = prevSubtotal - removedItemTotal;
      return newSubtotal < 0 ? 0 : newSubtotal;
    });
  };

  // Function to handle the payment process
  const handlePayNow = async () => {
    if (orderItems.length === 0) {
      alert("No items in the order!"); // Make user select more than 0 items
      return;
    }
  
    let name = prompt("Enter customer name:"); // Prompt for customer name
  
    while (!name) {
      name = prompt("Enter customer name:"); // Re-prompt for customer name
    }
  
    
    // Reset the subtotal
    setSubtotal(0);
  
    let originalTotal = subtotal;
    let discountAmount = 0;
    let discountType = "None"; // Default value for discount type
  
    if (selectedDiscount) {
      const discount = discounts.find((discount) => discount.name === selectedDiscount);
      if (discount) {
        const discountMultiplier = 1 - discount.discount;
        discountAmount = originalTotal - (originalTotal * discountMultiplier);
        originalTotal = originalTotal * discountMultiplier;
        discountType = discount.name; // Store the discount type
      }
    }
  
    const tax = (originalTotal * 0.056).toFixed(2);
    const totalWithTax = (parseFloat(originalTotal) + parseFloat(tax)).toFixed(2);
  
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
    setOrderItems([]);  // Reset the OrderItems array
    setRunningTotals([]); // Reset the RunningTotal
  
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
      discountType: discountType,
      employee: loginNumberTracking,
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
        if (!selectedDiscount) {
          alert(`Please Present Payment\nSubtotal: ${originalTotal.toFixed(2)}\nTax: ${tax}\nTotal: ${totalWithTax}`);
        } else {
          alert(`Please Present Payment\nSubtotal: $${originalTotal.toFixed(2)}\nDiscount Amount: $${discountAmount.toFixed(2)}\nDiscount Type: ${discountType}\nTax: $${tax}\nTotal (after discount and tax): $${(originalTotal + parseFloat(tax)).toFixed(2)}`);
        }
      } else {
        console.error('Failed to send payment data to the API.');
      }
    } catch (error) {
      console.error('Error occurred while sending payment data to the API:', error);
    }
  };     
  
  // Function to handle selecting a discount
  const handleSelectDiscount = (discount) => {
    if (selectedDiscount === discount) {
      setSelectedDiscount(null); // Deselect the currently selected discount
    } else {
      setSelectedDiscount(discount); // Select the clicked discount
    }
  };

  // Function to handle number pad button click
  const handleNumberPadClick = (number) => {
    if (loginNumber.length < 4) {
      setLoginNumber(loginNumber + number); // Append the clicked number to the current login number
    }
  };
  
  // Function to handle the enter button click
  const handleEnterButtonClick = async () => {
    if (loginNumber === '5555') {
      // Debugging login with setAccessLevel of Admin
      setAccessLevel('Admin');
      setIsLoggedIn(true);
      return;
    }
  
    const response = await fetch('http://localhost:5000/users');
    const usersData = await response.json();
    const matchedEntry = usersData.find((user) => user.UserId === loginNumber);
  
    if (matchedEntry) {
      if (!matchedEntry.IsClockedIn) {
        alert('Please Clock In');
        return;
      }
  
      setIsLoggedIn(true);
      setLoginNumberTracking(loginNumber);
      setEmployeeName(`${matchedEntry.FName} ${matchedEntry.LName}`);
      setAccessLevel(matchedEntry.AccessLevel);
    } else {
      alert('No match found');
      setLoginNumber('');
    }
  };         
  
  // Function to handle clock in/out
  const handleClockInOut = async () => {
    const usersData = require('./data/users.json');
    const matchedIndex = usersData.findIndex((user) => user.UserId === loginNumber);
  
    if (matchedIndex !== -1) {
      const matchedEntry = usersData[matchedIndex];
      const timestamp = new Date();
      const formattedTimestamp = `${timestamp.getFullYear()}-${(timestamp.getMonth() + 1).toString().padStart(2, '0')}-${timestamp.getDate().toString().padStart(2, '0')} ${timestamp.getHours().toString().padStart(2, '0')}:${timestamp.getMinutes().toString().padStart(2, '0')}:${timestamp.getSeconds().toString().padStart(2, '0')}`;
  
      if (!matchedEntry.IsClockedIn) {
        const confirmClockIn = window.confirm('Would you like to clock in?');
        if (confirmClockIn) {
          // Update the IsClockedIn flag to true
          matchedEntry.IsClockedIn = true;
          matchedEntry.MostRecentClockIn = formattedTimestamp; // Update the most recent clock-in key
  
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
          matchedEntry.MostRecentClockOut = formattedTimestamp; // Update the most recent clock-out key
  
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
       
  // Function to handle the logout button click
  const handleLogoutButtonClick = () => {
    setIsLoggedIn(false); // Set isLoggedIn to false to log out the user
    setLoginNumber(""); // Clear the login number
    setLoginNumberTracking(""); // Clear the login number tracking
    setEmployeeName(""); // Clear the stored employee name
    setSelectedSize(null); // Reset selectedSize to null
    setSelectedFlavors([]); // Reset selectedFlavors to an empty array
    setToppingsPrice(0); // Reset toppingsPrice to 0
    setSelectedDiscount(null); // Reset selectedDiscount to null
    setSyrupToppings((prevToppings) => {
      return prevToppings.map((topping) => ({
        ...topping,
        isActive: false,
      }));
    });
  };
  
  // Function to handle the clear button click
  const handleClearButtonClick = () => {
    setLoginNumber('');
  };


  // Render the POS interface
  return (
    <div className="pos-container">
      {!isLoggedIn && (
        <LoginContainer
          loginNumber={loginNumber}
          handleNumberPadClick={handleNumberPadClick}
          handleEnterButtonClick={handleEnterButtonClick}
          handleClearButtonClick={handleClearButtonClick}
          handleClockInOut={handleClockInOut}
        />
      )}
      {isLoggedIn && accessLevel === "Admin" && (
        <div className="wrapper1">
          <div className="inner-left">
            <h1 className="emp-name">{employeeName} - mgr.</h1>
            <button onClick={handleLogoutButtonClick} className="logout-button">Logout</button>
            <AddNewUser />
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
          </div>
          <div className="receipt-div">
            <div className="running-total">
              Current Item: ${calculateCurrentItem()}
            </div>
            <div className="item-container">
              {orderItems.map((item, index) => (
                <div className="item-list" key={index}>
                <button onClick={() => handleRemoveOrder(index)} className="x-button">X</button>
                  <p>
                    <strong>{item.size}</strong> <em>{item.flavors.join(" + ")}</em>: ${runningTotals[index].toFixed(2)}{" "}
                  </p>
                </div>
              ))}
            </div>
            <DiscountButtons
              selectedDiscount={selectedDiscount}
              onSelectDiscount={handleSelectDiscount}
              discounts={discounts}
            />
            <h3 className="discount-h3">Discounts</h3>
            <button className="pay-now-button" onClick={handlePayNow}>
              Pay Now
            </button>
            <button className="add-button" onClick={handleAddToOrder}>
              Add Item
            </button>
            <div className="subtotal-container">
              Subtotal: ${calculateRunningTotal()}
            </div>
          </div>
        </div>
      )}
      {isLoggedIn && accessLevel === "User" && (
      <div className="wrapper1">
      <div>
        <h1 className="emp-name">{employeeName}</h1>
        <button onClick={handleLogoutButtonClick} className="logout-button">Logout</button>
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
        </div>
        <div className="receipt-div">
            <div className="running-total">
              Current Item: ${calculateCurrentItem()}
            </div>
            <div className="item-container">
              {orderItems.map((item, index) => (
                <div className="item-list" key={index}>
                <button onClick={() => handleRemoveOrder(index)} className="x-button">X</button>
                  <p>
                    <strong>{item.size}</strong> <em>{item.flavors.join(" + ")}</em>: ${runningTotals[index].toFixed(2)}{" "}
                  </p>
                </div>
              ))}
            </div>
            <DiscountButtons
              selectedDiscount={selectedDiscount}
              onSelectDiscount={handleSelectDiscount}
              discounts={discounts}
            />
            <h3 className="discount-h3">Discounts</h3>
            <button className="pay-now-button" onClick={handlePayNow}>
              Pay Now
            </button>
            <button className="add-button" onClick={handleAddToOrder}>
              Add Item
            </button>
            <div className="subtotal-container">
              Subtotal: ${calculateRunningTotal()}
            </div>
          </div>
      </div>
    )}
    </div>
  );
};

export default App;