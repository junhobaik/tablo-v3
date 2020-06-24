/* eslint-disable no-prototype-builtins */

import * as React from 'react';
import './index.scss';

interface Props {
  children: any;
}

interface State {
  hasError: boolean;
  error: string;
}

class BoundaryError extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: '',
    };
  }

  componentDidCatch() {
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError)
      return (
        <div id="BoundaryError">
          <h1>ERROR!</h1>
          {this.state.error.length ? <span>{this.state.error}</span> : null}
        </div>
      );
    else return this.props.children;
  }
}

export default BoundaryError;
