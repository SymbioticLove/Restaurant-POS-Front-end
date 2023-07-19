def calculate_total_sales(data):
    total_sales = 0
    for item in data:
        subtotal = float(item['subtotal'])
        discount_amount = float(item.get('discount amount', '0'))
        total_sales += subtotal - discount_amount
    return round(total_sales, 2)