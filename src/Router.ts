import {Observable} from 'ii-observable';
import { Route, RouteMatch } from './Route';

export class Router extends Observable {
    private static instance: Router;

    public static getInstance(): Router {
        if (!this.instance) {
            this.instance = new Router();
        }

        return this.instance;
    }

    // current path
    private path: string = '';

    // current query params
    private queryParams: {[key: string]: string} = {};

    // registered routes
    private routes: Route[] = [];

    protected initEvents() {
        return [
            'locationchange'
        ];
    }

    /**
     * Set current location.
     * @param path 
     * @param queryParams 
     */
    public setLocation(path: string, queryParams: {[key: string]: string}): void {
        this.path = path;
        this.queryParams = queryParams;

        // fire the event
        this.fireEvent('locationchange', path, queryParams);

        // match routes and update component state
        for (let i = 0; i < this.routes.length; i++) {
            this.matchRoute(this.routes[i]);
        }
    }

    private matchRoute(route: Route): RouteMatch | null {
        const match = route.match(this.path);
        route.updateComponents(match);
        return match;
    }

    public getPath(): string {
        return this.path;
    }

    public getQueryParams(): {[key: string]: string} {
        return this.queryParams;
    }

    public registerRoute(route: Route) {
        this.routes.push(route);
        this.matchRoute(route);
    }

    public unregisterRoute(route: Route) {
        const index = this.routes.indexOf(route);

        if (index > -1) {
            this.routes.splice(index, 1);
        }
    }

    public clear() {
        this.routes = [];
        this.path = '';
        this.queryParams = {};
    }
}
