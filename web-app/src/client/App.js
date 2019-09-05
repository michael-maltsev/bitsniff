import React, { Component } from 'react';
import './app.css';
import logoImage from './assets/logo.png';
import Dropzone from 'react-dropzone';
import BarLoader from 'react-spinners/BarLoader';
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
      fetch('/api/analyzeNetworkLog', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ log })
      }).then(res => res.json())
        .then(analyzerData => this.setState({ analyzerDataLoading: false, analyzerData }));
    };

    const file = acceptedFiles[0];
    reader.readAsText(file);
    this.setState({ analyzerDataLoading: true });
  }

  onHeaderClick() {
    this.setState({ analyzerData: null });
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
              <AnalysisChart data={analyzerData} />
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
