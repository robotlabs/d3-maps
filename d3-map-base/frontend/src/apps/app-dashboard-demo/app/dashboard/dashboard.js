import React, {Component} from 'react';
import * as dg from 'dis-gui';

import DashboardLayout from './dashboard-layout/dashboard-layout';

//** dashboard components
import WorldBars from './components/world-bars/world-bars.js';
import style from './style.css';

import dispatchManager from './../../../shared-services/dispatch-manager.js';

class Dashboard extends Component {

  constructor(props) {
    super(props);
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.loaded) {
      return true;
    }
    return false;
  }

  componentDidMount(props) {}
  componentWillMount() {}
  componentDidUpdate() {}
  componentWillUpdate(nextProps, nextState) {}
  componentWillReceiveProps(nextProps) {}

  render() {
    return (
      <div className={style.dashboard}>
        <DashboardLayout
          loaded={this.props.loaded}
          ref={(element) => {
            this.layout = element;
          }}
          >
          <WorldBars
            dm={dispatchManager}
            id='g1'
            loaded={this.props.loaded}
            g1ClassName={style.g1}></WorldBars>
        </DashboardLayout>
      </div>
    );
  }
}

export default Dashboard;
