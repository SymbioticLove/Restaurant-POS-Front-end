import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import random


app = Flask(__name__)
CORS(app)  # Allow CORS for all routes

inventory_file_path = "./data/inventory.json"  # Path to the inventory JSON file
orders_file_path = "./data/orders.json" # Path to the orders JSON file
users_file_path = "./data/users.json"   # Path to the users JSON file

@app.route('/users', methods=['GET', 'POST'])
def handle_users():
    if request.method == 'GET':
        with open(users_file_path, 'r') as file:
            users = json.load(file)
        return jsonify(users)
    elif request.method == 'POST':
        new_user = request.json
        with open(users_file_path, 'r+') as file:
            users = json.load(file)
            for user in users:
                if user['UserId'] == new_user['UserId']:
                    user['IsClockedIn'] = new_user['IsClockedIn']
                    break
            else:
                users.append(new_user)  # Append the new user to the existing data if no matching user is found
            file.seek(0)  # Move the file pointer to the beginning
            json.dump(users, file, indent=4)
            file.truncate()  # Remove the remaining content (if any) after updating
        return jsonify(new_user), 201

@app.route('/inventory', methods=['GET', 'POST'])
def handle_inventory():
    if request.method == 'GET':
        with open(inventory_file_path, 'r') as file:
            inventory = json.load(file)
        return jsonify(inventory)
    elif request.method == 'POST':
        new_sold_logs = request.json
        
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
        
        with open(inventory_file_path, 'w') as file:
            json.dump(inventory, file, indent=4)
        
        return jsonify(new_sold_logs), 201
    
def generate_order_number():
    order_number = ''.join(random.choice('0123456789') for _ in range(12))
    return order_number

def write_order_to_file(order):
    with open(orders_file_path, 'r') as file:
        data = json.load(file)  # Load existing data from the file
        data.append(order)  # Append the new order to the data list
    
    with open(orders_file_path, 'w') as file:
        json.dump(data, file, indent=4)  # Write the updated data back to the file

@app.route('/pay', methods=['POST'])
def handle_payment():
    order_data = request.json
    subtotal = order_data['subtotal']
    tax = order_data['tax']
    order_number = generate_order_number()

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
            'discounted total': f"{float(subtotal) - float(discount_amount) + float(tax):.3f}",
            'discount type': discount_type,
            'order number': order_number,
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
    else:
        total = float(subtotal) + float(tax)
        # Create the order dictionary for non-discounted orders
        order = {
            'discount': discount,
            'subtotal': subtotal,
            'tax': tax,
            'total': f"{total:.3f}",
            'orderNumber': order_number,
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }

    # Save the order to the orders file
    write_order_to_file(order)

    # Simulated payment alert
    alert_message = {
        'message': "Please present payment",
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
    app.run(debug=True)