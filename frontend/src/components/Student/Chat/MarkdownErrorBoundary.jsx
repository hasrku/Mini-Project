import React from "react";

export default class MarkdownErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return <div className="text-red-600 text-xs italic">Failed to render markdown.</div>;
        }
        return this.props.children;
    }
}
