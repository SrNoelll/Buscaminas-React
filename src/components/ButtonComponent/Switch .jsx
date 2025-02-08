import React from "react";

const Switch = ({ onClick }) => {
  return (
    <label className="switch">
      <input type="checkbox" onClick={onClick} />
      <div className="button">
        <div className="light" />
        <div className="dots" />
        <div className="characters" />
        <div className="shine" />
        <div className="shadow" />
      </div>
    </label>
  );
};

export default Switch;
