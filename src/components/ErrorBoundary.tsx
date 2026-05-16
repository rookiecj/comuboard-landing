import { Component, type ErrorInfo, type ReactNode } from "react";
import * as Sentry from "@sentry/react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * STORY-189-03: Top-level React error boundary for the Landing site.
 *
 * Renders a friendly fallback and forwards the exception (with the React
 * component stack as scope extra) to Sentry via `componentDidCatch`.
 */
export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    Sentry.withScope((scope) => {
      scope.setTag("errorBoundary", "landing-global");
      scope.setExtra("componentStack", errorInfo.componentStack ?? "");
      Sentry.captureException(error);
    });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div
          role="alert"
          className="flex flex-col items-center justify-center min-h-screen px-4 text-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50"
        >
          <div className="text-6xl font-bold text-slate-300 dark:text-slate-600 mb-4">
            500
          </div>
          <h1 className="text-2xl font-semibold mb-2">
            잠시 후 다시 시도해 주세요
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md">
            페이지를 표시하던 중 문제가 생겼어요. 새로고침하면 계속 이용할 수
            있어요!
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            새로고침
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
