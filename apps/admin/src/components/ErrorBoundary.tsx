import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert variant="destructive" className="z-50 mx-12 my-3">
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>
            {this.state.error && this.state.error.toString()}
          </AlertDescription>
        </Alert>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
