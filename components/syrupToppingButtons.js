import React, { useState } from 'react';
import './syrupToppingButtons.css';

const SyrupToppingButtons = ({ syrupToppings, setSyrupToppings, onAddTopping }) => {
  const [newButtonName, setNewButtonName] = useState('');
  const [newButtonPrice, setNewButtonPrice] = useState(0);
  const [customButtonTotal, setCustomButtonTotal] = useState(0);

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

  return (
    <div className="syrup-topping-buttons">
      {syrupToppings.map((syrupTopping, index) => (
        <button
          key={index}
          className={`syrup-topping-button ${syrupTopping.isActive ? 'active' : ''}`}
          onClick={() => toggleButton(index)}
        >
          {syrupTopping.name} (${syrupTopping.price.toFixed(2)})
          {syrupTopping.isActive && <span className="checkmark">&#10003;</span>}
          {syrupTopping.custom && <span className="custom-indicator">(Custom)</span>}
        </button>
      ))}
      <div className="new-button">
        <h3>Create New Button</h3>
        <input
          type="text"
          placeholder="Item Name"
          value={newButtonName}
          onChange={(e) => setNewButtonName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Price"
          value={newButtonPrice}
          onChange={(e) => setNewButtonPrice(parseFloat(e.target.value))}
        />
        <button onClick={handleOpenButton}>Create Button</button>
      </div>
      <div className="custom-button-total">
        Total from Custom Buttons: ${customButtonTotal.toFixed(2)}
      </div>
    </div>
  );
};

export default SyrupToppingButtons;
