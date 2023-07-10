import React from 'react';

const DiscountButtons = ({ selectedDiscount, onSelectDiscount, discounts }) => {
  const handleDiscountSelect = (discountName) => {
    if (selectedDiscount === discountName) {
      // If the clicked discount is already selected, deselect it
      onSelectDiscount(null);
    } else {
      onSelectDiscount(discountName);
    }
  };

  return (
    <div className="discount-buttons">
      <h3>Discounts</h3>
      {discounts.map((discount) => (
        <button
          key={discount.name}
          className={`discount-button ${selectedDiscount === discount.name ? 'selected' : ''}`}
          onClick={() => handleDiscountSelect(discount.name)}
        >
          {discount.name}
          {selectedDiscount === discount.name && <span className="checkmark">&#10003;</span>}
        </button>
      ))}
    </div>
  );
};

export default DiscountButtons;