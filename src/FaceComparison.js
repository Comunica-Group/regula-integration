import React, { useRef, useState, useEffect } from 'react';
import { FaceSdk, ImageSource } from '@regulaforensics/facesdk-webclient';
import Modal from './Modal'; 

const FaceComparison = ({ portraitImageBase64 }) => {
  const faceCaptureRef = useRef(null);
  const [comparisonResults, setComparisonResults] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selfie, setSelfie] = useState(null);

  useEffect(() => {
    const listener = async (event) => {
      if (event.detail.action === 'PROCESS_FINISHED' && event.detail.data.status === 1) {
        const response = event.detail.data.response;
        const capturedSelfie = response.capture[0]; 
        setSelfie(capturedSelfie);
        let apiBasePathComparison = process.env.REACT_APP_FACE_PATH;
        const sdk = new FaceSdk({ basePath: apiBasePathComparison });
        const diagnostic = await sdk.diagnosticsApi.readiness();

        const matchingResponse = await sdk.matchingApi.match({
            images: [
                { type: ImageSource.LIVE, data: portraitImageBase64 },
                { type: ImageSource.DOCUMENT_RFID, data: portraitImageBase64 },
                { data: capturedSelfie },
            ],
            thumbnails: true,
        });

        setComparisonResults(matchingResponse.results);
        setIsModalOpen(true);
      }
    };

    const faceCaptureElement = faceCaptureRef.current;
    if (faceCaptureElement) {
      faceCaptureElement.addEventListener('face-capture', listener);

      return () => {
        faceCaptureElement.removeEventListener('face-capture', listener);
      };
    }
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <h2>Face Comparison</h2>
      {portraitImageBase64 && (
        <div>
          <h3>Portrait Image</h3>
          <face-capture ref={faceCaptureRef}></face-capture>
          <script type="module" src="index.js"></script>
        </div>
      )}
      <Modal isOpen={isModalOpen} handleClose={handleCloseModal} results={comparisonResults} selfie={selfie} portraitImageBase64={portraitImageBase64} />
    </div>
  );
};

export default FaceComparison;









