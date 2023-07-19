// Importing necessary libraries and styles
import React from 'react';
import './sizeButtons.css'

// SizeButtons is a functional component that renders buttons for different sizes.
// It takes two props: selectedSize and onSelectSize.
// selectedSize is a string that represents the currently selected size.
// onSelectSize is a function that updates the selected size.
const SizeButtons = ({ selectedSize, onSelectSize }) => {
  // getSizePrice is a helper function that returns the price based on the size.
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

  // handleSizeSelect is a function that handles the selection and deselection of sizes.
  // If the clicked size is already selected, it deselects it. Otherwise, it selects the clicked size.
  const handleSizeSelect = (size) => {
    if (selectedSize === size) {
      onSelectSize(null);
    } else {
      onSelectSize(size);
    }
  };

  // The component renders a list of buttons for each size.
  // Each button displays the size and its price.
  // The selected size button is highlighted.
  return (
    <div className="size-buttons">
      <h3>Sizes</h3>
      <div className="butt-container">
        <button
          className={`size-button ${selectedSize === 'Small' ? 'selected' : ''}`}
          onClick={() => handleSizeSelect('Small')}
        >
          Small (${getSizePrice('Small').toFixed(2)})
        </button>
        <button
          className={`size-button ${selectedSize === 'Medium' ? 'selected' : ''}`}
          onClick={() => handleSizeSelect('Medium')}
        >
          Medium (${getSizePrice('Medium').toFixed(2)})
        </button>
        <button
          className={`size-button ${selectedSize === 'Large' ? 'selected' : ''}`}
          onClick={() => handleSizeSelect('Large')}
        >
          Large (${getSizePrice('Large').toFixed(2)})
        </button>
        {selectedSize && (
          <div className="selected-size">Size: {selectedSize}</div>
        )}
      </div>
    </div>
  );
};

// Exporting the SizeButtons component for use in other files.
export default SizeButtons;