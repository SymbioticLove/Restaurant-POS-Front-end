// Importing necessary libraries and styles
import React from 'react';
import './discountButtons.css'

// DiscountButtons is a functional component that renders buttons for different discounts.
// It takes three props: selectedDiscount, onSelectDiscount, and discounts.
// selectedDiscount is a string that represents the currently selected discount.
// onSelectDiscount is a function that updates the selected discount.
// discounts is an array of objects where each object represents a discount.
const DiscountButtons = ({ selectedDiscount, onSelectDiscount, discounts }) => {
  // Function to handle the selection of a discount
  const handleDiscountSelect = (discountName) => {
    if (selectedDiscount === discountName) {
      // If the clicked discount is already selected, deselect it
      onSelectDiscount(null);
    } else {
      // Otherwise, select the clicked discount
      onSelectDiscount(discountName);
    }
  };

  // Render discount buttons
  return (
    <div className="discount-buttons">
      <h3>Discounts</h3>
      {discounts.map((discount) => (
        <button
          key={discount.name}
          // Add 'selected' class if the discount is selected
          className={`discount-button ${selectedDiscount === discount.name ? 'selected' : ''}`}
          onClick={() => handleDiscountSelect(discount.name)}
        >
          {discount.name}
          {/* Show a checkmark if the discount is selected */}
          {selectedDiscount === discount.name && <span className="checkmark">&#10003;</span>}
        </button>
      ))}
    </div>
  );
};

// Exporting the component for use in other parts of the application
export default DiscountButtons;