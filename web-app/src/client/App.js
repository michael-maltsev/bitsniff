import React, { Component } from 'react';
import './app.css';
import logoImage from './assets/logo.png';
import Dropzone from 'react-dropzone';

export default class App extends Component {
  state = { username: null };

  constructor(props) {
    super(props);
    this.onDrop = this.onDrop.bind(this);
  }

  componentDidMount() {
    fetch('/api/getUsername')
      .then(res => res.json())
      .then(user => this.setState({ username: user.username }));
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
        .then(result => console.log(JSON.stringify(result)));
    };

    const file = acceptedFiles[0];
    reader.readAsText(file);
  }

  render() {
    return (
      <>
        <header>
          <img src={logoImage} className='logoImage' alt='logo' />
          <div>BitSniff</div>
        </header>
        <section className='mainSection'>
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
        </section>
        <footer>
          &copy; The BitSniff team
        </footer>
      </>
    );
  }
}
