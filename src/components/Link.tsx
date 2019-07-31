import * as React from 'react';
import {BrowserRouter} from './BrowserRouter';

export class Link extends React.Component<React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>> {
    constructor(props: React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick(e: React.MouseEvent<HTMLAnchorElement>) {
        // if user presses ctrl/command key, then we don't want to let it run with the default behaviour
        if (e.ctrlKey || e.metaKey) {
            return;
        }

        e.preventDefault();
        BrowserRouter.pushState(e.currentTarget.href);
    }

    render() {
        return React.createElement('a', {
            ...this.props,
            onClick: this.onClick
        });
    };
}
