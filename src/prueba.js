import React, { Component } from 'react';
import { connect } from 'react-redux';
import { initialize } from './actions';
import comunica from './Comunica.png';
import './app.css';
import { defineComponents, DocumentReaderService } from '@regulaforensics/vp-frontend-document-components';
import { DocumentReaderApi, Result, Scenario, Source, TextFieldType, GraphicFieldType, Light, SecurityFeatureType } from '@regulaforensics/document-reader-webclient';

const { PORTRAIT, DOCUMENT_FRONT } = GraphicFieldType;
const { DOCUMENT_NUMBER, GIVEN_NAMES, SURNAME } = TextFieldType;

const regula_license = process.env.REACT_APP_REGULA_LICENSE;
const apiBasePath = process.env.REACT_APP_BASE_PATH;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serverVersion: null,
      docOverallStatus: null,
      docNumberVisual: null,
      Name: null,
      LastName: null,
      docNumberMrz: null,
      docNumberVisualValidity: null,
      docNumberMrzValidity: null,
      docNumberMrzVisualMatching: null,
      documentImageBase64: null,
      portraitImageBase64: null,
      activeTab: 'DocumentReader' // Default active tab
    };
    this.listener = this.listener.bind(this);
  }

  componentDidMount() {
    this.props.initialize();

    window.RegulaDocumentSDK = new DocumentReaderService();
    defineComponents().then(() => window.RegulaDocumentSDK.initialize({ license: regula_license }));

    const component = document.querySelector('document-reader');

    const listener = async (event) => {
      if (event.detail.action === 'PROCESS_FINISHED' && event.detail.data.status === 1){ 
      const response = event.detail.data.response;
      const image_container = response.lowLvlResponse.ContainerList.List[0].RawImageContainer;
      const image_format = image_container.format;
      const image = image_container.image;
      const api = new DocumentReaderApi({ basePath: apiBasePath });

      api.setLicense(regula_license);
      const serverInfo = await api.ping();
      const request = {
        images: [
            {
                ImageData: image,
                light: Light.WHITE,
                page_idx: 0,
            },
        ],
        processParam: {
            scenario: Scenario.FULL_AUTH,
            resultTypeOutput: [
                // actual results
                Result.STATUS,
                Result.AUTHENTICITY,
                Result.TEXT,
                Result.IMAGES,
                Result.DOCUMENT_TYPE,
                Result.DOCUMENT_TYPE_CANDIDATES,
                Result.IMAGE_QUALITY,
                // legacy results
                Result.MRZ_TEXT,
                Result.VISUAL_TEXT,
                Result.BARCODE_TEXT,
                Result.RFID_TEXT,
                Result.VISUAL_GRAPHICS,
                Result.BARCODE_GRAPHICS,
                Result.RFID_GRAPHICS,
                Result.LEXICAL_ANALYSIS,
            ],
        },
    };

    const responseProcessed = await api.process(request);
    const requestJson = JSON.stringify(request);
    const responseJson = responseProcessed.json();

    const docOverallStatus = responseProcessed.status.overallStatus;
    const docOpticalTextStatus = responseProcessed.status.detailsOptical.text;

    const docNumberField = responseProcessed.text.getField(DOCUMENT_NUMBER);
    const docNameField = responseProcessed.text.getField(GIVEN_NAMES);
    const docNumberFieldByName = responseProcessed.text.getFieldByName('Document Number');
    const docNamesField = responseProcessed.text.getFieldByName('Given Names');
    const docLastNamesField = responseProcessed.text.getFieldByName('Surname');

    const docNumberVisual = docNumberField.getValue(Source.VISUAL);
    const Name = docNameField.getValue(Source.TEXT);
    const LastName = docLastNamesField.getValue(Source.TEXT);
    const docNumberMrz = docNumberField.getValue(Source.MRZ);
    const docNumberVisualValidity = docNumberField.sourceValidity(Source.VISUAL);
    const docNumberMrzValidity = docNumberField.sourceValidity(Source.MRZ);
    const docNumberMrzVisualMatching = docNumberField.crossSourceComparison(Source.MRZ, Source.VISUAL);

    const docAuthenticity = responseProcessed.authenticity();

    const docImagePattern = docAuthenticity.imagePatternChecks();
    const docImagePatternBlankChecks = docImagePattern.checksByElement(SecurityFeatureType.BLANK);

    const documentImage = responseProcessed.images.getField(DOCUMENT_FRONT);
    const portraitField = responseProcessed.images.getField(PORTRAIT);
    const portraitFromVisual = portraitField.getValue(Source.VISUAL);

    console.log(documentImage);

    const base64String = this.convertUint8ArrayToBase64(portraitField);
    const valuedocument_base64 = documentImage.valueList[0].value;
    const valueportrait_base64 = portraitField.valueList[0].value;

    this.setState({ documentImageBase64: valuedocument_base64 });
    this.setState({ portraitImageBase64: valueportrait_base64 });

    const docImageQuality = responseProcessed.imageQualityChecks();

    this.setState({
      serverVersion: serverInfo.version,
      docOverallStatus,
      docNumberVisual,
      Name,
      LastName,
      docNumberMrz,
      docNumberVisualValidity,
      docNumberMrzValidity,
      docNumberMrzVisualMatching
    });
  
    };

    component.addEventListener('document-reader', listener);

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

  componentWillUnmount() {
    const component = document.querySelector('document-reader');
    if (component) {
      component.removeEventListener('document-reader', this.listener);
    }
  }

  convertUint8ArrayToBase64 = (uint8Array) => {
    const binaryString = String.fromCharCode.apply(null, uint8Array);
    return btoa(binaryString);
  };

  renderDocumentReaderTab = () => {
    return (
      <div>
        <document-reader start-screen></document-reader>
        {this.state.serverVersion && (
          <div className="document-info-container">
            <h2>Document Information</h2>
            <div className="document-info">
              <div>
                <h5>Web API version:</h5>
                <p>{this.state.serverVersion}</p>
              </div>
              <div>
                <h5>Document Overall Status:</h5>
                <p>{this.state.docOverallStatus}</p>
              </div>
              <div>
                <h5>Document Number Visual:</h5>
                <p>{this.state.docNumberVisual}</p>
              </div>
              <div>
                <h5>Given Name:</h5>
                <p>{this.state.Name}</p>
              </div>
              <div>
                <h5>Last Name:</h5>
                <p>{this.state.LastName}</p>
              </div>
              <div>
                <h5>Document Number MRZ:</h5>
                <p>{this.state.docNumberMrz}</p>
              </div>
              <div>
                <h5>Validity Of Document Number Visual:</h5>
                <p>{this.state.docNumberVisualValidity}</p>
              </div>
              <div>
                <h5>Validity Of Document Number MRZ:</h5>
                <p>{this.state.docNumberMrzValidity}</p>
              </div>
              <div>
                <h5>MRZ-Visual values comparison:</h5>
                <p>{this.state.docNumberMrzVisualMatching}</p>
              </div>
              {this.state.documentImageBase64 && (
                <div>
                  <h5>Document Image:</h5>
                  <img src={`data:image/png;base64,${this.state.documentImageBase64}`} alt="Document" />
                </div>
              )}
              {this.state.portraitImageBase64 && (
                <div>
                  <div><br /></div> {/* This is an empty div for separation */}
                  <h5>Document Image:</h5>
                  <img src={`data:image/png;base64,${this.state.portraitImageBase64}`} alt="Document" />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  renderFaceSDKTab = () => {
    return <div>Face SDK content goes here</div>;
  };

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img className="App-logo" src={comunica} alt="Logo" />
          <h1>ID Verification Demo</h1>
        </div>
        <div className="Tabs">
          <button onClick={() => this.setState({ activeTab: 'DocumentReader' })}>Document Reader</button>
          <button onClick={() => this.setState({ activeTab: 'FaceSDK' })}>Face SDK</button>
        </div>
        {this.state.activeTab === 'DocumentReader' && this.renderDocumentReaderTab()}
        {this.state.activeTab === 'FaceSDK' && this.renderFaceSDKTab()}
        <footer className="Footer">
          <img className="Footer-logo" src={comunica} alt="Logo" />
        </footer>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps, { initialize })(App);
