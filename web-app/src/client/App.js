import React, { Component } from 'react';
import './app.css';
import logoImage from './assets/logo.png';
import Dropzone from 'react-dropzone';
import BarLoader from 'react-spinners/BarLoader';
import ztable from 'ztable';
import AnalysisChart from './components/AnalysisChart'

export default class App extends Component {
  state = {
    analyzerDataLoading: false,
    analyzerData: null
  };

  constructor(props) {
    super(props);
    this.onDrop = this.onDrop.bind(this);
    this.onHeaderClick = this.onHeaderClick.bind(this);
    this.calcResultPercentage = this.calcResultPercentage.bind(this);
  }

  onDrop(acceptedFiles) {
    if (acceptedFiles.length === 0) {
      return;
    }

    const reader = new FileReader();

    reader.onabort = () => console.log('file reading was aborted');
    reader.onerror = () => console.log('file reading has failed');
    reader.onload = () => {
      // Do whatever you want with the file contents
      const log = reader.result;
      const coin = 'bitcoin';
      fetch('/api/analyzeNetworkLog', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ log, coin })
      }).then(res => res.json())
        .then(analyzerData => this.setState({ analyzerDataLoading: false, analyzerData }))
        .catch(error => {
          console.log(error);
          this.setState({ analyzerDataLoading: false, analyzerData: null });
        });
    };

    const file = acceptedFiles[0];
    reader.readAsText(file);
    this.setState({ analyzerDataLoading: true });
  }

  onHeaderClick() {
    this.setState({ analyzerData: null });
  }

  calcResultPercentage(result) {
    const percentage = Number((ztable(result * 0.5) * 100).toFixed(1));
    const prefix = percentage === 100 ? 'nearly ' : '';
    return `${prefix}${percentage}%`;
  }

  render() {
    const { analyzerDataLoading, analyzerData } = this.state;
    return (
      <>
        <header className={analyzerData && 'clickableHeader'} onClick={analyzerData && this.onHeaderClick}>
          <img src={logoImage} className={'logoImage' + (analyzerData ? ' logoImageSmall' : '')} alt='logo' />
          <div>BitSniff</div>
        </header>
        <section className='mainSection'>
          {analyzerDataLoading ?
            <BarLoader
              widthUnit='px'
              width={200}
              color='white'
            />
            :
            analyzerData ?
              <>
                <div className='verdictText'>
                  {'The file represents Bitcoin activity with '}
                  <span className='verdictTextNumber'>{this.calcResultPercentage(analyzerData.result)}</span> probability
                </div>
                <AnalysisChart data={analyzerData} />
              </>
              :
              <Dropzone onDrop={this.onDrop}>
                {({ getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject }) => {
                  let divClassName = 'dropzoneBaseStyle';
                  if (isDragActive) {
                    divClassName += ' dropzoneActiveStyle';
                  }
                  if (isDragAccept) {
                    divClassName += ' dropzoneAcceptStyle';
                  }
                  if (isDragReject) {
                    divClassName += ' dropzoneRejectStyle';
                  }
                  return (
                    <section>
                      <div {...getRootProps({ className: divClassName })}>
                        <input {...getInputProps()} />
                        <p>Drop the network log file to be analyzed</p>
                      </div>
                    </section>
                  );
                }}
              </Dropzone>
          }
        </section>
        <footer>
          &copy; The BitSniff team
        </footer>
      </>
    );
  }
}
