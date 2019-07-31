import * as React from 'react';
import { Router } from '../Router';
import { readHash } from '../util';
import * as qs from 'qs';

function onHashChange() {
    const hashUrl = readHash(window.location.hash);
    Router.getInstance().setLocation(hashUrl, qs.parse(window.location.search));
}

export function HashRouter(props: {children: React.ReactChildren}) {
    React.useEffect(
        () => {
            window.addEventListener('hashchange', onHashChange);
            return () => window.removeEventListener('hashchange', onHashChange);
        },
        []
    );

    return props.children;
}
