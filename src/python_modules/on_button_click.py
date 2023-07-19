def on_button_click():
    selected_report = report_selector.get()
    selected_start_date = start_date_entry.get_date()
    selected_end_date = end_date_entry.get_date()
    users_data = read_json('./data/users.json')
    orders_data = read_json('./data/orders.json')

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