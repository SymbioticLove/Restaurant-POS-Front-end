// Importing necessary libraries and styles
import React from 'react';
import './flavorButtons.css';

// FlavorButtons is a functional component that renders buttons for different flavors.
// It takes two props: selectedFlavors and onSelectFlavor.
// selectedFlavors is an array of strings that represents the currently selected flavors.
// onSelectFlavor is a function that updates the selected flavors.
const FlavorButtons = ({ selectedFlavors, onSelectFlavor }) => {
  // Data for the available flavors
  const flavorData = [
    { name: 'French Vanilla' },
    { name: 'Dutch Chocolate' },
    { name: 'Caramel' },
    { name: 'Dark Chocolate' },
    { name: 'Hazelnut' },
  ];

  // Function to handle the selection of a flavor
  const handleFlavorSelect = (flavor) => {
    // Check if the flavor is already selected
    const isSelected = selectedFlavors.includes(flavor);
    // If it is, remove it from the selection, otherwise add it
    const updatedFlavors = isSelected
      ? selectedFlavors.filter((selectedFlavor) => selectedFlavor !== flavor)
      : [...selectedFlavors, flavor];
    // Update the selected flavors
    onSelectFlavor(updatedFlavors);
  };

  // Render flavor selection buttons
  return (
    <div className="flavor-buttons">
      <h3>Flavors</h3>
      <div className="flavor-container">
        {flavorData.map((flavor) => (
          <button
            key={flavor.name}
            // Add 'selected' class if the flavor is selected
            className={`flavor-button ${
              selectedFlavors.includes(flavor.name) ? 'selected' : ''
            }`}
            onClick={() => handleFlavorSelect(flavor.name)}
          >
            {flavor.name}
          </button>
        ))}
      </div>
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

// Exporting the component for use in other parts of the application
export default FlavorButtons;