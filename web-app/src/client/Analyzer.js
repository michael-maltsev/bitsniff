import React, { Component } from 'react';
import './app.css';
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
  }

  onDrop(acceptedFiles) {
    if (acceptedFiles.length === 0) {
      return;
    }

    const file = acceptedFiles[0];

    let logDay = 6; // default to 09-06-xxx.log, the day of the legendary hackathon \m/
    const match = file.name.match(/^(\d+)-(\d+)-/);
    if (match && parseInt(match[1], 10) === 9) {
      logDay = parseInt(match[2], 10);
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
        body: JSON.stringify({ log, coin, logDay })
      }).then(res => res.json())
        .then(analyzerData => {
          this.setState({ analyzerDataLoading: false, analyzerData });
          this.props.history.push('/result/' + encodeURIComponent(file.name));
        })
        .catch(error => {
          console.log(error);
          this.setState({ analyzerDataLoading: false, analyzerData: null });
        });
    };

    reader.readAsText(file);
    this.setState({ analyzerDataLoading: true });
  }

  render() {
    const { match } = this.props;
    const { analyzerDataLoading, analyzerData } = this.state;

    const showAnalyzerData = match.params.resultId && analyzerData;

    return (
      <>
        {analyzerDataLoading ?
          <BarLoader
            widthUnit='px'
            width={200}
            color='white'
          />
          :
          showAnalyzerData ?
            <>
              <div className='verdictText'>
                {'The file represents Bitcoin activity with '}
                <span className='verdictTextNumber'>{calcResultPercentage(analyzerData.result)}</span> probability
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
      </>
    );
  }
}

function calcResultPercentage(result) {
  const percentage = Number((ztable(result * 0.5) * 100).toFixed(1));
  const prefix = percentage === 100 ? 'nearly ' : '';
  return `${prefix}${percentage}%`;
}
