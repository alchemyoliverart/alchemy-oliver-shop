import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="not-found">
          <span className="not-found-code">oops</span>
          <p className="not-found-message">something went wrong</p>
          <button
            className="not-found-link"
            onClick={() => { this.setState({ hasError: false }); window.location.href = '/'; }}
          >
            ← back home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
