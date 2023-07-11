const handlePayNow = async () => {
    if (!selectedSize) {
      console.log("Select a Size!"); // Make User Select Size
      return;
    }
  
    let name = prompt("Enter customer name:"); // Prompt for customer name
  
    while (!name) {
      name = prompt("Enter customer name:"); // Re-prompt for customer name
    }
  
    setCustomerName(name); // Set the customer name
  
    let sizePrice = getSizePrice(selectedSize);
    let flavorPrice = selectedFlavors.length * 0.89;
    let addInsPrice = toppingsPrice;
    let total = sizePrice + flavorPrice + addInsPrice;
  
    // Apply discount if selected
    let originalTotal = total;
    let discountAmount = 0;
    let discountType = "None"; // Default value for discount type
    if (selectedDiscount) {
      const discount = discounts.find((discount) => discount.name === selectedDiscount);
      if (discount) {
        const discountMultiplier = 1 - discount.discount;
        const discountedSizePrice = sizePrice * discountMultiplier;
        const discountedFlavorPrice = flavorPrice * discountMultiplier;
        const discountedAddInsPrice = addInsPrice * discountMultiplier;
        discountAmount = originalTotal - (discountedSizePrice + discountedFlavorPrice + discountedAddInsPrice);
        total = discountedSizePrice + discountedFlavorPrice + discountedAddInsPrice;
        discountType = discount.name; // Store the discount type
      }
    }
  
    // Reset selections
    setSelectedSize(null);
    setSelectedFlavors([]);
    setToppingsPrice(0);
    setSelectedDiscount(null); // Deselect the currently selected discount
  
    console.log('');
    console.log('');
    console.log(`Size: ${selectedSize ? selectedSize.charAt(0).toUpperCase() + selectedSize.slice(1) : null}`);
  
    let flavorsText = selectedFlavors.length > 0 ? selectedFlavors.join(", ") : "None";
    console.log(`Flavors: ${flavorsText}`);
  
    // Accumulate selected add-ins and their sold counts
    const nonCustomAddIns = syrupToppings.filter((topping) => topping.isActive && !topping.custom);
    const selectedAddIns = nonCustomAddIns.map((topping) => topping.name);
    const nonCustomAddInCounts = nonCustomAddIns.map((topping) => topping.soldCount + 1);
  
    if (selectedAddIns.length > 0) {
      console.log(`Add-ins: ${selectedAddIns.join(", ")}`);
    } else {
      console.log("Add-ins: None");
    }
  
    // Calculate tax
    const tax = (originalTotal * 0.056).toFixed(2);
  
    // Calculate total with tax
    const totalWithTax = (parseFloat(originalTotal) + parseFloat(tax)).toFixed(2);
  
    console.log('');
    console.log(`Subtotal: $${originalTotal.toFixed(2)}`);
    console.log(`Tax: $${tax}`);
  
    if (selectedDiscount) {
      const discountedTotalWithTax = (parseFloat(total) + parseFloat(tax)).toFixed(2);
  
      console.log(`Discounted Total: $${discountedTotalWithTax}`);
      console.log('');
      console.log(`Total Discount: $${discountAmount.toFixed(2)}`);
      console.log(`Discount Type: ${discountType}`);
      console.log('');
    } else {
      console.log(`Total: $${totalWithTax}`);
      console.log('');
    }
  
    nonCustomAddIns.forEach((addIn, index) => {
      const addInCount = nonCustomAddInCounts[index];
      console.log(`Total ${addIn.name} sold: ${addInCount}`);
    });
  
    // Update syrup toppings
    const updatedToppings = syrupToppings.map((topping) => {
      const updatedTopping = { ...topping };
      if (updatedTopping.isActive) {
        updatedTopping.soldCount += 1;
      }
      updatedTopping.isActive = false;
      return updatedTopping;
    });
  
    setSyrupToppings(updatedToppings);
  
    const soldLogs = syrupToppings
      .filter((topping) => topping.isActive && !topping.custom)
      .map((topping) => {
        return {
          name: topping.name,
          price: topping.price,
          isActive: topping.isActive,
          soldCount: topping.soldCount + 1
        };
      });
  
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(soldLogs)
    };
  
    try {
      const response = await fetch('http://localhost:5000/inventory', requestOptions);
      if (response.ok) {
        // Sold logs successfully updated in the inventory
        console.log('Sold logs updated in the inventory.');
      } else {
        console.error('Failed to update sold logs in the inventory.');
      }
    } catch (error) {
      console.error('Error occurred while updating sold logs in the inventory:', error);
    }
  };