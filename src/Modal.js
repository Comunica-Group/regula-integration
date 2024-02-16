import React from 'react';
import './app.css';

const Modal = ({ isOpen, handleClose, results, selfie, portraitImageBase64 }) => {
  const handleReloadPage = () => {
    window.location.reload(); // Reload the page
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
              <img className="image" src={`data:image/png;base64,${selfie}`} alt="Selfie" />
            </div>
          </div>
          <div>
            {results.map(result => (
              <p key={`${result.firstIndex}-${result.secondIndex}`}>
                Pair ({result.firstIndex}, {result.secondIndex}) - Similarity: {result.similarity}
              </p>
            ))}
          </div>
          <button onClick={handleReloadPage}>Close and Reload</button>
        </div>
      </div>
    )
  );
};

export default Modal;








