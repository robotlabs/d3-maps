import React, {Component} from 'react';
import View from './map/map.js';
//** global styles, used across the app
import styles from './style.css';
styles;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    };
  }

  componentDidMount() {
    this.initApp();
  }

  initApp() {
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
      <View></View>
    );
  }
}

export default App;
