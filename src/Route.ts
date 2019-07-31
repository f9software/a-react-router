import { Router } from "./Router";
import { Route as RouteComponent } from './components/Route';

const map: Record<string, Route> = {};

const regexUrlParamName = /:(\w+)/ig;

/**
 * Example url: /leaderboard/:userId/:exchangeId
 * 
 * Result:
 * {
 *  regexp: /leaderboard/(.*)/(.*),
 *  params: ['userId', 'exchangeId']
 * }
 * 
 * @param url 
 */
function buildMetadata(url: string): RouteMetadata {
    const matchedUrl = url;
    const params: string[] = [];

    let match: RegExpMatchArray | null = null;
    while (match = matchedUrl.match(regexUrlParamName)) {
        matchedUrl.replace(match[1], '(\\w+)');
        params.push(match[1]);
    }

    const metadata = {
        path: url,
        regex: new RegExp(matchedUrl),
        params,
    };

    Object.freeze(metadata);

    return metadata;
}

export interface RouteMetadata {
    path: string;   // /leaderboard/:userId/:exchangeId
    regex: RegExp;  // /\/leaderboard\/(.*)\/:exchangeId/i
    params: string[];   // ['userId', 'exchangeId']
}

export interface RouteMatch {
    path: string;
    params: {[name: string]: string} | null;
}

export class Route {
    public static findRouteById(id: string): Route | undefined {
        return map[id];
    }

    private metadata: RouteMetadata;
    private components: RouteComponent[] = [];

    public constructor(private readonly id: string, private path: string) {
        map[id] = this;

        this.metadata = buildMetadata(path);
        Router.getInstance().registerRoute(this);
    }

    public getId() {
        return this.id;
    }

    public getPath() {
        return this.path;
    }

    public getMetadata() {
        return this.metadata;
    } 

    public registerComponent(component: RouteComponent) {
        this.components.push(component);
    }

    public unregisterComponent(component: RouteComponent) {
        const index = this.components.indexOf(component);
        if (index > -1) {
            this.components.splice(index, 1);
        }
    }

    public match(path: string): RouteMatch | null {
        const md = this.metadata;
        const match = path.match(md.regex);

        if (!match) {
            return null;
        }

        let params: {[key: string]: string} | null = null;
        if (md.params) {
            params = {};
            md.params.forEach(
                (name, index) => {
                    params![name] = match[index + 1];
                }
            );
        }

        return {
            path,
            params,
        };
    }

    public updateComponents(match: RouteMatch | null) {
        this.components.forEach((c) => c.setState({match}));
    }

    public url(params: {[key: string]: string}) {
        const md = this.metadata;
        let url = md.path;

        md.params
            .sort((a, b) => a.length - b.length)
            .forEach((p) => url = url.replace(':' + p, params[p]));

        return url;
    }

    public destroy() {
        Router.getInstance().unregisterRoute(this);
    }
}
