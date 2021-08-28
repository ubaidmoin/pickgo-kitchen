/*jshint esversion: 6 */

import PropTypes from 'prop-types';
import React from 'react';
import {requireNativeComponent} from 'react-native';

class AlanButton extends React.Component {
  render() {
    return <RNTAlanButton {...this.props} />;
  }
}

AlanButton.propTypes = {
  params: PropTypes.array,
};

var RNTAlanButton = requireNativeComponent('RNTAlanButton', AlanButton);

class AlanView extends React.Component {
  render() {
    return <AlanButton params={[this.props.projectid, this.props.host, this.props.authData, '1.1.0']}/>;
  }
}

AlanView.propTypes = {
  projectid: PropTypes.string,
  host: PropTypes.string,
  authData: PropTypes.object,
};

module.exports = {
  AlanView: AlanView,
};
