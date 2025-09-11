import React from 'react';
import './StorageIllustration.css';

const StorageIllustration: React.FC = () => {
  return (
    <div className="storage-illustration-container">
      <div className="storage-illustration">
        <div className="phone-device">
          <div className="phone-screen">
            <div className="check-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20,6 9,17 4,12"></polyline>
              </svg>
            </div>
            <div className="credit-card">
              <div className="card-stripe"></div>
              <div className="card-details">
                <div className="card-chip"></div>
                <div className="card-number"></div>
              </div>
            </div>
            <div className="phone-button"></div>
          </div>
        </div>
        <div className="person-storage">
          <div className="person-head-storage"></div>
          <div className="person-body-storage"></div>
          <div className="person-arm-storage"></div>
        </div>
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>
    </div>
  );
};

export default StorageIllustration;
