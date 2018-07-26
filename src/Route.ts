import * as React from 'react';
import {Router} from './Router';

export interface RouteProps {
    queryParams?: {[key: string]: string};
    render?: (params: {[key: string]: string}) => React.ReactElement<any>;
    component?: React.ReactElement<any>;
    path: string;
    exact: boolean;
}

interface RouteState {
    params?: string[];
    regex?: RegExp;
    path?: string;
    queryParams?: {[key: string]: string};
}

export class Route extends React.Component<RouteProps, RouteState> {
    private static paramNameRegex: RegExp = /(:[a-z]*)/gi;

    private static getDerivedStateFromProps(nextProps: RouteProps, prevState?: RouteState): RouteState {
        const path = nextProps.path;
        const paramNameRegex = Route.paramNameRegex;
        let params: string[] = path.match(paramNameRegex) || [];    // we match all params in form of :paramName

        let pattern = path
            .replace(/\//g, '\\/')
            .replace(/\?/g, '\\?');

        if (params.length > 0) {
            params = params.map(param => param.substring(1));
            pattern = pattern.replace(paramNameRegex, '([a-z0-9\\-]*)');
        }

        if (nextProps.exact) {
            pattern += '$';
        }

        return {
            params: params,
            regex: new RegExp(pattern),
            path: Router.getInstance().getPath(),
            queryParams: Router.getInstance().getQueryParams()
        };
    }

    constructor(props: RouteProps) {
        super(props);

        this.state = {};

        // since the router may be used on the server, we need to register the route here as componentDidMount is 
        // not called on SSR
        Router.getInstance().registerRoute(this);
    }

    sync(path: string, queryParams: {[key: string]: string}) {
        this.setState({path: path, queryParams: queryParams});
    }

    componentWillUnmount() {
        Router.getInstance().unregisterRoute(this);
    }

    render() {
        const props = this.props;
        const state = this.state;

        const path = state.path as string;
        const regex = state.regex as RegExp;
        const match = path.match(regex);
        const paramNames = state.params as string[];

        if (match) {
            const params: {[key: string]: string} = {};
            paramNames.forEach((param: string, index: number) => params[param] = match[index + 1]);

            const propsQueryParams = props.queryParams;
            const stateQueryParams = state.queryParams;
            if (propsQueryParams && stateQueryParams) {
                Object.keys(propsQueryParams)
                    .forEach(qp => params[propsQueryParams[qp]] = stateQueryParams[qp]);
            }

            if (props.component) {
                return React.cloneElement(props.component, params);
            }
            else if (props.render) {
                return props.render(params)
            }
        }

        return null;
    }
}
