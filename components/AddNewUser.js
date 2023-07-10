import React, { useState } from 'react';
import axios from 'axios';

const AddNewUser = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userID, setUserID] = useState('');
  const [accessLevel, setAccessLevel] = useState('');

  const handleAddUser = async () => {
    const newUser = {
      FName: firstName,
      LName: lastName,
      UserId: userID,
      AccessLevel: accessLevel,
    };

    try {
      await axios.post('http://localhost:5000/users', newUser); // Specify the base URL here
      setFirstName('');
      setLastName('');
      setUserID('');
      setAccessLevel('');
      alert('New user added successfully!');
    } catch (error) {
      console.error('Error adding new user:', error);
      alert('Failed to add new user. Please try again.');
    }
  };

  return (
    <div>
      <h3>Add New Users (local server (server.py) must be running on port 5000)</h3>
      <div>
        <label htmlFor="firstName">First Name:</label>
        <input
          type="text"
          id="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="lastName">Last Name:</label>
        <input
          type="text"
          id="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="userID">User ID:</label>
        <input
          type="text"
          id="userID"
          value={userID}
          onChange={(e) => setUserID(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="accessLevel">Access Level:</label>
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
      <button onClick={handleAddUser}>Submit</button>
    </div>
  );
};

export default AddNewUser;