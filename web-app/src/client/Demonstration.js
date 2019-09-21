import React, { Component } from 'react';
import './app.css';
import BarLoader from 'react-spinners/BarLoader';
import ztable from 'ztable';
import logoImage from './assets/logo.png';
import AnalysisChart from './components/AnalysisChart';

export default class App extends Component {
  state = {
    analyzerDataLoading: false,
    analyzerData: null
  };

  constructor(props) {
    super(props);
    this.onShowLogsClick = this.onShowLogsClick.bind(this);
    this.onHeaderClick = this.onHeaderClick.bind(this);
    this.calcResultPercentage = this.calcResultPercentage.bind(this);
  }

  onShowLogsClick(logName) {
    import(`./demonstration-data/${logName}.js`).then(({ default: analyzerData }) => {
      this.setState({ analyzerDataLoading: false, analyzerData });
    });

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
              <>
                <div className='examplesDescription'>Select one of the examples below or <a href='https://github.com/m417z/bitsniff'>clone the repository</a> to analyze your own log</div>
                <a className='defaultButton' onClick={() => this.onShowLogsClick('2019-09-05-01_00_00-01_59_59_real')}>
                  Real Bitcoin node traffic
                </a>
                <a className='defaultButton' onClick={() => this.onShowLogsClick('2019-09-05-00_00_00-00_59_59_shifted')}>
                  Shifted Bitcoin node traffic
                </a>
                <a className='defaultButton' onClick={() => this.onShowLogsClick('2019-09-05_youtube_long')}>
                  YouTube watching traffic
                </a>
              </>
          }
        </section>
        <footer>
          &copy; The BitSniff team
        </footer>
      </>
    );
  }
}
