// src/components/InputForm/FormComponent.js
import React, { useState } from 'react';
import './FormComponent.css'; // Create this CSS file for styling

const FormComponent = ({ onClose, onPredictionSaved }) => {
    const [formData, setFormData] = useState({
        Age: '',
        Length_of_Stay: '',
        Number_of_Procedures: '',
        Prior_Readmissions: '',
        Severity_of_Illness: '',
        Comorbidities: '',
        Insurance_Type: 'Uninsured', // Default value
    });
    const [predictionResult, setPredictionResult] = useState(null);
    const [isPredicting, setIsPredicting] = useState(false);

    const insuranceOptions = ['Uninsured', 'Private', 'Medicare', 'Medicaid'];

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
        setIsPredicting(true); // Indicate that prediction is in progress
        setPredictionResult(null); // Clear previous result

        try {
            const flaskResponse = await fetch('https://random-forest-regressor.onrender.com/predict_readmission', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!flaskResponse.ok) {
                console.error(`Flask API error! status: ${flaskResponse.status}`);
                setPredictionResult('Error fetching prediction.');
                setIsPredicting(false);
                return;
            }

            const predictionData = await flaskResponse.json();
            console.log('Prediction Result from Flask:', predictionData);
            setPredictionResult(predictionData.readmission_rate); // Store the prediction

            // Send the prediction and form data to your Node.js backend
            const nodejsBackendURL = 'http://localhost:8081/api/predictions/save';
            const userId = localStorage.getItem('userId'); 

            const modelUsed = 'Logistic regression';
            const nodejsResponse = await fetch(nodejsBackendURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    inputData: formData,
                    prediction: predictionData.readmission_rate,
                    modelUsed: modelUsed,
                }),
            });

            if (!nodejsResponse.ok) {
                console.error(`Node.js API error! status: ${nodejsResponse.status}`);
            } else {
                const saveResult = await nodejsResponse.json();
                console.log('Prediction data saved to MongoDB:', saveResult);
                onPredictionSaved();
            }
        } catch (error) {
            console.error('Error submitting form or saving prediction:', error);
            setPredictionResult('An unexpected error occurred.');
        } finally {
            setIsPredicting(false); // Prediction process finished
        }
    };

    return (
        <div className="re-input-form-popup">
            <div className="re-input-form-content">
                {predictionResult === null ? (
                    <>
                        <h2>Enter Patient Data</h2>
                        <form onSubmit={handleSubmit} className="re-input-form">
                            <div className="re-form-group">
                                <label htmlFor="Age">Age:</label>
                                <input
                                    type="number"
                                    id="Age"
                                    name="Age"
                                    value={formData.Age}
                                    onChange={handleChange}
                                    min="10"
                                    max="85"
                                    required
                                />
                            </div>

                            <div className="re-form-group">
                                <label htmlFor="Length_of_Stay">Length of Stay:</label>
                                <input
                                    type="number"
                                    id="Length_of_Stay"
                                    name="Length_of_Stay"
                                    value={formData.Length_of_Stay}
                                    onChange={handleChange}
                                    min="0"
                                    max="15"
                                    required
                                />
                            </div>

                            <div className="re-form-group">
                                <label htmlFor="Number_of_Procedures">Number of Procedures:</label>
                                <input
                                    type="number"
                                    id="Number_of_Procedures"
                                    name="Number_of_Procedures"
                                    value={formData.Number_of_Procedures}
                                    onChange={handleChange}
                                    min="0"
                                    max="5"
                                    required
                                />
                            </div>

                            <div className="re-form-group">
                                <label htmlFor="Prior_Readmissions">Prior Readmissions:</label>
                                <input
                                    type="number"
                                    id="Prior_Readmissions"
                                    name="Prior_Readmissions"
                                    value={formData.Prior_Readmissions}
                                    onChange={handleChange}
                                    min="0"
                                    max="3"
                                    required
                                />
                            </div>

                            <div className="re-form-group">
                                <label htmlFor="Severity_of_Illness">Severity of Illness:</label>
                                <input
                                    type="number"
                                    id="Severity_of_Illness"
                                    name="Severity_of_Illness"
                                    value={formData.Severity_of_Illness}
                                    onChange={handleChange}
                                    min="0"
                                    max="5"
                                    required
                                />
                            </div>

                            <div className="re-form-group">
                                <label htmlFor="Comorbidities">Comorbidities:</label>
                                <input
                                    type="number"
                                    id="Comorbidities"
                                    name="Comorbidities"
                                    value={formData.Comorbidities}
                                    onChange={handleChange}
                                    min="0"
                                    max="5"
                                    required
                                />
                            </div>

                            <div className="re-form-group">
                                <label htmlFor="Insurance_Type">Insurance Type:</label>
                                <select
                                    id="Insurance_Type"
                                    name="Insurance_Type"
                                    value={formData.Insurance_Type}
                                    onChange={handleChange}
                                    required
                                >
                                    {insuranceOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button type="submit" className="re-submit-button" disabled={isPredicting}>
                                {isPredicting ? 'Predicting...' : 'Predict'}
                            </button>
                        </form>
                        <button className="re-modal-close-button-1" onClick={onClose}>Back</button>
                    </>
                ) : (
                    <div className="re-prediction-result">
                        <h2>Prediction Result</h2>
                        {predictionResult === 'Error fetching prediction.' || predictionResult === 'An unexpected error occurred.' ? (
                            <p className="re-prediction-error">{predictionResult}</p>
                        ) : (
                            <p>Predicted Readmission Rate: {predictionResult}</p>
                        )}
                        <button className="re-modal-close-button-2" onClick={onClose}>Close</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FormComponent;