import "./CheckBox.css"; // Import the CSS file

const GenderCheckbox = ({ onCheckboxChange, selectedGender }) => {
  return (
    <div className="gender-checkbox-container">
      <div className="form-control">
        <label
          className={`label ${selectedGender === "male" ? "selected" : ""}`}
        >
          <span className="label-text">Male</span>
          <input
            type="checkbox"
            className="checkbox"
            checked={selectedGender === "male"}
            onChange={() => onCheckboxChange("male")}
          />
        </label>
      </div>
      <div className="form-control">
        <label
          className={`label ${selectedGender === "female" ? "selected" : ""}`}
        >
          <span className="label-text">Female</span>
          <input
            type="checkbox"
            className="checkbox"
            checked={selectedGender === "female"}
            onChange={() => onCheckboxChange("female")}
          />
        </label>
      </div>
    </div>
  );
};

export default GenderCheckbox;
