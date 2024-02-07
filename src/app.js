import React, { Component } from 'react';
import { connect } from 'react-redux';
import { initialize } from './actions';
import logo from './logo.svg';
import './app.css';
import { defineComponents, DocumentReaderService } from '@regulaforensics/vp-frontend-document-components';
import {
  DocumentReaderApi,
  Result,
  Scenario,
  Source,
  TextFieldType,
  GraphicFieldType,
  Light,
  SecurityFeatureType,
} from '@regulaforensics/document-reader-webclient';

const regula_license = process.env.REACT_APP_REGULA_LICENSE;
const { PORTRAIT, DOCUMENT_FRONT } = GraphicFieldType;
const { DOCUMENT_NUMBER } = TextFieldType;
const apiBasePath = 'https://id.comunicagroup.com';

class App extends Component {
  componentDidMount() {
    this.props.initialize();

    window.RegulaDocumentSDK = new DocumentReaderService();
    defineComponents().then(() => window.RegulaDocumentSDK.initialize({ license: regula_license }));

    const component = document.querySelector('document-reader');

    // Define the listener function
    function listener(event) {
      // Check if the action is 'PROCESS_FINISHED' and the status is 1
      if (event.detail.action === 'PROCESS_FINISHED' && event.detail.data.status === 1) {
        // If conditions are met, extract response data and log it
        const response = event.detail.data.response;
        console.log(response);
      }
    }

    // Add the event listener to the 'document-reader' element
    component.addEventListener('document-reader', listener);

    // Add the recognizerProcessParam to the RegulaDocumentSDK
    window.RegulaDocumentSDK.recognizerProcessParam = {
      processParam: {
        returnUncroppedImage: true,
        scenario: 'MrzAndLocate',
        multipageProcessing: false,
        returnPackageForReprocess: false,
        timeout: 20000,
        resultTypeOutput: ['TextDataResult'],
        imageQa: {
          expectedPass: ['dpiThreshold', 'glaresCheck', 'focusCheck'],
          dpiThreshold: 130,
          glaresCheck: true,
          glaresCheckParams: {
            imgMarginPart: 0.05,
            maxGlaringPart: 0.01,
          },
        },
      },
    };
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Comunica Regula Integration</h2>
        </div>
        <document-reader start-screen></document-reader>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps, { initialize })(App);







