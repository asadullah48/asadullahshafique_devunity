"use client";

import { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  name?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`ErrorBoundary caught error in ${this.props.name || "component"}:`, error, errorInfo);
    
    // Send to error tracking service (Sentry, etc.)
    if (typeof window !== "undefined") {
      // Example: Sentry.captureException(error, { extra: { componentStack: errorInfo.componentStack } });
      console.error("Component stack:", errorInfo.componentStack);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-4">
          <Card className="bg-red-900/20 border-red-800 max-w-md w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-400">
                <AlertTriangle className="w-5 h-5" />
                Something went wrong
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-red-300">
                <p className="font-semibold mb-2">
                  {this.props.name ? `Error in ${this.props.name}` : "Component error"}
                </p>
                <p className="text-xs text-red-400 font-mono bg-red-950/50 p-2 rounded">
                  {this.state.error?.message || "Unknown error"}
                </p>
              </div>
              <Button
                onClick={this.handleReset}
                className="w-full bg-red-800 hover:bg-red-700 text-white"
              >
                <RefreshCcw className="w-4 h-4 mr-2" />
                Reload Page
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
