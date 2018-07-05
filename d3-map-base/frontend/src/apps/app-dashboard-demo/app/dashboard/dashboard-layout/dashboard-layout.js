import React, {Component} from 'react';
import AppSettings from './../../app-utils/app-settings';

import dispatchManager from './../../../../shared-services/dispatch-manager.js';
//** LAYOUTS
import {
  layoutA
  ,layoutB
} from './layouts/layout-a.js';

//** style
import style from './style.css';

class DashboardLayout extends Component {
  //** component stuff
  constructor(props) {
    super();
    this.modeLayout = 'A';
    this.filterBarHeight = 25;

  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.loaded) {
      this.resize();
      return true;
    }
    return false;
  }
  componentWillMount() {}
  componentDidMount() {
    this.layoutNodes = [];
    for (let m in this.refs) {
      this.layoutNodes.push(this.refs[m]);
    }
    window.addEventListener('resize', this.resize.bind(this));
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resize.bind(this));
  }

  componentWillReceiveProps(nextProps) {
    if (!this.firstTime) {
      this.firstTime = true;
      var height = window.innerHeight;
      var width = window.innerWidth;
      this.updateLayout();
    }
  }

  resize() {
    this.updateLayout();
  }
  updateLayout() {
    var height = window.innerHeight;
    var width = window.innerWidth;
    if (this.node) {
      this.node.style.height = height + 'px';
      var layout;
      if (this.modeLayout === 'A') {
        layout = layoutA(width, height);
      } else {
        layout = layoutB(width, height);
      }
      this.renderLayout(width, height, layout);
    }
  }
  hideInfoBar() {
    var height = window.innerHeight;
    var width = window.innerWidth;
    this.modeLayout = 'B';
    this.updateLayout();
  }
  showInfoBar() {
    var height = window.innerHeight;
    var width = window.innerWidth;
    this.modeLayout = 'A';
    this.updateLayout();
  }

  renderLayout(width, height, layout) {
    layout.divObj1 = {};
    layout.divObj2 = {};
    layout.divObj3 = {};

    var layoutTlArgs = {
      onComplete: this.layoutUpdated//,
      // onUpdate: ou
    };
    var arrTweens = [];
    for (let i = 0; i < this.layoutNodes.length; i++) {
      let comp = this.layoutNodes[i];
      let node = comp.node;
      let j = i + 1;
      var tw = new TweenMax.to(node, .5, { // eslint-disable-line new-cap
        width: 0,
        left: layout['l' + j],
        height: 0,
        top: layout['t' + j],
        ease: window.Power4.easeOut,
        force3D: true
      });
      let sizeWillUpdate = comp.sizeWillUpdate;
      if (sizeWillUpdate) {
        comp.sizeWillUpdate(layout['w' + j], layout['h' + j]);
      }
      arrTweens.push(tw);
    }

    var movesTl = new window.TimelineMax(layoutTlArgs);
    movesTl
        .add(arrTweens);
    movesTl.play();
  }
  layoutUpdated() {
    dispatchManager.dispatch('sizeUpdated');
  }
  render() {
    return (
      <div
        ref={(element) => {
          this.node = element;
        }}
        className={style.dashboardLayout}>
        {React.Children.map(this.props.children, (element, idx) => {
          return React.cloneElement(element, {
            ref: element.props.id
          });
        })}
      </div>
    );
  }
}

export default DashboardLayout;
