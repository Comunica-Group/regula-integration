import React, { Component } from 'react';
import { connect } from 'react-redux';
import { initialize } from './actions';
import logo from './logo.svg';
import './app.css';
import { defineComponents, DocumentReaderService } from '@regulaforensics/vp-frontend-document-components';
import { DocumentReaderApi, Result, Scenario, Source, TextFieldType, GraphicFieldType, Light,SecurityFeatureType } from '@regulaforensics/document-reader-webclient';

const { PORTRAIT, DOCUMENT_FRONT } = GraphicFieldType;
const { DOCUMENT_NUMBER, GIVEN_NAMES, SURNAME } = TextFieldType;

const regula_license = process.env.REACT_APP_REGULA_LICENSE;
const apiBasePath = process.env.REACT_APP_BASE_PATH;

class App extends Component {
  componentDidMount() {
    this.props.initialize();

    window.RegulaDocumentSDK = new DocumentReaderService();
    defineComponents().then(() => window.RegulaDocumentSDK.initialize({ license: regula_license }));

    const component = document.querySelector('document-reader');

    async function listener(event) {
      if (event.detail.action === 'PROCESS_FINISHED' && event.detail.data.status === 1) {
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

      const documentImage = responseProcessed.images.getField(DOCUMENT_FRONT).getValue();
      const portraitField = responseProcessed.images.getField(PORTRAIT);
      const portraitFromVisual = portraitField.getValue(Source.VISUAL);
      // Here you should handle saving files, possibly using browser APIs
      console.log('Document Image:', documentImage);
      console.log('Portrait:', portraitFromVisual);

      const docImageQuality = responseProcessed.imageQualityChecks();

      console.log('-----------------------------------------------------------------');
      console.log(`            Web API version: ${serverInfo.version}`);
      console.log('-----------------------------------------------------------------');
      console.log(`           Document Overall Status: ${docOverallStatus}`);
      console.log(`            Document Number Visual: ${docNumberVisual}`);
      console.log(`            Given Name: ${Name}`);
      console.log(`            Last Name: ${LastName}`);
      console.log(`               Document Number MRZ: ${docNumberMrz}`);
      console.log(`Validity Of Document Number Visual: ${docNumberVisualValidity}`);
      console.log(`   Validity Of Document Number MRZ: ${docNumberMrzValidity}`);
      console.log(`      MRZ-Visual values comparison: ${docNumberMrzVisualMatching}`);
      console.log('-----------------------------------------------------------------');

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








