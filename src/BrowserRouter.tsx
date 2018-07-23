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

    constructor() {
        super({});

        this.state = {
            url: window.location.pathname
        };

        this.onPopState = this.onPopState.bind(this);
    }

    componentDidMount() {
        window.addEventListener('popstate', this.onPopState);
        BrowserRouter.instance = this;
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
