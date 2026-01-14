/**
 * Service to manage fetch interceptions.
 * This is primarily used for development and testing purposes to inject headers or log requests.
 */
export class FetchInterceptorService {
    private originalFetch = window.fetch;
    private _isEnabled = false;

    /**
     * Checks if the interceptor is currently enabled.
     * @returns boolean
     */
    public get isEnabled(): boolean {
        return this._isEnabled;
    }

    /**
     * Initializes the fetch interceptor.
     * Adds a test Authorization header to all outgoing fetch requests.
     * This method should only be called in development environments.
     */
    public init(): void {
        if (this._isEnabled) return;

        const self = this;
        window.fetch = async function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
            try {
                // Create headers if they don't exist
                const headers = new Headers(init?.headers || {});

                // Add test authorization header if it doesn't exist
                // Using VITE_TEST_AUTH_TOKEN from environment if available
                const token = import.meta.env.VITE_TEST_AUTH_TOKEN;
                if (token && !headers.has('Authorization')) {
                    headers.append('Authorization', `Bearer ${token}`);
                }

                // Call original fetch with updated config
                return self.originalFetch(input, { ...init, headers });
            } catch (error) {
                return Promise.reject(error);
            }
        };

        this._isEnabled = true;
        console.log('Fetch interceptor initialized with test Authorization header (Native implementation).');
    }

    /**
     * Disables the fetch interceptor.
     */
    public destroy(): void {
        if (this._isEnabled) {
            window.fetch = this.originalFetch;
            this._isEnabled = false;
            console.log('Fetch interceptor destroyed (Native implementation).');
        }
    }
}

/**
 * Singleton instance of the FetchInterceptorService.
 */
export const fetchInterceptorService = new FetchInterceptorService();
