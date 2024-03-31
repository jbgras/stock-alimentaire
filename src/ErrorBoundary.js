import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }
  
    static getDerivedStateFromError(error) {
      return { hasError: true };
    }
  
    componentDidCatch(error, errorInfo) {
      console.log(error, errorInfo);
    }
  
    render() {
      if (this.state.hasError) {
        return <div>
            <h1>Une erreur s'est produite.</h1>
            <p>this.state.error</p>
            <p>this.state.errorInfo</p>
        </div>;
      }
      return this.props.children; 
    }
  }

  export default ErrorBoundary
