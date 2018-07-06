import React from 'react';

import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';

/*components*/
import App from './../app';
function routes(props) {
  return (
      <Router basename="">
          <Route component={App}/>
      </Router>
  );
}

export default routes;
