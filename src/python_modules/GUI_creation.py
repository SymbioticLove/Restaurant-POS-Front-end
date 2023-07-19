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