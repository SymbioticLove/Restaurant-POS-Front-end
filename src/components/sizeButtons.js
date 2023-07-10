import React from 'react';
import './sizeButtons.css'

const SizeButtons = ({ selectedSize, onSelectSize }) => {
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

  const handleSizeSelect = (size) => {
    if (selectedSize === size) {
      // If the clicked size is already selected, deselect it
      onSelectSize(null);
    } else {
      onSelectSize(size);
    }
  };

  return (
    <div className="size-buttons">
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
  );
};

export default SizeButtons;