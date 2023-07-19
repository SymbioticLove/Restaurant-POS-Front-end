def calculate_total_tax(data):
    total_tax = 0
    for item in data:
        tax = float(item['tax'])
        total_tax += tax
    return round(total_tax, 2)