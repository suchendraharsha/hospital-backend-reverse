// src/components/InputForm/InputForm.js
import React, { useState, useRef, useEffect } from 'react';
import './InputForm.css'; 
const InputForm = ({ onClose, onPredictionSaved }) => {
    const [formData, setFormData] = useState({
        time_in_hospital: 1,
        n_lab_procedures: 42,
        n_procedures: 0,
        n_medications: 7,
        n_outpatient: 0,
        n_inpatient: 0,
        n_emergency: 0,
        change: 'no',
        age: '(60-70)',
        diabetes_med: 'yes',
        glucose_test: 'no',
        A1Ctest: 'no',
        diag_1: 'Other',
        diag_2: 'Circulatory',
        diag_3: 'Respiratory',
    });
    const [predictionResult, setPredictionResult] = useState(null);
    const modalRef = useRef(null); // Create a ref for the modal container

    const ageOptions = [
        '(40-50)', '(50-60)', '(60-70)', '(70-80)', '(80-90)', '(90-100)',
    ];

    const yesNoOptions = ['yes', 'no'];

    const glucoseA1cOptions = ['no', 'normal', 'high'];

    const diagnosisOptions = [
        'Other',
        'InternalMedicine',
        'Family/GeneralPractice',
        'Cardiology',
        'Surgery',
        'Emergency/Trauma',
    ];
    const formatPredictionlr = (prediction) => {  
        return prediction === "0.0" ? "No" : "Yes";
      };
    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'number' ? parseInt(value, 10) : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form Data:', formData);
        setPredictionResult('Loading...'); // Show loading state

        try {
            const flaskResponse = await fetch('https://linear-regression-917v.onrender.com/predict_lr', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!flaskResponse.ok) {
                console.error(`Flask API error! status: ${flaskResponse.status}`);
                setPredictionResult('Error fetching prediction.');
                return;
            }

            const predictionData = await flaskResponse.json();
            console.log('Prediction Result from Flask:', predictionData);
            const preRes = formatPredictionlr(predictionData.prediction_lr);
            setPredictionResult(preRes); // Store the prediction

            // Send the prediction and form data to your Node.js backend
            const nodejsBackendURL = 'https://back-hospital-1.onrender.com/api/predictions/save'; // Replace with your actual URL
            const userId = localStorage.getItem('userId'); // Replace with actual user ID
            console.log('User ID from localStorage:', userId); // Add this log

            const modelUsed = 'Logistic Regression'; // Indicate the model used
            const nodejsResponse = await fetch(nodejsBackendURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    inputData: formData,
                    prediction: predictionData.prediction_lr,
                    modelUsed: modelUsed,
                }),
            });

            if (!nodejsResponse.ok) {
                console.error(`Node.js API error! status: ${nodejsResponse.status}`);
            } else {
                const saveResult = await nodejsResponse.json();
                onPredictionSaved();
                console.log('Prediction data saved to MongoDB:', saveResult);
            }
        } catch (error) {
            console.error('Error submitting form or saving prediction:', error);
            setPredictionResult('An unexpected error occurred.');
        }
    };

    useEffect(() => {
        if (modalRef.current) {
            modalRef.current.scrollTop = 0;
        }
    }, []); // Run once after initial render

    return (
        <div className="input-form-popup-unique" ref={modalRef}> {/* Use the unique class */}
            <div className="input-form-content-unique"> {/* Use the unique class */}
                {predictionResult === null ? <h2>Enter Patient Data</h2> :<h2></h2>}
                {predictionResult === null ? (
                    <>
                    <form onSubmit={handleSubmit} className="input-form-unique"> {/* Use the unique class */}
                        <div className="form-group-unique"> {/* Use the unique class */}
                            <label htmlFor="time_in_hospital">Time in Hospital:</label>
                            <input
                                type="number"
                                id="time_in_hospital"
                                name="time_in_hospital"
                                value={formData.time_in_hospital}
                                onChange={handleChange}
                                className="form-group-unique" // You can add it here too if needed for specific input styling
                            />
                        </div>

                        <div className="form-group-unique"> {/* Use the unique class */}
                            <label htmlFor="n_lab_procedures">Number of Lab Procedures:</label>
                            <input
                                type="number"
                                id="n_lab_procedures"
                                name="n_lab_procedures"
                                value={formData.n_lab_procedures}
                                onChange={handleChange}
                                className="form-group-unique"
                            />
                        </div>

                        <div className="form-group-unique"> {/* Use the unique class */}
                            <label htmlFor="n_procedures">Number of Procedures:</label>
                            <input
                                type="number"
                                id="n_procedures"
                                name="n_procedures"
                                value={formData.n_procedures}
                                onChange={handleChange}
                                className="form-group-unique"
                            />
                        </div>

                        <div className="form-group-unique"> {/* Use the unique class */}
                            <label htmlFor="n_medications">Number of Medications:</label>
                            <input
                                type="number"
                                id="n_medications"
                                name="n_medications"
                                value={formData.n_medications}
                                onChange={handleChange}
                                className="form-group-unique"
                            />
                        </div>

                        <div className="form-group-unique"> {/* Use the unique class */}
                            <label htmlFor="n_outpatient">Number of Outpatient Visits:</label>
                            <input
                                type="number"
                                id="n_outpatient"
                                name="n_outpatient"
                                value={formData.n_outpatient}
                                onChange={handleChange}
                                className="form-group-unique"
                            />
                        </div>

                        <div className="form-group-unique"> {/* Use the unique class */}
                            <label htmlFor="n_inpatient">Number of Inpatient Visits:</label>
                            <input
                                type="number"
                                id="n_inpatient"
                                name="n_inpatient"
                                value={formData.n_inpatient}
                                onChange={handleChange}
                                className="form-group-unique"
                            />
                        </div>

                        <div className="form-group-unique"> {/* Use the unique class */}
                            <label htmlFor="n_emergency">Number of Emergency Visits:</label>
                            <input
                                type="number"
                                id="n_emergency"
                                name="n_emergency"
                                value={formData.n_emergency}
                                onChange={handleChange}
                                className="form-group-unique"
                            />
                        </div>

                        <div className="form-group-unique"> {/* Use the unique class */}
                            <label htmlFor="change">Change in Condition:</label>
                            <select
                                id="change"
                                name="change"
                                value={formData.change}
                                onChange={handleChange}
                                className="form-group-unique"
                            >
                                {yesNoOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group-unique"> {/* Use the unique class */}
                            <label htmlFor="age">Age Group:</label>
                            <select id="age" name="age" value={formData.age} onChange={handleChange} className="form-group-unique">
                                {ageOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group-unique"> {/* Use the unique class */}
                            <label htmlFor="diabetes_med">Diabetes Medication:</label>
                            <select
                                id="diabetes_med"
                                name="diabetes_med"
                                value={formData.diabetes_med}
                                onChange={handleChange}
                                className="form-group-unique"
                            >
                                {yesNoOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group-unique"> {/* Use the unique class */}
                            <label htmlFor="glucose_test">Glucose Test Result:</label>
                            <select
                                id="glucose_test"
                                name="glucose_test"
                                value={formData.glucose_test}
                                onChange={handleChange}
                                className="form-group-unique"
                            >
                                {glucoseA1cOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group-unique"> {/* Use the unique class */}
                            <label htmlFor="A1Ctest">A1C Test Result:</label>
                            <select id="A1Ctest" name="A1Ctest" value={formData.A1Ctest} onChange={handleChange} className="form-group-unique">
                                {glucoseA1cOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group-unique"> {/* Use the unique class */}
                            <label htmlFor="diag_1">Primary Diagnosis:</label>
                            <select id="diag_1" name="diag_1" value={formData.diag_1} onChange={handleChange} className="form-group-unique">
                                {diagnosisOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group-unique"> {/* Use the unique class */}
                            <label htmlFor="diag_2">Secondary Diagnosis:</label>
                            <select id="diag_2" name="diag_2" value={formData.diag_2} onChange={handleChange} className="form-group-unique">
                                {diagnosisOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group-unique"> {/* Use the unique class */}
                            <label htmlFor="diag_3">Third Diagnosis:</label>
                            <select id="diag_3" name="diag_3" value={formData.diag_3} onChange={handleChange} className="form-group-unique">
                                {diagnosisOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button type="submit" className="submit-button-unique">Predict</button>
                    </form>
                    <button className="modal-close-button-unique" onClick={onClose}>Close Form</button>
                    </>
                    
                ) : (
                    <div className="prediction-result-container-unique"> {/* Use the unique class */}
                        <h3>Prediction Result:</h3>
                        <p className="prediction-value-unique">{predictionResult}</p> {/* Use the unique class */}
                        <button className="modal-close-button-unique" onClick={onClose}>Close</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InputForm;