def calculate_total_discounts(data):
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
