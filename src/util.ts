import { Route } from "./Route";

const hashRegex = /#(\/[a-z0-9\/\-]*)/i;

/**
 * @param {string} url A URL to match the hash.
 */
export function readHash(url: string): string {
    const match = url.match(hashRegex);

    if (match === null) {
        return "";
    } else {
        return match[1];
    }
}

export function url(routeId: string, params: {[key: string]: any}): string {
    const route = Route.findRouteById(routeId);

    if (!route) {
        throw new Error(`Route "${routeId}" could not be identified.`);
    }

    return route.url(params);
}
