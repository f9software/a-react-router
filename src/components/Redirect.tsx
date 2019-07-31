import * as React from 'react';
import { Router } from '../Router';

interface Props {
    url: string;
}

export function Redirect(props: Props) {
    React.useEffect(
        () => Router.getInstance().setLocation(props.url, {}),
        []
    );

    return null;
}
