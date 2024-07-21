import React, { useState } from "react";
import "../modelWindow/Modelwindow.css";
import minus from "../assets/minus.png";
const schemaOptions = [
  { label: "First Name", value: "first_name", iconColor: "#5DDB78" },
  { label: "Last Name", value: "last_name", iconColor: "#5DDB78" },
  { label: "Gender", value: "gender", iconColor: "#5DDB78" },
  { label: "Age", value: "age", iconColor: "#5DDB78" },
  { label: "Account Name", value: "account_name", iconColor: "red" },
  { label: "City", value: "city", iconColor: "red" },
  { label: "State", value: "state", iconColor: "red" },
];

const Modalwindow = ({ closePopup }) => {
  const [segmentName, setSegmentName] = useState("");
  const [selectedSchemas, setSelectedSchemas] = useState([]);
  const [newSchema, setNewSchema] = useState("");
  const [isInnerPopupVisible, setIsInnerPopupVisible] = useState(false);

  const handleAddSchema = () => {
    if (newSchema && !selectedSchemas.includes(newSchema)) {
      setSelectedSchemas([...selectedSchemas, newSchema]);
      setNewSchema("");
    }
  };

  const handleSaveSegment = async () => {
    const segmentData = {
      segment_name: segmentName,
      schema: selectedSchemas.map((schema) => ({
        [schema]: schemaOptions.find((opt) => opt.value === schema).label,
      })),
    };

    console.log("Segment Data:", segmentData);

    try {
      const response = await fetch(
        "https://webhook.site/f9f26ac6-75f3-49bc-919a-c8da1a5405df",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(segmentData),
          mode: "no-cors",
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }

      const responseData = await response.json();
      console.log("Response Data:", responseData);
    } catch (error) {
      console.error("Error sending segment data:", error);
    }
  };

  const availableOptions = schemaOptions.filter(
    (option) => !selectedSchemas.includes(option.value)
  );

  return (
    <div className="popup">
      <button className="savebtn" onClick={() => setIsInnerPopupVisible(true)}>
        Save segment
      </button>
      {isInnerPopupVisible && (
        <div className="popup-inner" style={{ display: "block" }}>
          <h2>
            {" "}
            <svg
              className="arrow-svg"
              fill="currentColor"
              stroke-width="0"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              height="1em"
              width="1em"
              style={{ overflow: "visible", color: "currentcolor" }}
            >
              <path
                fill="currentColor"
                d="m11.828 12 2.829 2.829-1.414 1.414L9 12.001l4.243-4.243 1.414 1.414-2.829 2.829Z"
              ></path>
            </svg>
            Saving Segment
          </h2>
          <label className="enter">Enter the Name of the Segment</label>
          <input
            className="name-input"
            type="text"
            value={segmentName}
            onChange={(e) => setSegmentName(e.target.value)}
            placeholder="Name of the segment"
          />
          <p>
            To save your segment, you need to add the schemas to build the query
          </p>
          <div className="traits">
            <div>
              <svg width="12px" height="12px" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="50" fill="#5DDB78" />
              </svg>
              - user traits
            </div>
            <div>
              <svg width="12px" height="12px" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="50" fill="red" />
              </svg>
              - group traits
            </div>
          </div>

          <div className="schema-container">
            {selectedSchemas.map((schema, index) => {
              const schemaOption = schemaOptions.find(
                (opt) => opt.value === schema
              );
              return (
                <div key={index} className="schema-item">
                  <svg width="12px" height="12px" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="50"
                      fill={schemaOption.iconColor}
                    />
                  </svg>
                  <select
                    value={schema}
                    onChange={(e) => {
                      const updatedSchemas = [...selectedSchemas];
                      updatedSchemas[index] = e.target.value;
                      setSelectedSchemas(updatedSchemas);
                    }}
                  >
                    <option value="">Select a schema</option>
                    {schemaOptions
                      .filter(
                        (opt) =>
                          !selectedSchemas.includes(opt.value) ||
                          opt.value === schema
                      )
                      .map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                  </select>
                  <button
                    onClick={() => {
                      const updatedSchemas = selectedSchemas.filter(
                        (_, i) => i !== index
                      );
                      setSelectedSchemas(updatedSchemas);
                    }}
                  >
                    <img src={minus} alt="" />
                  </button>
                </div>
              );
            })}
          </div>
          <select
            className="schema-select"
            value={newSchema}
            onChange={(e) => setNewSchema(e.target.value)}
          >
            <option value="">Add schema to segment</option>
            {availableOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <a className="schema-btn" onClick={handleAddSchema}>
            + Add new schema
          </a>
          <div className="save-cancel">
            <button onClick={handleSaveSegment} className="save-button">
              Save the Segment
            </button>
            <button
              onClick={() => {
                closePopup();
                setIsInnerPopupVisible(false);
              }}
              className="cancel-button"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Modalwindow;
