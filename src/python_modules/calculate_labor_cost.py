def calculate_labor_cost(data):
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