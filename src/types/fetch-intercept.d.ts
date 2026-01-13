declare module 'fetch-intercept' {
    export interface Interceptor {
        request?(url: string, config: any): any[] | Promise<any[]>;
        requestError?(error: any): any | Promise<any>;
        response?(response: Response): Response | Promise<Response>;
        responseError?(error: any): any | Promise<any>;
    }

    export function register(interceptor: Interceptor): () => void;
    export function unregister(): void;
    export function clear(): void;

    const fetchIntercept: {
        register: typeof register;
        unregister: typeof unregister;
        clear: typeof clear;
    };

    export default fetchIntercept;
}
