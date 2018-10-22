import * as React from 'react';
import { Router } from './Router';

export interface Props {
    // onHashChange: () => boolean | undefined;
    interceptHashChange: (url: string, oldUrl: string) => string | undefined;
}

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
        const intercept = this.props.interceptHashChange;
        let redirectUrl = '';

        if (intercept) {
            const interceptUrl = intercept(hashUrl, this.state.url);

            if (interceptUrl !== undefined && interceptUrl !== hashUrl) {
                // redirect
                redirectUrl = interceptUrl;
            }
        }

        if (redirectUrl === '') {
            this.setState({url: hashUrl});
            this.updateRouter(hashUrl);
        }
        else {
            window.location.href = '#' + redirectUrl;
        }
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
