// 🇧🇩 Bangladesh-Context Smart Customization Patterns
export const customizationPatterns = {
    pizza: {
      size: {
        name: "Choose Size",
        isRequired: true,
        minSelection: 1,
        maxSelection: 1,
        choices: [
          { name: "Regular (8\")", priceChange: -1.5 },
          { name: "Medium (10\")", priceChange: 0 },
          { name: "Large (12\")", priceChange: 2.5 },
          { name: "Family (14\")", priceChange: 4.5 },
        ],
      },
      crust: {
        name: "Select Crust",
        isRequired: true,
        minSelection: 1,
        maxSelection: 1,
        choices: [
          { name: "Classic Hand Tossed", priceChange: 0 },
          { name: "Cheesy Crust", priceChange: 2.0 },
          { name: "Thin Crust", priceChange: 1.0 },
          { name: "Pan Crust", priceChange: 1.5 },
        ],
      },
      toppings: {
        name: "Add Toppings",
        isRequired: false,
        minSelection: 0,
        maxSelection: 6,
        choices: [
          { name: "Beef Sausage", priceChange: 1.5 },
          { name: "Chicken Tikka", priceChange: 1.5 },
          { name: "Mushroom", priceChange: 1.0 },
          { name: "Capsicum", priceChange: 1.0 },
          { name: "Onion", priceChange: 0.5 },
          { name: "Green Chili", priceChange: 0.5 },
          { name: "Black Olive", priceChange: 1.0 },
          { name: "Sweet Corn", priceChange: 1.0 },
          { name: "Extra Cheese", priceChange: 2.0 },
          { name: "Jalapeño", priceChange: 1.0 },
        ],
      },
      cheese: {
        name: "Extra Cheese Options",
        isRequired: false,
        minSelection: 0,
        maxSelection: 1,
        choices: [
          { name: "No Extra Cheese", priceChange: 0 },
          { name: "Extra Mozzarella", priceChange: 1.5 },
          { name: "Double Cheese Layer", priceChange: 2.5 },
        ],
      },
    },
  
    pasta: {
      portion: {
        name: "Choose Portion",
        isRequired: true,
        minSelection: 1,
        maxSelection: 1,
        choices: [
          { name: "Half Plate", priceChange: -2.0 },
          { name: "Regular Plate", priceChange: 0 },
          { name: "Full Plate", priceChange: 3.5 },
        ],
      },
      spiceLevel: {
        name: "Spice Level",
        isRequired: false,
        minSelection: 0,
        maxSelection: 1,
        choices: [
          { name: "Mild", priceChange: 0 },
          { name: "Medium", priceChange: 0 },
          { name: "Deshi Spicy 🌶️", priceChange: 0.5 },
          { name: "Extra Hot 🔥", priceChange: 1.0 },
        ],
      },
      addOns: {
        name: "Add Extras",
        isRequired: false,
        minSelection: 0,
        maxSelection: 4,
        choices: [
          { name: "Grilled Chicken", priceChange: 3.0 },
          { name: "Shrimp", priceChange: 4.0 },
          { name: "Beef Sausage", priceChange: 3.5 },
          { name: "Garlic Bread (2 pcs)", priceChange: 2.0 },
          { name: "Extra Cheese", priceChange: 1.5 },
          { name: "Egg Topping", priceChange: 1.0 },
        ],
      },
    },
  };
  