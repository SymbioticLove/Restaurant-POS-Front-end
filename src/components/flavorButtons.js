import React from 'react';
import './flavorButtons.css';

const FlavorButtons = ({ selectedFlavors, onSelectFlavor }) => {
  const flavorData = [
    { name: 'French Vanilla' },
    { name: 'Dutch Chocolate' },
    { name: 'Caramel' },
    { name: 'Dark Chocolate' },
    { name: 'Hazelnut' },
  ];

  const handleFlavorSelect = (flavor) => {
    const isSelected = selectedFlavors.includes(flavor);
    const updatedFlavors = isSelected
      ? selectedFlavors.filter((selectedFlavor) => selectedFlavor !== flavor)
      : [...selectedFlavors, flavor];
    onSelectFlavor(updatedFlavors);
  };

  return (
    <div className="flavor-buttons">
      <h3>Flavors</h3>
      {flavorData.map((flavor) => (
        <button
          key={flavor.name}
          className={`flavor-button ${
            selectedFlavors.includes(flavor.name) ? 'selected' : ''
          }`}
          onClick={() => handleFlavorSelect(flavor.name)}
        >
          {flavor.name}
        </button>
      ))}
      {selectedFlavors.length > 0 && (
        <div className="selected-flavors">
          <p>Selected Flavors:</p>
          <ul>
            {selectedFlavors.map((flavor) => (
              <li key={flavor}>{flavor}</li>
            ))}
          </ul>
        </div>
      )}
      {selectedFlavors.length > 0 && (
        <div className="flavor-price">
          Flavor Price: $0.89 ea.
        </div>
      )}
    </div>
  );
};

export default FlavorButtons;