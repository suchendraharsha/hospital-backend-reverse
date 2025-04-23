import React, { useState } from "react";
import "./PredictionForm.css";

const ageOptions = [
  "[0-10)",
  "[10-20)",
  "[20-30)",
  "[30-40)",
  "[40-50)",
  "[50-60)",
  "[60-70)",
  "[70-80)",
  "[80-90)",
  "[90-100)",
];
const maxGluSerumOptions = ["None", "Normal", ">200", ">300"];
const a1cResultOptions = ["None", "Normal", ">7", ">8"];
const raceOptions = [
  "Caucasian",
  "Asian",
  "AfricanAmerican",
  "Hispanic",
  "Other",
];
const genderOptions = ["Female", "Male", "Unknown/Invalid"];
const admissionTypeOptions = [
  "Emergency",
  "Elective",
  "Newborn",
  "Not Available",
  "Trauma Center",
];
const dischargeDispositionOptions = [
  "Discharged to home",
  "Other",
  "Not Available",
];
const admissionSourceOptions = ["Referral", "Other", "Not Available"];
const diagOptions1 = [
  "Diabetes",
  "Other",
  "Neoplasms",
  "Circulatory",
  "Respiratory",
  "Injury",
  "Muscoloskeletal",
  "Digestive",
  "Genitourinary",
];
const diagOptions2 = [
  "Other",
  "Diabetes",
  "Neoplasms",
  "Circulatory",
  "Respiratory",
  "Injury",
  "Muscoloskeletal",
  "Genitourinary",
  "Digestive",
];
const diagOptions3 = [
  "Other",
  "Circulatory",
  "Diabetes",
  "Respiratory",
  "Injury",
  "Neoplasms",
  "Genitourinary",
  "Muscoloskeletal",
  "Digestive",
];
const medicationOptions = ["No", "Steady", "Up", "Down"];
const simpleMedicationOptions = ["No", "Steady"];
const changeOptions = ["No", "Yes"];
const diabetesMedOptions = ["No", "Yes"];

const defaultFormData = {
  age: "[60-70)",
  time_in_hospital: 6,
  num_lab_procedures: 62,
  num_procedures: 6,
  num_medications: 41,
  number_outpatient: 0,
  number_emergency: 0,
  number_inpatient: 0,
  number_diagnoses: 9,
  max_glu_serum: "None",
  A1Cresult: "None",
  race: "AfricanAmerican",
  gender: "Female",
  admission_type_id: "Emergency",
  discharge_disposition_id: "Other",
  admission_source_id: "Referral",
  diag_1: "Diabetes",
  diag_2: "Other",
  diag_3: "Other",
  metformin: "No",
  repaglinide: "No",
  nateglinide: "No",
  chlorpropamide: "No",
  glimepiride: "No",
  acetohexamide: "No",
  glipizide: "Steady",
  glyburide: "No",
  tolbutamide: "No",
  pioglitazone: "Steady",
  rosiglitazone: "No",
  acarbose: "No",
  miglitol: "No",
  troglitazone: "No",
  tolazamide: "No",
  examide: "No",
  citoglipton: "No",
  insulin: "Steady",
  "glyburide-metformin": "No",
  "glipizide-metformin": "No",
  "glimepiride-pioglitazone": "No",
  "metformin-rosiglitazone": "No",
  "metformin-pioglitazone": "No",
  change: "Yes",
  diabetesMed: "Yes",
};

const PredictionForm = ({ onClose, onPredictionSaved }) => {
  const [formData, setFormData] = useState(defaultFormData);
  const [predictionResult, setPredictionResult] = useState(null);
  const [isPredicting, setIsPredicting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    setIsPredicting(true);
    setPredictionResult(null); // Clear previous result

    try {
      const flaskResponse = await fetch("http://localhost:8080/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!flaskResponse.ok) {
        console.error(`Flask API error! status: ${flaskResponse.status}`);
        setPredictionResult("Error fetching prediction.");
        setIsPredicting(false);
        return;
      }

      const predictionData = await flaskResponse.json();
      console.log("Prediction Result from Flask:", predictionData);
      setPredictionResult(predictionData.prediction); // Store the prediction

      // Send the prediction and form data to your Node.js backend
      const nodejsBackendURL = 'https://back-hospital-1.onrender.com/api/predictions/save'; // Replace with your actual URL
      const userId = localStorage.getItem("userId"); // Replace with actual user ID
      console.log("User ID from localStorage:", userId); // Add this log

      const modelUsed = "Pro model"; // Indicate the model used
      const nodejsResponse = await fetch(nodejsBackendURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          inputData: formData,
          prediction: predictionData.prediction,
          modelUsed: modelUsed,
        }),
      });

      if (!nodejsResponse.ok) {
        console.error(`Node.js API error! status: ${nodejsResponse.status}`);
      } else {
        const saveResult = await nodejsResponse.json();
        onPredictionSaved();
        console.log("Prediction data saved to MongoDB:", saveResult);
      }
    } catch (error) {
      console.error("Error submitting form or saving prediction:", error);
      setPredictionResult("An unexpected error occurred.");
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <div className="prediction-form-container">
      {predictionResult === null ? (
        <>
          <h3>Enter Patient Data</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="age">Age:</label>
              <select
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
              >
                <option value="">Select Age Range</option>
                {ageOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="time_in_hospital">Time in Hospital:</label>
              <input
                type="number"
                id="time_in_hospital"
                name="time_in_hospital"
                value={formData.time_in_hospital}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="num_lab_procedures">
                Number of Lab Procedures:
              </label>
              <input
                type="number"
                id="num_lab_procedures"
                name="num_lab_procedures"
                value={formData.num_lab_procedures}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="num_procedures">Number of Procedures:</label>
              <input
                type="number"
                id="num_procedures"
                name="num_procedures"
                value={formData.num_procedures}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="num_medications">Number of Medications:</label>
              <input
                type="number"
                id="num_medications"
                name="num_medications"
                value={formData.num_medications}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="number_outpatient">
                Number of Outpatient Visits:
              </label>
              <input
                type="number"
                id="number_outpatient"
                name="number_outpatient"
                value={formData.number_outpatient}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="number_emergency">
                Number of Emergency Visits:
              </label>
              <input
                type="number"
                id="number_emergency"
                name="number_emergency"
                value={formData.number_emergency}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="number_inpatient">
                Number of Inpatient Visits:
              </label>
              <input
                type="number"
                id="number_inpatient"
                name="number_inpatient"
                value={formData.number_inpatient}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="number_diagnoses">Number of Diagnoses:</label>
              <input
                type="number"
                id="number_diagnoses"
                name="number_diagnoses"
                value={formData.number_diagnoses}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="max_glu_serum">Max Glucose Serum:</label>
              <select
                id="max_glu_serum"
                name="max_glu_serum"
                value={formData.max_glu_serum}
                onChange={handleChange}
              >
                <option value="">Select Value</option>
                {maxGluSerumOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="A1Cresult">A1C Result:</label>
              <select
                id="A1Cresult"
                name="A1Cresult"
                value={formData.A1Cresult}
                onChange={handleChange}
              >
                <option value="">Select Result</option>
                {a1cResultOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="race">Race:</label>
              <select
                id="race"
                name="race"
                value={formData.race}
                onChange={handleChange}
              >
                <option value="">Select Race</option>
                {raceOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="gender">Gender:</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                {genderOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="admission_type_id">Admission Type:</label>
              <select
                id="admission_type_id"
                name="admission_type_id"
                value={formData.admission_type_id}
                onChange={handleChange}
              >
                <option value="">Select Admission Type</option>
                {admissionTypeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="discharge_disposition_id">
                Discharge Disposition:
              </label>
              <select
                id="discharge_disposition_id"
                name="discharge_disposition_id"
                value={formData.discharge_disposition_id}
                onChange={handleChange}
              >
                <option value="">Select Disposition</option>
                {dischargeDispositionOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="admission_source_id">Admission Source:</label>
              <select
                id="admission_source_id"
                name="admission_source_id"
                value={formData.admission_source_id}
                onChange={handleChange}
              >
                <option value="">Select Source</option>
                {admissionSourceOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="diag_1">Primary Diagnosis:</label>
              <select
                id="diag_1"
                name="diag_1"
                value={formData.diag_1}
                onChange={handleChange}
              >
                <option value="">Select Diagnosis</option>
                {diagOptions1.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="diag_2">Secondary Diagnosis:</label>
              <select
                id="diag_2"
                name="diag_2"
                value={formData.diag_2}
                onChange={handleChange}
              >
                <option value="">Select Diagnosis</option>
                {diagOptions2.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="diag_3">Tertiary Diagnosis:</label>
              <select
                id="diag_3"
                name="diag_3"
                value={formData.diag_3}
                onChange={handleChange}
              >
                <option value="">Select Diagnosis</option>
                {diagOptions3.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="metformin">Metformin:</label>
              <select
                id="metformin"
                name="metformin"
                value={formData.metformin}
                onChange={handleChange}
              >
                <option value="">Select</option>
                {medicationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="repaglinide">Repaglinide:</label>
              <select
                id="repaglinide"
                name="repaglinide"
                value={formData.repaglinide}
                onChange={handleChange}
              >
                <option value="">Select</option>
                {medicationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="nateglinide">Nateglinide:</label>
              <select
                id="nateglinide"
                name="nateglinide"
                value={formData.nateglinide}
                onChange={handleChange}
              >
                <option value="">Select</option>
                {medicationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="chlorpropamide">Chlorpropamide:</label>
              <select
                id="chlorpropamide"
                name="chlorpropamide"
                value={formData.chlorpropamide}
                onChange={handleChange}
              >
                <option value="">Select</option>
                {medicationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="glimepiride">Glimepiride:</label>
              <select
                id="glimepiride"
                name="glimepiride"
                value={formData.glimepiride}
                onChange={handleChange}
              >
                <option value="">Select</option>
                {medicationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="acetohexamide">Acetohexamide:</label>
              <select
                id="acetohexamide"
                name="acetohexamide"
                value={formData.acetohexamide}
                onChange={handleChange}
              >
                <option value="">Select</option>
                {simpleMedicationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="glipizide">Glipizide:</label>
              <select
                id="glipizide"
                name="glipizide"
                value={formData.glipizide}
                onChange={handleChange}
              >
                <option value="">Select</option>
                {medicationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="glyburide">Glyburide:</label>
              <select
                id="glyburide"
                name="glyburide"
                value={formData.glyburide}
                onChange={handleChange}
              >
                <option value="">Select</option>
                {medicationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="tolbutamide">Tolbutamide:</label>
              <select
                id="tolbutamide"
                name="tolbutamide"
                value={formData.tolbutamide}
                onChange={handleChange}
              >
                <option value="">Select</option>
                {simpleMedicationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="pioglitazone">Pioglitazone:</label>
              <select
                id="pioglitazone"
                name="pioglitazone"
                value={formData.pioglitazone}
                onChange={handleChange}
              >
                <option value="">Select</option>
                {medicationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="rosiglitazone">Rosiglitazone:</label>
              <select
                id="rosiglitazone"
                name="rosiglitazone"
                value={formData.rosiglitazone}
                onChange={handleChange}
              >
                <option value="">Select</option>
                {medicationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="acarbose">Acarbose:</label>
              <select
                id="acarbose"
                name="acarbose"
                value={formData.acarbose}
                onChange={handleChange}
              >
                <option value="">Select</option>
                {medicationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="miglitol">Miglitol:</label>
              <select
                id="miglitol"
                name="miglitol"
                value={formData.miglitol}
                onChange={handleChange}
              >
                <option value="">Select</option>
                {medicationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="troglitazone">Troglitazone:</label>
              <select
                id="troglitazone"
                name="troglitazone"
                value={formData.troglitazone}
                onChange={handleChange}
              >
                <option value="">Select</option>
                {simpleMedicationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="tolazamide">Tolazamide:</label>
              <select
                id="tolazamide"
                name="tolazamide"
                value={formData.tolazamide}
                onChange={handleChange}
              >
                <option value="">Select</option>
                {["No", "Steady", "Up"].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="examide">Examide:</label>
              <select
                id="examide"
                name="examide"
                value={formData.examide}
                onChange={handleChange}
              >
                <option value="">Select</option>
                {["No"].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="citoglipton">Citoglipton:</label>
              <select
                id="citoglipton"
                name="citoglipton"
                value={formData.citoglipton}
                onChange={handleChange}
              >
                <option value="">Select</option>
                {["No"].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="insulin">Insulin:</label>
              <select
                id="insulin"
                name="insulin"
                value={formData.insulin}
                onChange={handleChange}
              >
                <option value="">Select</option>
                {medicationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="glyburide-metformin">Glyburide-Metformin:</label>
              <select
                id="glyburide-metformin"
                name="glyburide-metformin"
                value={formData["glyburide-metformin"]}
                onChange={handleChange}
              >
                <option value="">Select</option>
                {medicationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="glipizide-metformin">Glipizide-Metformin:</label>
              <select
                id="glipizide-metformin"
                name="glipizide-metformin"
                value={formData["glipizide-metformin"]}
                onChange={handleChange}
              >
                <option value="">Select</option>
                {simpleMedicationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="glimepiride-pioglitazone">
                Glimepiride-Pioglitazone:
              </label>
              <select
                id="glimepiride-pioglitazone"
                name="glimepiride-pioglitazone"
                value={formData["glimepiride-pioglitazone"]}
                onChange={handleChange}
              >
                <option value="">Select</option>
                {simpleMedicationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="metformin-rosiglitazone">
                Metformin-Rosiglitazone:
              </label>
              <select
                id="metformin-rosiglitazone"
                name="metformin-rosiglitazone"
                value={formData["metformin-rosiglitazone"]}
                onChange={handleChange}
              >
                <option value="">Select</option>
                {simpleMedicationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="metformin-pioglitazone">
                Metformin-Pioglitazone:
              </label>
              <select
                id="metformin-pioglitazone"
                name="metformin-pioglitazone"
                value={formData["metformin-pioglitazone"]}
                onChange={handleChange}
              >
                <option value="">Select</option>
                {simpleMedicationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="change">Change in Medication:</label>
              <select
                id="change"
                name="change"
                value={formData.change}
                onChange={handleChange}
              >
                <option value="">Select</option>
                {changeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="diabetesMed">Diabetes Medication:</label>
              <select
                id="diabetesMed"
                name="diabetesMed"
                value={formData.diabetesMed}
                onChange={handleChange}
              >
                <option value="">Select</option>
                {diabetesMedOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-actions">
              <button type="submit" disabled={isPredicting}>
                {isPredicting ? "Predicting..." : "Predict"}
              </button>
              <button type="button" onClick={onClose}>
                Cancel
              </button>
            </div>
          </form>
        </>
      ) : (
        <div className="prediction-result-container">
          <h3>Prediction Result:</h3>
          {predictionResult === "Error fetching prediction." ||
          predictionResult === "An unexpected error occurred." ? (
            <p className="prediction-error">{predictionResult}</p>
          ) : (
            <p className="prediction-value">{predictionResult}</p>
          )}
          <button type="button" onClick={() => setPredictionResult(null)}>
            Back to Form
          </button>
          <button type="button" onClick={onClose}>
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default PredictionForm;
