// Importing necessary libraries and styles
import React from 'react';
import '../App.css'

// LoginContainer is a functional component that renders a login interface.
// It takes five props: loginNumber, handleNumberPadClick, handleEnterButtonClick, handleClearButtonClick, and handleClockInOut.
// loginNumber is a string that represents the currently entered login number.
// handleNumberPadClick is a function that handles the clicking of a number pad button.
// handleEnterButtonClick is a function that handles the clicking of the Enter button.
// handleClearButtonClick is a function that handles the clicking of the Clear button.
// handleClockInOut is a function that handles the clicking of the Clock In/Out button.
const LoginContainer = ({
  loginNumber,
  handleNumberPadClick,
  handleEnterButtonClick,
  handleClearButtonClick,
  handleClockInOut
}) => {
  // The component renders a login interface that includes a display for the login number, a number pad, and a Clock In/Out button.
  // Each button has an onClick handler that calls the corresponding prop function.
  return (
    <div className="login-container">
      <h2 className="h2">Please Enter Your Employee Number</h2>
      <div className="login-window">{loginNumber}</div>
      <div className="number-pad">
        <div className="num-button-container">
          {/* Render the number pad buttons for 1-9 */}
          {[[1, 2, 3], [4, 5, 6], [7, 8, 9]].map((row, rowIndex) => (
            <div className="num-row" key={rowIndex}>
              {row.map((number) => (
                <button className="num-buttons" key={number} onClick={() => handleNumberPadClick(number)}>
                  {number}
                </button>
              ))}
            </div>
          ))}
          {/* Render the Enter, 0, and Clear buttons */}
          <div className="num-row">
            <button className="num-buttons" onClick={handleEnterButtonClick}>Enter</button>
            <button className="num-buttons" onClick={() => handleNumberPadClick(0)}>0</button>
            <button className="num-buttons" onClick={handleClearButtonClick}>Clear</button>
          </div>
        </div>
        {/* Render the Clock In/Out button */}
        <div className="buttons-container">
          <button className="lower-button" onClick={handleClockInOut}>Clock In/Out</button>
        </div>
      </div>
    </div>
  );
};

// Exporting the LoginContainer component for use in other files.
export default LoginContainer;