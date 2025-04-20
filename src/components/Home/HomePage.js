// src/components/HomePage.js
import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import ModelCard from "./ModelCard";
import ProSubscriptionCard from "./ProSubscriptionCard.js";
import InputForm from "../InputForm/InputForm.js";
import "./HomePage.css";
import { AuthContext } from "../../context/AuthContext.js";
import PredictionForm from "../PredictionForm/PredictionForm.js";
import FormComponent from "../FormComponent/FormComponent.js"; // Import FormComponent

const HomePage = () => {
    const { isPro, logout } = useContext(AuthContext); // Get the logout function from context
    const [showProSubscription, setShowProSubscription] = useState(false);
    const [showInputForm, setShowInputForm] = useState(false);
    const [showFormComponent, setShowFormComponent] = useState(false); // State for Model 1 form
    const [showProInputForm, setShowProInputForm] = useState(false);
    const [history, setHistory] = useState([]);
    const userId = localStorage.getItem("userId");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPredictionHistory = async () => {
            if (userId) {
                try {
                    const response = await fetch(
                        `http://localhost:8081/api/predictions/history/${userId}`
                    );
                    if (response.ok) {
                        const data = await response.json();
                        setHistory(data);
                    } else {
                        console.error("Failed to fetch prediction history");
                    }
                } catch (error) {
                    console.error("Error fetching prediction history:", error);
                }
            }
        };

        fetchPredictionHistory();
    }, [userId]);


    const fetchPredictionHistory = async () => {
      if (userId) {
          try {
              const response = await fetch(
                  `http://localhost:8081/api/predictions/history/${userId}`
              );
              if (response.ok) {
                  const data = await response.json();
                  setHistory(data);
              } else {
                  console.error("Failed to fetch prediction history");
              }
          } catch (error) {
              console.error("Error fetching prediction history:", error);
          }
      }
  };

    const handleLogout = () => {
        logout(); // Call the logout function from the AuthContext
        navigate("/login"); // Redirect to the login page after logout
    };

    const handleModelClick = (modelNumber) => {
        if (modelNumber === 3) {
            if (isPro) {
                // User is Pro, allow access to the model
                setShowProInputForm(true); // Or whatever action is appropriate
                setShowProSubscription(false);
            } else {
                // User is not Pro, show the subscription card
                setShowProSubscription(true);
            }
        } else if (modelNumber === 2) {
            setShowInputForm(true);
            setShowProSubscription(false);
        } else if (modelNumber === 1) {
            setShowFormComponent(true); // Show the form for Model 1
            setShowProSubscription(false);
        }
    };

    const handleCloseProSubscription = () => {
        setShowProSubscription(false);
    };

    const handleCloseInputForm = () => {
        setShowInputForm(false);
    };
    const handleProCloseInputForm = () => {
        setShowProInputForm(false);
    };
    const handleCloseFormComponent = () => {
        setShowFormComponent(false);
    };

    const formatPrediction = (prediction , model) => {
      if (model === 'Logistic regression') {
        const formattedPrediction = Number(prediction).toFixed(2);
        console.log(formattedPrediction);
        return formattedPrediction;
        
    } else {
      return prediction === "0.0" ? "No" : "Yes";
      
      
    }
    };

    return (
        <div className="home-page-container">
            <nav className="nav-bar">
                <Link to="/" className="nav-title"> {/* Changed to "/" for homepage */}
                    Hospital Readmission Analysis Using Regression
                </Link>
                <div className="nav-links">
                    {/* <Link to="/profile" className="nav-link">
                        Profile
                    </Link> */}
                    <button onClick={handleLogout} className="logout-button">
                        Logout
                    </button>
                </div>
            </nav>

            <div className="home-page-section">
                <div className="hero-section">
                    <h1>Analyze Hospital Readmission Rates</h1>
                    <p>
                        Explore our powerful machine learning models for insightful
                        predictions.
                    </p>
                </div>

                <div className="models-container">
                    <ModelCard
                        title="Random Forest Regressor"
                        description="A foundational model for predicting readmission risk based on key factors. Accuracy is 79%"
                        onClick={() => handleModelClick(1)}
                        themeColor="#007bff"
                        icon="fa-solid fa-stethoscope"
                    />
                    <ModelCard
                        title="Logistic Regression"
                        description="A logistic Regression model with low accuracy(62%) but works on many features."
                        onClick={() => handleModelClick(2)}
                        themeColor="#28a745"
                        icon="fa-solid fa-heartbeat"
                    />
                    <ModelCard
                        title="Random Forest"
                        description={isPro?"A Random Forest model designed on large data set which takes more features and provide greater accuracy(88.8%).":"A Random Forest model designed on large data set which takes more features and provide greater accuracy(88.8%) . subscription costs rs.10"}
                        onClick={() => handleModelClick(3)}
                        themeColor="#ffc107"
                        isLocked={isPro}
                        icon="fa-solid fa-brain"
                    />
                </div>

                {showProSubscription && !isPro && (
                    <ProSubscriptionCard onClose={handleCloseProSubscription} userId={userId} />
                )}
                {showInputForm && (
                    <div className="modal-overlay" onClick={handleCloseInputForm}>
                        <div
                            className="modal-content"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <InputForm onClose={handleCloseInputForm} onPredictionSaved={fetchPredictionHistory}/>
                        </div>
                    </div>
                )}
                {showProInputForm && (
                    <div className="modal-overlay" onClick={handleProCloseInputForm} >
                        <div
                            className="modal-content"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <PredictionForm onClose={handleProCloseInputForm} onPredictionSaved={fetchPredictionHistory} />
                        </div>
                    </div>
                )}
                {showFormComponent && (
                    <div className="modal-overlay" onClick={handleCloseFormComponent} >
                        <div
                            className="modal-content"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <FormComponent onClose={handleCloseFormComponent} onPredictionSaved={fetchPredictionHistory}/>
                        </div>
                    </div>
                )}

                {/* Prediction History Section */}
                <div className="history-section">
                    <h2>History</h2>
                    {userId ? (
                        history.length > 0 ? (
                            <div className="history-list">
                                {history.map((item) => (
                                    <div key={item._id} className="history-card">
                                        <div className="history-card-header">
                                            <span className="model-name">Model used : {item.modelUsed}</span>
                                            <span className="timestamp">
                                                {new Date(item.timestamp).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </span>
                                        </div>
                                        <div className="history-card-details-home">
                                            <p>
                                                <strong>Predicted Readmission:</strong> {formatPrediction(item.prediction,item.modelUsed)}
                                            </p>
                                        </div>
                                        <div className="history-card-actions-home">
                                            {/* Actions can be added here later */}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="no-history">
                                No prediction history available for this user.
                            </p>
                        )
                    ) : (
                        <p className="login-prompt">
                            Please log in to see your prediction history.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HomePage;