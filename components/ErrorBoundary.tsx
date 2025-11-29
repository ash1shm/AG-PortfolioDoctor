import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(_: Error): State {
        // Update state so the next render shows the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // You can also log the error to an error reporting service
        console.error('ErrorBoundary caught an error', error, errorInfo);
        this.setState({ error });
    }

    render() {
        if (this.state.hasError) {
            return (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-red-600">Something went wrong</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-700">
                            An unexpected error occurred. Please try refreshing the page or contact support.
                        </p>
                        {this.state.error && (
                            <pre className="mt-2 text-xs text-gray-500 whitespace-pre-wrap">
                                {this.state.error.message}
                            </pre>
                        )}
                    </CardContent>
                </Card>
            );
        }

        return this.props.children;
    }
}
