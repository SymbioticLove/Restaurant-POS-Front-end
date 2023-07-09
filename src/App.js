import React, { useState } from 'react';
import SizeButtons from './components/sizeButtons';
import FlavorButtons from './components/flavorButtons';
import SyrupToppingButtons from './components/syrupToppingButtons';

const App = () => {
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedFlavors, setSelectedFlavors] = useState([]);
  const [toppingsPrice, setToppingsPrice] = useState(0);
  const [syrupToppings, setSyrupToppings] = useState([
    { name: 'Sweet Cold Foam', price: 0.99, isActive: false, soldCount: 0 },
    { name: 'Caramel Drizzle', price: 0.79, isActive: false, soldCount: 0 },
    { name: 'Whipped Cream', price: 0.49, isActive: false, soldCount: 0 },
    { name: 'Chocolate Shavings', price: 0.69, isActive: false, soldCount: 0 },
    { name: 'Cinnamon Powder', price: 0.59, isActive: false, soldCount: 0 },
    { name: 'Vanilla Syrup', price: 0.89, isActive: false, soldCount: 0 },
    { name: 'Hazelnut Syrup', price: 1.29, isActive: false, soldCount: 0 },
    { name: 'Caramel Syrup', price: 1.19, isActive: false, soldCount: 0 },
    { name: 'Mocha Syrup', price: 1.39, isActive: false, soldCount: 0 },
    { name: 'Toffee Nut Syrup', price: 1.49, isActive: false, soldCount: 0 },
    { name: 'Peppermint Syrup', price: 1.59, isActive: false, soldCount: 0 },
    { name: 'Coconut Milk', price: 0.99, isActive: false, soldCount: 0 },
    { name: 'Almond Milk', price: 0.99, isActive: false, soldCount: 0 },
    { name: 'Oat Milk', price: 0.99, isActive: false, soldCount: 0 },
    { name: 'Soy Milk', price: 0.99, isActive: false, soldCount: 0 },
    { name: 'Caramel Sauce', price: 1.09, isActive: false, soldCount: 0 },
    { name: 'Chocolate Sauce', price: 1.09, isActive: false, soldCount: 0 },
    { name: 'Caramel Whipped Cream', price: 1.29, isActive: false, soldCount: 0 },
    { name: 'Chocolate Whipped Cream', price: 1.29, isActive: false, soldCount: 0 },
    { name: 'Vanilla Whipped Cream', price: 1.29, isActive: false, soldCount: 0 },
  ]);

  const handlePayNow = () => {
    const sizePrice = selectedSize ? getSizePrice(selectedSize) : 0;
    const flavorPrice = selectedFlavors.length * 0.89;
    const total = sizePrice + flavorPrice + toppingsPrice;
  
    // TODO: Send total to Payment API and handle payment request form
  
    console.log(`Total: $${total.toFixed(2)}`);
  
    // Reset selections
    setSelectedSize(null);
    setSelectedFlavors([]);
    setToppingsPrice(0);
  
    // Update syrup toppings and print changed items with their sold counts
    const updatedToppings = syrupToppings.map((topping) => {
      const updatedTopping = { ...topping };
      if (updatedTopping.isActive) {
        updatedTopping.soldCount += 1; // Increment soldCount if isActive is true
      }
      updatedTopping.isActive = false; // Reset isActive for each topping
      if (updatedTopping.soldCount !== topping.soldCount) {
        console.log(`Item: ${updatedTopping.name}`);
        console.log(`Sold Count: ${updatedTopping.soldCount}`);
      }
      return updatedTopping;
    });
  
    setSyrupToppings(updatedToppings); // Update the syrupToppings state with the updated toppings
  };   

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

  const handleAddTopping = (price) => {
    setToppingsPrice(price);
  };

  return (
    <div className="pos-container">
      <SizeButtons selectedSize={selectedSize} onSelectSize={setSelectedSize} />
      <FlavorButtons
        selectedFlavors={selectedFlavors}
        onSelectFlavor={setSelectedFlavors}
      />
      <SyrupToppingButtons
        syrupToppings={syrupToppings}
        setSyrupToppings={setSyrupToppings}
        onAddTopping={handleAddTopping}
      />
      <div className="running-total">
        Total: ${(getSizePrice(selectedSize) + selectedFlavors.length * 0.89 + toppingsPrice).toFixed(2)}
      </div>
      <button className="pay-now-button" onClick={handlePayNow}>
        Pay Now
      </button>
    </div>
  );
};

export default App;