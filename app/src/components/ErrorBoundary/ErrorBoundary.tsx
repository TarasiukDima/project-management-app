import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { ROUTES_PATHS } from '$settings/routing';

interface IProps {
  children: ReactNode;
}

interface IState {
  hasError: boolean;
  errorText: string;
}

class ErrorBoundary extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { hasError: false, errorText: '' };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorText: error.message };
  }

  showErrorPage = () => {
    const errorText = this.state.errorText;
    this.setState({ hasError: false, errorText: '' });
    return <Navigate to={ROUTES_PATHS.error_page} replace state={{ errorText }} />;
  };

  render() {
    if (this.state.hasError) {
      return this.showErrorPage();
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
