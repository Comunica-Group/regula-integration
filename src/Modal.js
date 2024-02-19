import React from 'react';
import './app.css';

const Modal = ({ isOpen, handleClose, results, selfie, portraitImageBase64 }) => {
  const handleReloadPage = () => {
    window.location.reload();
  };

  const getColor = similarity => {
    const percentage = similarity * 100;
    if (percentage > 90) {
      return 'green';
    } else if (percentage > 70) {
      return 'yellow';
    } else {
      return 'red';
    }
  };

  return (
    isOpen && (
      <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={handleClose}>&times;</span>
          <h2>Comparison Results</h2>
          <div className="images-wrapper">
            <div className="image-container">
              <h3>Portrait</h3>
              <img className="image" src={`data:image/png;base64,${portraitImageBase64}`} alt="Portrait" />
            </div>
            <div className="image-container">
              <h3>Selfie</h3>
              <img className="image2" src={`data:image/png;base64,${selfie}`} alt="Selfie" />
            </div>
          </div>
          <div>
            {results.length > 0 && (
              <p style={{ 
                color: getColor(results[results.length - 1].similarity),
                fontSize: '20px', 
                fontWeight: 'bold'
              }}>
                {Math.round(results[results.length - 1].similarity * 100)}% of Similarity
              </p>
            )}
          </div>
          <button onClick={handleReloadPage} className='container-button'>Close and Reload</button>
        </div>
      </div>
    )
  );
};

export default Modal;








