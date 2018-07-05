import React, {Component} from 'react';
import Dashboard from './dashboard/dashboard.js';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import DataSet from './data/airbnb-bcn-rome-ams-paris-2014-2017.json';
import {parser} from './services/data-parser';

//** global styles, used across the app
import styles from './style.css';
styles;

const palette = {
  buttonBackground: '#000000',
  primary1Color: '#000000',
  primary2Color: '#e30413',
  copy: '#ffdd00',
  pickerHeaderColor: '#000000',
  alternateTextColor: '#ffdd00'
};

const theme = {
  palette: palette,
  raisedButton: {
    color: palette.buttonBackground,
    textColor: palette.primary2Color,
    primaryColor: palette.buttonBackground,
    primaryTextColor: palette.copy,
    secondaryColor: '#ffdd00',
    secondaryTextColor: palette.buttonBackground,
    disabledColor: palette.buttonBackground,
    disabledTextColor: palette.buttonBackground
  },
  datePicker: {
    calendarTextColor: palette.primary2Color,
    labelColor: palette.primary2Color
  },
  fontFamily: ['Gotham-bold', 'arial', 'sans-serif']
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    };
  }
  //** called by any url update
  shouldComponentUpdate(nextProps) {
    return true;
  }

  componentDidMount() {
    this.initApp();
  }

  initApp() {
    parser(DataSet)
      .then((r) => {
        this.onDataFetched(r);
      }, () => {
        console.log(':: fail');
      });

  }

  onDataFetched(results) {
    this.results = results;
    if (results) {
      if (!this.firstLoad) {
        this.onPageLoaded();
      }
    }
    this.setState({
      loaded: true
    });
  }
  onDataFetchedFail(results) {
    console.log(':: Fail data fetched :', results);
  }

  //** all data are ready for render
  onPageLoaded() {
    var loaderPage = document.getElementsByClassName('loader-page')[0];
    var loaderPageContent = document.getElementsByClassName('loader-page-content')[0];
    TweenMax.to(loaderPageContent, .4, {autoAlpha: 0, delay: .5});
    TweenMax.to(loaderPage, 1.5, {
      autoAlpha: 0,
      ease: window.Power4.easeInOut,
      delay: .5
    });
  }

  render() {
    return (
      <div>
        <MuiThemeProvider muiTheme={getMuiTheme(theme)}>
          <Dashboard
            results={this.results}
            loaded={this.state.loaded}>
          </Dashboard>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default App;
