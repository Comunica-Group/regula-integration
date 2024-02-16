import React, { Component } from 'react';
import { connect } from 'react-redux';
import { initialize } from './actions';
import comunica from './Comunica.png';
import './app.css';
import PasswordComponent from './PasswordComponent';
import DocumentReaderTab from './DocumentReaderTab';
import FaceComparison from './FaceComparison';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false,
      activeTab: 'DocumentReader',
      portraitImageBase64: null
    };
  }

  setActiveTab = (tab) => {
    this.setState({ activeTab: tab });
  };

  setPortraitImageBase64 = (portraitImageBase64) => {
    this.setState({ portraitImageBase64: portraitImageBase64 });
  };


  handlePasswordCorrect = () => {
    this.setState({ isAuthenticated: true });
  };

  renderPasswordProtection = () => {
    if (!this.state.isAuthenticated) {
      return <PasswordComponent onPasswordCorrect={this.handlePasswordCorrect} />;
    }
    return null;
  };

  renderDocumentReaderTab = () => {
    return <DocumentReaderTab setActiveTab={this.setActiveTab} setPortraitImageBase64={this.setPortraitImageBase64}/>;
  };
  

  renderFaceComparisonTab = () => {
    return <FaceComparison portraitImageBase64={this.state.portraitImageBase64} />;
  };

  renderFaceSDKTab = () => {
    return (
      <div>
        <face-liveness></face-liveness>
        <script type="module" src="index.js"></script>
      </div>
    );
  };

  renderMainContent = () => {
    if (this.state.isAuthenticated) {
      return (
        <div>
          <div className="Tabs">
            <button
              className={`block ${this.state.activeTab === 'DocumentReader' ? 'active-tab' : ''}`}
              onClick={() => this.setState({ activeTab: 'DocumentReader' })}
            >
              Document Reader
            </button>
            <button
              className={`block2 ${this.state.activeTab === 'FaceSDK' ? 'active-tab' : 'inactive-tab'}`}
              onClick={() => this.setState({ activeTab: 'FaceSDK' })}
            >
              Face SDK
            </button>
          </div>
          {this.state.activeTab === 'DocumentReader' && this.renderDocumentReaderTab()}
          {this.state.activeTab === 'FaceSDK' && this.renderFaceSDKTab()}
          {this.state.activeTab === 'FaceComparison' && this.renderFaceComparisonTab()}
        </div>
      );
    }
    return null;
  };

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img className="App-logo" src={comunica} alt="Logo" />
          <h1>ID Verification Demo</h1>
        </div>
        {this.renderPasswordProtection()}
        {this.renderMainContent()}
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




