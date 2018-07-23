import * as React from 'react';
import {BrowserRouter} from './BrowserRouter';

export class Link extends React.Component<React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>> {
    constructor(props: React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick(e: React.MouseEvent<HTMLAnchorElement>) {
        e.preventDefault();
        BrowserRouter.pushState((e.target as HTMLAnchorElement).href);
    }

    render() {
        return React.createElement('a', {
            ...this.props,
            onClick: this.onClick
        });
    };
}
