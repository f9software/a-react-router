import * as React from 'react';
import {Route as DRoute, RouteMatch} from '../Route';

export interface RouteProps {
    id: string;
    render?: (params: {[key: string]: string}) => React.ReactElement<any>;
    component?: React.ReactElement<any>;
}

export interface RouteState {
    match: RouteMatch | null;
}

export class Route extends React.Component<RouteProps, RouteState> {
    private route: DRoute | undefined;

    constructor(props: RouteProps) {
        super(props);

        let route = DRoute.findRouteById(props.id)
        if (!route) {
            throw new Error(`Route "${props.id}" could not be found.`);
        }

        (this.route = route).registerComponent(this);
    }

    componentWillUnmount() {
        if (this.route) {
            this.route.unregisterComponent(this);
            this.route = undefined;
        }
    }

    render() {
        const props = this.props;
        const {match} = this.state;

        if (match) {
            if (props.component) {
                return React.cloneElement(props.component, match.params || {});
            }
            else if (props.render) {
                return props.render(match.params || {})
            }
        }

        return null;
    }
}
