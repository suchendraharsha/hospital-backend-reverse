import React from 'react';
import './ModelCard.css'; // Import CSS for ModelCard
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';

const ModelCard = ({ title, description, onClick, themeColor, isLocked, icon }) => {
  const cardStyle = {
    borderLeft: `5px solid ${themeColor || '#ccc'}`,
  };

  return (
    <div className="model-card" style={cardStyle} onClick={onClick}>
      <div className="icon-placeholder" style={{ color: themeColor || '#ccc' }}>
        <i className={icon}></i>
      </div>
      <h3 className="model-title">
        {title}
        {!isLocked && <FontAwesomeIcon icon={faLock} className="lock-icon" />}
      </h3>
      <p className="model-description">{description}</p>
    </div>
  );
};

export default ModelCard;