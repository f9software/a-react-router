import * as React from 'react';
import { Router } from './Router';

export interface Props {}   

interface State {
    url: string;
}

export class HashRouter extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        const hashUrl = this.readHashUrl();
        this.state = {
            url: hashUrl
        };
        this.updateRouter(hashUrl);
        
        this.onHashChange = this.onHashChange.bind(this);
    }

    private updateRouter(url: string) {
        Router.getInstance().setLocation(url, {});
    }

    private onHashChange(e: HashChangeEvent) {
        const hashUrl = this.readHashUrl();
        this.setState({url: hashUrl});
        this.updateRouter(hashUrl);
    }

    componentDidMount() {
        window.addEventListener('hashchange', this.onHashChange);
    }

    componentWillUnmount() {
        window.removeEventListener('hashchange', this.onHashChange);
    }

    private readHashUrl() {
        const hash = window.location.hash;
        let url = '/';

        if (hash.length > 0) {
            url = hash.substring(1);
        }

        return url;
    }

    render() {
        return this.props.children;
    }
}
