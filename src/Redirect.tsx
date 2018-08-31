import * as React from 'react';
import { Router } from './Router';

interface Props {
    url: string;
}

export class Redirect extends React.Component<Props> {
    componentDidMount() {
        Router.getInstance().setLocation(this.props.url, {});
    }

    render() {
        return null;
    }
}
