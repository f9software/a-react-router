import {Router} from './Router';
import * as React from 'react';

interface State {
    url: string;
}

export class BrowserRouter extends React.Component<any, State> {
    private static instance?: BrowserRouter;

    public static pushState(url: string) {
        history.pushState('', '', url);
        Router.getInstance().setLocation(url, {});

        if (BrowserRouter.instance) {
            BrowserRouter.instance.setState({url: url});
        }
    }

    constructor(props: any = undefined) {
        super(props);

        this.state = {
            url: ''
        };

        this.onPopState = this.onPopState.bind(this);
    }

    componentDidMount() {
        window.addEventListener('popstate', this.onPopState);
        BrowserRouter.instance = this;
        BrowserRouter.pushState(window.location.pathname);
    }

    componentWillUnmount() {
        window.removeEventListener('popstate', this.onPopState);
        BrowserRouter.instance = undefined;
    }

    private onPopState(state: any) {
        Router.getInstance().setLocation(window.location.pathname, {});
    }

    render() {
        return (this.props.children);
    }
}
