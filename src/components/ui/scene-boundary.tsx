"use client";

import { Component, type ReactNode } from "react";

/** Keep unsupported WebGL drivers from interrupting the portfolio. */
export class SceneBoundary extends Component<
  { children: ReactNode; fallback: ReactNode; onFailure?: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFailure?.();
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
