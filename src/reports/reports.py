import json
import tkinter as tk
from tkinter import simpledialog
from tkinter import ttk
from tkcalendar import DateEntry

# Function to read JSON file
def read_json(file_path):
    """
    Read and parse data from a JSON file.

    Args:
        file_path (str): The path to the JSON file.

    Returns:
        dict: Parsed JSON data.
    """
    with open(file_path, 'r') as file:
        data = json.load(file)
    return data

def filter_data_by_date(users_data, orders_data, start_date, end_date):
    """
    Filter users and orders data based on the specified date range.

    Args:
        users_data (list): List of user data.
        orders_data (list): List of order data.
        start_date (str): Start date of the date range.
        end_date (str): End date of the date range.

    Returns:
        tuple: Filtered users data and filtered orders data.
    """
    filtered_users = []
    filtered_orders = []

    # Filter users data
    for item in users_data:
        filtered_minutes_worked = {}
        for date, minutes in item.get('MinutesWorked', {}).items():
            if start_date <= date <= end_date:
                filtered_minutes_worked[date] = minutes
        if filtered_minutes_worked:
            item_copy = item.copy()
            item_copy['MinutesWorked'] = filtered_minutes_worked
            filtered_users.append(item_copy)

    # Filter orders data
    for item in orders_data:
        item_date = item['timestamp'].split()[0]
        if start_date <= item_date <= end_date:
            filtered_orders.append(item)

    return filtered_users, filtered_orders

def calculate_labor_cost(data):
    """
    Calculate the total labor cost based on user data.

    Args:
        data (list): List of user data.

    Returns:
        float: Total labor cost.
    """
    total_pay = 0

    for item in data:
        pay_rate = item.get('PayRate', 0) / 60
        minutes_worked = sum(item.get('MinutesWorked', {}).values())
        
        if minutes_worked > 2400:
            overtime_minutes = minutes_worked - 2400
            regular_pay = 2400 * pay_rate
            overtime_pay = overtime_minutes * pay_rate * 1.5
            total_pay += regular_pay + overtime_pay
        else:
            total_pay += minutes_worked * pay_rate

    return round(total_pay, 2)

def calculate_total_sales(data):
    """
    Calculate the total sales based on order data.

    Args:
        data (list): List of order data.

    Returns:
        float: Total sales.
    """
    total_sales = 0
    for item in data:
        subtotal = float(item['subtotal'])
        discount_amount = float(item.get('discount amount', '0'))
        total_sales += subtotal - discount_amount
    return round(total_sales, 2)

def calculate_total_discounts(data):
    """
    Calculate the total discounts based on order data.

    Args:
        data (list): List of order data.

    Returns:
        tuple: Total discounts, set of discount types, and dictionary of employees associated with each discount type.
    """
    total_discounts = 0
    discount_types = set()
    employees = {}
    for item in data:
        discount_amount = float(item.get('discount amount', '0'))
        total_discounts += discount_amount
        discount_type = item.get('discount type')
        if discount_type:
            discount_types.add(discount_type)
            employee_id = item['employee']
            employee = next((user for user in users_data if user['UserId'] == employee_id), None)
            if employee:
                employee_name = f"{employee['FName']} {employee['LName']}"
                employees[discount_type] = {'EmployeeId': employee_id, 'EmployeeName': employee_name}
    return round(total_discounts, 2), discount_types, employees

def calculate_total_tax(data):
    """
    Calculate the total tax based on order data.

    Args:
        data (list): List of order data.

    Returns:
        float: Total tax.
    """
    total_tax = 0
    for item in data:
        tax = float(item['tax'])
        total_tax += tax
    return round(total_tax, 2)

def on_button_click():
    """
    Handle button click event to generate the selected report.
    """
    selected_report = report_selector.get()
    selected_start_date = start_date_entry.get_date()
    selected_end_date = end_date_entry.get_date()
    users_data = read_json('../data/users.json')
    orders_data = read_json('../data/orders.json')

    if selected_report == 'Clocked In Report':
        clocked_in_users = [f"{item['FName']} {item['LName']}" for item in users_data if item['IsClockedIn']]
        report_text.configure(state='normal')
        report_text.delete('1.0', 'end')
        report_text.insert('end', '\n'.join(clocked_in_users))
        report_text.configure(state='disabled')
    elif selected_report == 'Labor Report':
        filtered_users, filtered_orders = filter_data_by_date(users_data, orders_data, selected_start_date.strftime('%Y-%m-%d'), selected_end_date.strftime('%Y-%m-%d'))
        total_pay = calculate_labor_cost(filtered_users)
        total_sales = calculate_total_sales(filtered_orders)
        total_discounts, _, _ = calculate_total_discounts(filtered_orders)
        labor_percentage = round((total_pay / total_sales) * 100, 2)
        report_text.configure(state='normal')
        report_text.delete('1.0', 'end')
        report_text.insert('end', f"Total Labor Cost: ${total_pay:.2f}\n")
        report_text.insert('end', f"Total Sales: ${total_sales:.2f}\n")
        report_text.insert('end', f"Labor Percentage: {labor_percentage:.2f}%")
        report_text.configure(state='disabled')
    elif selected_report == 'Sales Report':
        filtered_orders = filter_data_by_date(users_data, orders_data, selected_start_date.strftime('%Y-%m-%d'), selected_end_date.strftime('%Y-%m-%d'))[1]
        total_sales = calculate_total_sales(filtered_orders)
        report_text.configure(state='normal')
        report_text.delete('1.0', 'end')
        report_text.insert('end', f"Total Sales: ${total_sales:.2f}")
        report_text.configure(state='disabled')
    elif selected_report == 'Discounts Report':
        filtered_orders = filter_data_by_date(users_data, orders_data, selected_start_date.strftime('%Y-%m-%d'), selected_end_date.strftime('%Y-%m-%d'))[1]
        total_discounts, discount_types, employees = calculate_total_discounts(filtered_orders)
        overall_discount_percentage = 0
        total_sales = calculate_total_sales(filtered_orders)
        if total_sales > 0:
            overall_discount_percentage = round(total_discounts / total_sales * 100, 2)
        report_text.configure(state='normal')
        report_text.delete('1.0', 'end')
        report_text.insert('end', f"Overall Discount Percentage: {overall_discount_percentage:.2f}%\n")
        report_text.insert('end', "Discount Types:\n")
        for discount_type in discount_types:
            employee_id = employees[discount_type]['EmployeeId']
            employee_name = employees[discount_type]['EmployeeName']
            report_text.insert('end', f"{discount_type} (Employee ID: {employee_id}, Employee Name: {employee_name})\n")
        report_text.configure(state='disabled')
    elif selected_report == 'Sales by Employee':
        employee_id = simpledialog.askstring("Employee ID", "Please enter the Employee ID:")
        if employee_id:
            filtered_orders = filter_data_by_date(users_data, orders_data, selected_start_date.strftime('%Y-%m-%d'), selected_end_date.strftime('%Y-%m-%d'))[1]
            filtered_orders = [item for item in filtered_orders if item['employee'] == employee_id]
            total_sales = sum(float(item['subtotal']) - float(item.get('discount amount', '0')) for item in filtered_orders)
            total_discounts = sum(float(item.get('discount amount', '0')) for item in filtered_orders)
            report_text.configure(state='normal')
            report_text.delete('1.0', 'end')
            report_text.insert('end', f"Total Sales by Employee ID {employee_id}: ${total_sales:.2f}\n")
            report_text.insert('end', f"Total Discounts by Employee ID {employee_id}: ${total_discounts:.2f}")
            report_text.configure(state='disabled')
    elif selected_report == 'Tax Report':
        filtered_orders = filter_data_by_date(users_data, orders_data, selected_start_date.strftime('%Y-%m-%d'), selected_end_date.strftime('%Y-%m-%d'))[1]
        total_tax = calculate_total_tax(filtered_orders)
        report_text.configure(state='normal')
        report_text.delete('1.0', 'end')
        report_text.insert('end', f"Total Tax: ${total_tax:.2f}")
        report_text.configure(state='disabled')

# Read the JSON files
users_data = read_json('../data/users.json')
orders_data = read_json('../data/orders.json')

# Create the GUI
root = tk.Tk()
root.title("Report Generator")

# Report selector
report_label = tk.Label(root, text="Select Report:")
report_label.pack()
report_selector = ttk.Combobox(root, values=[
    "Clocked In Report",
    "Labor Report",
    "Sales Report",
    "Discounts Report",
    "Sales by Employee",
    "Tax Report"
])
report_selector.pack()

# Date range selector
date_range_label = tk.Label(root, text="Select Date Range:")
date_range_label.pack()
date_range_frame = ttk.Frame(root)
date_range_frame.pack()

start_date_label = ttk.Label(date_range_frame, text="Start Date:")
start_date_label.grid(row=0, column=0)
start_date_entry = DateEntry(date_range_frame, date_pattern='dd-mm-yyyy')
start_date_entry.grid(row=0, column=1)

end_date_label = ttk.Label(date_range_frame, text="End Date:")
end_date_label.grid(row=0, column=2)
end_date_entry = DateEntry(date_range_frame, date_pattern='dd-mm-yyyy')
end_date_entry.grid(row=0, column=3)

# Generate button
generate_button = ttk.Button(root, text="Generate Report", command=on_button_click)
generate_button.pack()

# Report text box
report_text = tk.Text(root, width=60, height=10, state='disabled')
report_text.pack()

root.mainloop()
