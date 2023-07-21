// Importing necessary libraries and styles
import React, { useState, useEffect } from 'react';
import './syrupToppingButtons.css';

// SyrupToppingButtons is a functional component that renders buttons for different syrup toppings.
// It takes three props: syrupToppings, setSyrupToppings, and onAddTopping.
// syrupToppings is an array of objects where each object represents a syrup topping.
// setSyrupToppings is a function that updates the syrup toppings.
// onAddTopping is a function that updates the total price when a topping is added or removed.
const SyrupToppingButtons = ({ syrupToppings, setSyrupToppings, onAddTopping }) => {
  // State variables for the new button's name, price, total price of custom buttons, and selected toppings.
  const [newButtonName, setNewButtonName] = useState('');
  const [newButtonPrice, setNewButtonPrice] = useState(0);
  const [customButtonTotal, setCustomButtonTotal] = useState(0);
  const [selectedToppings, setSelectedToppings] = useState([]);

  // useEffect hook to update the selected toppings whenever syrupToppings changes.
  useEffect(() => {
    setSelectedToppings(syrupToppings.filter((topping) => topping.isActive));
  }, [syrupToppings]);

  // toggleButton is a function that toggles the active state of a topping.
  // It also updates the total price and the total price of custom buttons.
  const toggleButton = (index) => {
    const updatedToppings = [...syrupToppings];
    const topping = updatedToppings[index];
    topping.isActive = !topping.isActive;
    setSyrupToppings(updatedToppings);
    const priceToAdd = topping.isActive ? topping.price : -topping.price;
    onAddTopping(priceToAdd);
    if (topping.custom) {
      setCustomButtonTotal((prevTotal) => prevTotal + priceToAdd);
    }
  };

  // handleOpenButton is a function that creates a new button with the specified name and price.
  // It validates the input and updates the syrup toppings and resets the input fields.
  const handleOpenButton = () => {
    if (newButtonName.trim() === '' || newButtonPrice <= 0) {
      // Display an error message or handle invalid input
      return;
    }

    const newButton = {
      name: newButtonName.trim(),
      price: newButtonPrice,
      isActive: false,
      custom: true,
    };

    setSyrupToppings((prevToppings) => [...prevToppings, newButton]);
    setNewButtonName('');
    setNewButtonPrice(0);
  };

  // The component renders a list of buttons for each topping and a form to create a new button.
  // Each button displays the topping's name and indicates whether it's a custom topping.
  // The selected toppings and the total price of custom buttons are also displayed.
  return (
    <div className="syrup-topping-buttons">
      <h3>Add-Ins/Toppings</h3>
      <div className="topping-container-wrapper">
        <div className="topping-container">
          {syrupToppings.map((syrupTopping, index) => (
            <button
              key={index}
              className={`syrup-topping-button ${syrupTopping.isActive ? 'selected' : ''}`}
              onClick={() => toggleButton(index)}
            >
              {syrupTopping.name}
              {syrupTopping.custom && <span className="custom-indicator">(Custom)</span>}
            </button>
          ))}
        </div>
      </div>
      {selectedToppings.length > 0 && (
        <div className="scroll-container-wrapper">
          <ul className="selected-toppings-list">
            {selectedToppings.map((selectedTopping, index) => (
              <li key={index}>
                {selectedTopping.name}: ${selectedTopping.price.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="new-button">
        <div className="new-button-container">
          <input
            type="text"
            placeholder="Item Name"
            className="input"
            value={newButtonName}
            onChange={(e) => setNewButtonName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Price"
            className="input"
            value={newButtonPrice}
            onChange={(e) => setNewButtonPrice(parseFloat(e.target.value))}
          />
          <button onClick={handleOpenButton}>Create Button</button>
        </div>
        <div className="custom-button-total">
          Total From Custom Buttons: ${customButtonTotal.toFixed(2)}
        </div>
      </div>
    </div>
  );
};

// Exporting the SyrupToppingButtons component for use in other files.
export default SyrupToppingButtons;