import React from 'react';
import ReactDOM from 'react-dom';
import App from './app/app.js';
//** hotreload container
import {AppContainer} from 'react-hot-loader';

const renderApp = Component => {
  ReactDOM.render(
      <AppContainer>
        <App></App>
      </AppContainer>
    ,
    document.getElementById('root')
  );
};
renderApp();

//** for hot reload components, without refreshing browser
if (module.hot) {
  module.hot.accept('./app/routes/routes.js', (e) => {
    const newRoutes = require('./app/routes/routes.js').default;
    renderApp(newRoutes);
  });
}
