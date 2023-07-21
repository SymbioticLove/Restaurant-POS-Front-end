// Import necessary libraries and hooks
import React, { useState } from 'react';
import axios from 'axios';
import './AddNewUser.css';

// AddNewUser is a functional component that renders a form for adding a new user.
// It uses state variables to manage the form inputs and an async function to handle the form submission.
const AddNewUser = () => {
  // State variables for form inputs
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userID, setUserID] = useState('');
  const [accessLevel, setAccessLevel] = useState('');
  const [payRate, setPayRate] = useState(0);

  // Function to handle the addition of a new user
  const handleAddUser = async () => {
    // Check if all fields are filled
    if (firstName === '' || lastName === '' || userID === '' || accessLevel === '') {
      alert('Please fill out all of the fields');
      return;
    }

    // Check if User ID is a 4-digit number
    if (!/^\d{4}$/.test(userID)) {
      alert('Please enter a 4-digit User ID');
      return;
    }

    try {
      // Fetch existing user data
      const response = await axios.get('http://localhost:5000/users');
      const existingUsers = response.data;

      // Check if User ID is already taken
      const isUserIDTaken = existingUsers.some(user => user.UserId === userID);
      if (isUserIDTaken) {
        alert('Employee number already in use');
        return;
      }

      // Construct new user object
      const newUser = {
        IsClockedIn: false,
        MostRecentClockIn: null,
        MostRecentClockOut: null,
        FName: firstName,
        LName: lastName,
        UserId: userID,
        AccessLevel: accessLevel,
        MinutesWorked: {},
        PayRate: payRate,
      };

      // Post new user data to the server
      await axios.post('http://localhost:5000/users', newUser);

      // Reset form fields
      setFirstName('');
      setLastName('');
      setUserID('');
      setAccessLevel('');
      setPayRate(0);

      alert('New user added successfully!');
    } catch (error) {
      // Log any errors and alert the user
      console.error('Error adding new user:', error);
      alert('Failed to add a new user. Please try again.');
    }
  };

  // Render form for adding a new user
  return (
    <div className="add-wrapper">
      <h3 className="add-user-h3">Add New User</h3>
      <div className="row-container">
        <label htmlFor="firstName">First Name:</label>
        <input
          type="text"
          id="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>
      <div className="row-container">
        <label htmlFor="lastName">Last Name:</label>
        <input
          type="text"
          id="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>
      <div className="row-container">
        <label htmlFor="userID">User ID:</label>
        <input
          type="text"
          id="userID"
          value={userID}
          onChange={(e) => setUserID(e.target.value)}
        />
      </div>
      <div className="row-container">
        <label htmlFor="payRate">Payrate:</label>
        <input
          type="number"
          id="payRate"
          step="0.01"
          value={payRate}
          onChange={(e) => setPayRate(parseFloat(e.target.value))}
        />
      </div>
      <div className="row-container">
        <label htmlFor="accessLevel" className="access-level">Access Level:</label>
        <select
          id="accessLevel"
          value={accessLevel}
          onChange={(e) => setAccessLevel(e.target.value)}
        >
          <option value="">Select Access Level</option>
          <option value="User">User</option>
          <option value="Admin">Admin</option>
        </select>
      </div>
      <button onClick={handleAddUser} className="sub-new-emp">Submit →</button>
    </div>
  );
};

// AddUserButton component renders a button to toggle the visibility of the AddNewUser component
const AddUserButton = () => {
  const [showAddUser, setShowAddUser] = useState(false);

  const toggleAddUser = () => {
    setShowAddUser(prevState => !prevState);
  };

  return (
    <div>
      <button onClick={toggleAddUser} className="add-new-user">Add User</button>
      {showAddUser && (
        <div className="button-window">
          <AddNewUser />
        </div>
      )}
    </div>
  );
};

export default AddUserButton;