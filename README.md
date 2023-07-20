# Fully Modular and Customizable POS System

## Description
This program is a highly modular and customizable demo MVP of a new, better POS system. It is designed to handle every need of a small restaurant or retailer, from inventory to employee data, payroll and ordering, reporting, and more.

The POS system is created by an individual with 14 years of experience in the restaurant industry, with 10 of those in management. It is designed to be highly secure, running entirely on a local server. The data is stored in JSON files and accessed through a Python API built with Flask. The API is the only way in which the data can be written or modified.

## Features
- Modular and customizable design
- Handles inventory management
- Employee data and payroll management
- Ordering and reporting capabilities
- Secure and local server-based system

## Installation
1. Clone the repository or download the source code files.
2. Navigate to the downloaded directory
3. Install the required dependencies for the frontend by running the command: `npm install`.
4. (optional but recommended) Create a new virtual enviroment by running the command `python -m venv env` where 'env' is the name of your environment
5. (if you did step 4) Activate the virtual environment with the command `\'env'\Scripts\activate`
6. Install the required dependencies for the backend by running the command: `pip install Flask Flask-CORS APScheduler`.
7. Start the frontend application by running the command: `npm start`.
8. Start the backend server by running the command: `python server.py`.

## Frontend Dependencies
- React
- axios

## Backend Dependencies
- Flask
- Flask-CORS
- APScheduler

## Usage
1. Open the frontend application in a web browser.
2. Log in using a valid user ID.
3. Select the desired size, flavors, and toppings for the order.
4. Add the item to the order list.
5. Repeat steps 3-4 to add more items to the order.
6. Apply any available discounts to the order.
7. Review the order details and subtotal.
8. Click on the "Pay Now" button to proceed with the payment process.
9. Enter the customer name and complete the payment.
10. Receive a confirmation message with the total amount paid.

## API Endpoints
- POST `/users`: Updates user data, including clock-in and clock-out times.
- POST `/inventory`: Updates the inventory with sold items.
- POST `/pay`: Handles the payment process and saves the order details.

## Data Storage
Data is stored in JSON files located in the `data` directory. The current files include:
- `orders.json`: Stores information about the orders.
- `users.json`: Stores employee data and clock-in/out times.
- `inventory.json`: Stores inventory information.

## Planned Enhancements
- Implement a complete inventory program for comprehensive inventory management.
- Add scripts for data backup and archiving.
- Improve data categorization and storage using weekly/monthly/annual directories.

## Credits
This POS system was developed by Matthew Ford, an individual with 14 years of experience in the service industry, with 10 of these in management. This system is created to be highly informative and is well-informed
in its creation.

