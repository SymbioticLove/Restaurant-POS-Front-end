import React from 'react';
import './sizeButtons.css'

const SizeButtons = ({ selectedSize, onSelectSize }) => {
  const getSizePrice = (size) => {
    switch (size) {
      case 'small':
        return 2.49;
      case 'medium':
        return 3.29;
      case 'large':
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
        className={`size-button ${selectedSize === 'small' ? 'selected' : ''}`}
        onClick={() => handleSizeSelect('small')}
      >
        Small (${getSizePrice('small').toFixed(2)})
      </button>
      <button
        className={`size-button ${selectedSize === 'medium' ? 'selected' : ''}`}
        onClick={() => handleSizeSelect('medium')}
      >
        Medium (${getSizePrice('medium').toFixed(2)})
      </button>
      <button
        className={`size-button ${selectedSize === 'large' ? 'selected' : ''}`}
        onClick={() => handleSizeSelect('large')}
      >
        Large (${getSizePrice('large').toFixed(2)})
      </button>
    </div>
  );
};

export default SizeButtons;
