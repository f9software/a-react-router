import {Route} from "./Route";

export class Router {
    private static instance: Router;

    public static getInstance(): Router {
        if (!this.instance) {
            this.instance = new Router();
        }

        return this.instance;
    }

    private path: string = '';

    private queryParams: {[key: string]: string} = {};

    private routes: Route[] = [];

    public setLocation(path: string, queryParams: {[key: string]: string}): void {
        this.path = path;
        this.queryParams = queryParams;

        this.routes.forEach(route => route.sync(path, queryParams));
    }

    public getPath(): string {
        return this.path;
    }

    public getQueryParams(): {[key: string]: string} {
        return this.queryParams;
    }

    public registerRoute(route: Route) {
        this.routes.push(route);
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
