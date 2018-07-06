import React, {Component} from 'react';
import styles from './style.css';

export default class Spiral extends Component {
  componentDidMount() {
  }

  render() {
    return (
      <div
        ref={(element) => {
          this.node = element;
        }}
        className={styles.test}>
        <span>xCIAOx</span>
      </div>
    );
  }
}
