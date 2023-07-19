import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, date
import random
from apscheduler.schedulers.background import BackgroundScheduler


app = Flask(__name__)
CORS(app)

inventory_file_path = "../data/inventory.json"  # Path to the inventory JSON file
orders_file_path = "../data/orders.json" # Path to the orders JSON file
users_file_path = "../data/users.json"   # Path to the users JSON file

# Create a scheduler instance
scheduler = BackgroundScheduler()

def increment_minutes_worked():
    """
    Increment the minutes worked for each user who is currently clocked in.
    This function is scheduled to run every minute by the scheduler.
    """
    current_date = date.today().strftime('%Y-%m-%d')
    current_time = datetime.now().strftime('%H:%M:%S')
    
    # Open the users file for reading and writing
    with open(users_file_path, 'r+') as file:
        users = json.load(file)
        
        # Iterate over each user in the file
        for user in users:
            if user['IsClockedIn']:
                # Check if the current date is already present in the user's minutes worked
                if current_date not in user['MinutesWorked']:
                    user['MinutesWorked'][current_date] = 0
                user['MinutesWorked'][current_date] += 1
                user['LastUpdate'] = current_time
        
        # Write the updated user data back to the file
        file.seek(0)
        json.dump(users, file, indent=4)
        file.truncate()

# Schedule the function to run every minute
scheduler.add_job(increment_minutes_worked, 'interval', minutes=1)

@app.route('/users', methods=['GET', 'POST'])
def handle_users():
    """
    Handle GET and POST requests for the '/users' endpoint.
    """
    users_file_path = '../data/users.json'

    if request.method == 'GET':
        # Open the users file for reading
        with open(users_file_path, 'r') as file:
            users = json.load(file)
        return jsonify(users)
    elif request.method == 'POST':
        updated_user = request.json
        # Open the users file for reading and writing
        with open(users_file_path, 'r+') as file:
            users = json.load(file)
            found_user = False
            # Iterate over each user in the file
            for user in users:
                if user['UserId'] == updated_user['UserId']:
                    user.update(updated_user)
                    found_user = True
                    break
            if not found_user:
                users.append(updated_user)
            # Write the updated user data back to the file
            file.seek(0)
            json.dump(users, file, indent=4)
            file.truncate()
        return jsonify(updated_user), 200

@app.route('/inventory', methods=['GET', 'POST'])
def handle_inventory():
    """
    Handle GET and POST requests for the '/inventory' endpoint.
    """
    if request.method == 'GET':
        # Open the inventory file for reading
        with open(inventory_file_path, 'r') as file:
            inventory = json.load(file)
        return jsonify(inventory)
    elif request.method == 'POST':
        new_sold_logs = request.json
        
        # Open the inventory file for reading
        with open(inventory_file_path, 'r') as file:
            inventory = json.load(file)
        
        # Update the inventory with the new sold logs
        if not isinstance(inventory, dict):
            inventory = {}  # Initialize as an empty dictionary
        
        current_date = datetime.now().strftime('%Y-%m-%d')  # Get the current date
        
        for item in new_sold_logs:
            item_name = item['name']
            item_count = item['soldCount']
            
            # Check if the item exists for the current date
            if current_date in inventory and item_name in inventory[current_date]:
                inventory[current_date][item_name]['soldCount'] += item_count
            else:
                if current_date not in inventory:
                    inventory[current_date] = {}
                inventory[current_date][item_name] = {'soldCount': item_count}
        
        # Write the updated inventory back to the file
        with open(inventory_file_path, 'w') as file:
            json.dump(inventory, file, indent=4)
        
        return jsonify(new_sold_logs), 201
    
def generate_order_number(data):
    """
    Generate a unique order number for a new order.
    """
    while True:
        order_number = ''.join(random.choice('0123456789') for _ in range(12))
        # Check if the order number already exists in the data list
        if not any(order_number == order.get('orderNumber') for order in data):
            return order_number

def write_order_to_file(order):
    """
    Write the order to the orders file.
    """
    with open(orders_file_path, 'r') as file:
        data = json.load(file)  # Load existing data from the file
        data.append(order)  # Append the new order to the data list
    
    # Write the updated data back to the file
    with open(orders_file_path, 'w') as file:
        json.dump(data, file, indent=4)

@app.route('/pay', methods=['POST'])
def handle_payment():
    """
    Handle POST requests for the '/pay' endpoint.
    """
    order_data = request.json
    subtotal = order_data['subtotal']
    tax = order_data['tax']
    employee = order_data.get('employee')  # Retrieve the employee value if present
    
    if float(subtotal) == 0:
        return jsonify({'message': 'The Subtotal is 0'}), 400, {'Content-Type': 'application/json'}

    # Open the orders file for reading
    with open(orders_file_path, 'r') as file:
        data = json.load(file)
    
    order_number = generate_order_number(data)

    discount = order_data.get('discount')
    discount_amount = 0
    discount_type = 'None'

    if discount:
        total = float(subtotal) + float(tax) - float(order_data['discountAmount'])
        discount_amount = order_data['discountAmount']
        discount_type = order_data['discountType']
        # Create the order dictionary for discounted orders
        order = {
            'discount': discount,
            'subtotal': subtotal,
            'discount amount': discount_amount,
            'tax': tax,
            'discount type': discount_type,
            'orderNumber': order_number,
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'employee': employee,
        }
    else:
        total = float(subtotal) + float(tax)
        # Create the order dictionary for non-discounted orders
        order = {
            'discount': discount,
            'subtotal': subtotal,
            'tax': tax,
            'total': f"{total:.2f}",
            'orderNumber': order_number,
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'employee': employee,
        }

    # Save the order to the orders file
    write_order_to_file(order)

    # Simulated payment alert
    alert_message = {
        'message': "Please Present payment",
        'orderNumber': order_number,
        'subtotal': subtotal,
        'tax': tax
    }

    if discount:
        alert_message['discountedTotal'] = total
        alert_message['discountAmount'] = discount_amount
        alert_message['discountType'] = discount_type
    else:
        alert_message['total'] = total

    return jsonify([alert_message]), 200, {'Content-Type': 'application/json'}

if __name__ == '__main__':
    # Start the scheduler
    scheduler.start()
    app.run()