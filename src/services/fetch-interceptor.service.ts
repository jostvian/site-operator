import fetchIntercept from 'fetch-intercept';

/**
 * Service to manage fetch interceptions.
 * This is primarily used for testing purposes to inject headers or log requests.
 */
export class FetchInterceptorService {
    private unregister: (() => void) | null = null;

    /**
     * Initializes the fetch interceptor.
     * Adds a test Authorization header to all outgoing fetch requests.
     */
    public init(): void {
        if (this.unregister) {
            this.unregister();
        }

        this.unregister = fetchIntercept.register({
            request: (url, config) => {
                // Create headers if they don't exist
                const headers = new Headers(config.headers || {});

                // Add test authorization header if it doesn't exist
                if (!headers.has('Authorization')) {
                    headers.append('Authorization', 'Bearer test-token-123');
                }

                // Return updated config
                return [url, { ...config, headers }];
            },

            requestError: (error) => {
                return Promise.reject(error);
            },

            response: (response) => {
                return response;
            },

            responseError: (error) => {
                return Promise.reject(error);
            }
        });

        console.log('Fetch interceptor initialized with test Authorization header.');
    }

    /**
     * Disables the fetch interceptor.
     */
    public destroy(): void {
        if (this.unregister) {
            this.unregister();
            this.unregister = null;
            console.log('Fetch interceptor destroyed.');
        }
    }
}

export const fetchInterceptorService = new FetchInterceptorService();
