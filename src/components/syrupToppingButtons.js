import React from 'react';
import './syrupToppingButtons.css';

const SyrupToppingButtons = ({ syrupToppings, setSyrupToppings, onAddTopping }) => {
  const toggleButton = (index) => {
    const updatedToppings = [...syrupToppings];
    updatedToppings[index].isActive = !updatedToppings[index].isActive;
    setSyrupToppings(updatedToppings);
    onAddTopping(calculateToppingsPrice(updatedToppings));
  };

  const calculateToppingsPrice = (toppings) => {
    return toppings.reduce((total, topping) => {
      return total + (topping.isActive ? topping.price : 0);
    }, 0);
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
        </button>
      ))}
    </div>
  );
};

export default SyrupToppingButtons;
