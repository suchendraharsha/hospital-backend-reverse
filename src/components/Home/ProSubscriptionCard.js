// src/components/ProSubscriptionCard.js
import React, { useState, useContext, useEffect } from 'react';
import './ProSubscriptionCard.css';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { AuthContext } from '../../context/AuthContext.js'; // Import AuthContext
import { useNavigate } from 'react-router-dom'; // Import useNavigate

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe('pk_test_51RAia6Q23ToESyf5x5AtQUbaShyOa7vxSe8mQYAJYpBSvbeHbB2Qv6JFM1gruKeiTsxgrxa7Rm3Gp4XYHtO8kC1c00xWc1JBLK');

const CheckoutForm = ({ onCloseCheckout, userId, onPaymentSuccess, onSubscriptionError }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [paymentError, setPaymentError] = useState(null);
    const [isSubscribing, setIsSubscribing] = useState(false);
    const [billingDetails, setBillingDetails] = useState({
        name: '',
        email: '',
        address: {
            line1: '',
            postal_code: '',
            city: '',
            state: '',
            country: '',
        },
    });
    const { authToken } = useContext(AuthContext); // Get authToken from context
    const navigate = useNavigate();

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name.startsWith('address.')) {
            setBillingDetails((prevDetails) => ({
                ...prevDetails,
                address: {
                    ...prevDetails.address,
                    [name.split('.')[1]]: value,
                },
            }));
        } else {
            setBillingDetails((prevDetails) => ({
                ...prevDetails,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsSubscribing(true);
        setPaymentError(null);

        const cardElement = elements.getElement(CardElement);

        if (!cardElement) {
            return;
        }

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
            billing_details: billingDetails,
        });

        if (error) {
            console.error('Stripe createPaymentMethod error:', error);
            setPaymentError(error.message);
            setIsSubscribing(false);
            if (onSubscriptionError) {
                onSubscriptionError(error.message);
            }
            return;
        }

        console.log('Payment Method:', paymentMethod);

        try {
            const response = await fetch('https://back-hospital-1.onrender.com/api/auth/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`, // Pass the token here
                },
                body: JSON.stringify({
                    paymentMethodId: paymentMethod.id,
                    userId: userId,
                    amount: 20, // Example amount in cents
                    currency: 'USD', // Example currency
                    billingDetails: billingDetails,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Payment successful:', data);
                setIsSubscribing(false);
                onCloseCheckout();
                if (onPaymentSuccess) {
                    onPaymentSuccess(); // Call the payment success handler
                }
            } else if (response.status === 401) {
                // Handle unauthorized access
                console.error('Payment failed due to authorization:', data);
                setPaymentError(data.msg || 'Authorization denied. Please log in again.');
                setIsSubscribing(false);
                onCloseCheckout(); // Optionally close the checkout
                navigate('/login'); // Navigate to the login page
                if (onSubscriptionError) {
                    onSubscriptionError(data.msg || 'Authorization denied. Please log in again.');
                }
            } else {
                console.error('Payment failed:', data);
                setPaymentError(data.error || 'An error occurred during subscription.');
                setIsSubscribing(false);
                if (onSubscriptionError) {
                    onSubscriptionError(data.error || 'An error occurred during subscription.');
                }
            }
        } catch (error) {
            console.error('Error calling /subscribe:', error);
            setPaymentError('Failed to connect to the server.');
            setIsSubscribing(false);
            if (onSubscriptionError) {
                onSubscriptionError('Failed to connect to the server.');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="pro-subscription-form">
            <button type="button" className="pro-subscription-back-button" onClick={onCloseCheckout}>
                Back
            </button>
            <div className="form-group">
                <label htmlFor="name">Name on Card</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={billingDetails.name}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={billingDetails.email}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="address.line1">Address</label>
                <input
                    type="text"
                    id="address.line1"
                    name="address.line1"
                    value={billingDetails.address.line1}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="address.postal_code">Postal Code</label>
                <input
                    type="text"
                    id="address.postal_code"
                    name="address.postal_code"
                    value={billingDetails.address.postal_code}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="address.city">City</label>
                <input
                    type="text"
                    id="address.city"
                    name="address.city"
                    value={billingDetails.address.city}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="address.state">State</label>
                <input
                    type="text"
                    id="address.state"
                    name="address.state"
                    value={billingDetails.address.state}
                    onChange={handleInputChange}
                />
            </div>
            <div className="form-group">
                <label htmlFor="address.country">Country</label>
                <input
                    type="text"
                    id="address.country"
                    name="address.country"
                    value={billingDetails.address.country}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div className="form-group">
                <label>Card Details</label>
                <div className="card-element-wrapper">
                    <CardElement
                        id="card"
                        options={{
                            style: {
                                base: {
                                    fontSize: '16px',
                                    color: '#424770',
                                    '::placeholder': {
                                        color: '#aab7c4',
                                    },
                                },
                                invalid: {
                                    color: '#9e2146',
                                },
                            },
                        }}
                    />
                </div>
            </div>
            {paymentError && <div className="payment-error">{paymentError}</div>}
            <button type="submit" disabled={!stripe || isSubscribing} className="pro-subscription-pay-button">
                {isSubscribing ? 'Processing...' : 'Pay and Subscribe'}
            </button>
        </form>
    );
};

const ProSubscriptionCard = ({ onClose, userId }) => {
    const [showCheckout, setShowCheckout] = useState(false);
    const navigate = useNavigate(); // Import and initialize useNavigate
    const { authToken, setIsPro } = useContext(AuthContext); // Get authToken and setIsPro
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    useEffect(() => {
        if (showCheckout && !authToken) {
            navigate('/login');
        }
    }, [showCheckout, authToken, navigate]);

    const handleSubscribeClick = () => {
        setShowCheckout(true);
    };

    const handleBackToFeatures = () => {
        setShowCheckout(false);
    };

    const handlePaymentSuccess = () => {
        setPaymentSuccess(true);
        setIsPro(true);
        console.log('Payment successful, context updated!');
        // Optionally, you can set a timeout to hide the success message
        // setTimeout(() => {
        //     setPaymentSuccess(false);
        //     onClose();
        // }, 2000);
    };

    const handlePaymentError = (error) => {
        console.error('Payment error in ProSubscriptionCard:', error);
        // Optionally display an error message to the user here if needed
    };

    const closeSuccessPopup = () => {
        setPaymentSuccess(false);
        onClose();
    };

    return (
        <div className="pro-subscription-overlay" onClick={onClose}>
            <div className="pro-subscription-modal" onClick={(e) => e.stopPropagation()}>
                {!showCheckout && !paymentSuccess && (
                    <>
                        <h2 className="pro-subscription-title">Unlock Pro Features</h2>
                        <p className="pro-subscription-description">
                            Gain access to our most advanced machine learning models and unlock a deeper level of analysis. Subscribe to our Pro plan today!
                        </p>
                        <ul className="pro-subscription-features">
                            <li>Access to the Random Forest model</li>
                            <li>Priority processing for faster results</li>
                            <li>Very good accuracy</li>
                            <li>Subscription costs 10 ruppees.</li>
                            
                        </ul>
                        <div className="pro-subscription-buttons">
                            <button className="pro-subscription-close-button" onClick={onClose}>Close</button>
                            <button className="pro-subscription-subscribe-button" onClick={handleSubscribeClick}>Subscribe Now</button>
                        </div>
                    </>
                )}

                {showCheckout && stripePromise && authToken && !paymentSuccess && (
                    <div className="checkout-container">
                        <Elements stripe={stripePromise}>
                            <CheckoutForm
                                onCloseCheckout={handleBackToFeatures}
                                userId={userId}
                                onPaymentSuccess={handlePaymentSuccess} // Pass the success handler
                                onSubscriptionError={handlePaymentError}   // Pass the error handler
                            />
                        </Elements>
                    </div>
                )}

                {paymentSuccess && (
                    <div className="payment-success-popup">
                        <h2>Payment Successful!</h2>
                        <p>Thank you for your purchase. Your Pro features are now unlocked.</p>
                        <button className="pro-subscription-close-button" onClick={closeSuccessPopup}>Back</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProSubscriptionCard;