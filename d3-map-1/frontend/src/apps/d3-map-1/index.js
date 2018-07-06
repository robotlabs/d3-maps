import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './app/routes/routes.js';
//** hotreload container
import {AppContainer} from 'react-hot-loader';
//** fix for material-ui
// Needed for onTouchTap
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

//** create react home
var divRoot = document.createElement('div');
divRoot.className = 'div-root';
divRoot.style.position = 'absolute';
divRoot.style.top = '0px';
divRoot.style.left = '0px';
divRoot.style.width = '100%';
divRoot.style.height = '100%';
document.body.appendChild(divRoot);
const renderApp = Component => {
  ReactDOM.render(
      <AppContainer>
        <Routes></Routes>
      </AppContainer>
    ,
    divRoot
  );
};
renderApp(Routes);

//** for hot reload components, without refreshing browser
if (module.hot) {
  module.hot.accept('./app/routes/routes.js', (e) => {
    const newRoutes = require('./app/routes/routes.js').default;
    renderApp(newRoutes);
  });
}
