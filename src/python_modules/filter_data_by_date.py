def filter_data_by_date(users_data, orders_data, start_date, end_date):
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