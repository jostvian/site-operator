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
                    headers.append('Authorization', 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6InhmcDRfR0tObWNBMHl3UUNrZ1BXVkJjTHZmRDVfZXZKOWg3bUhGbExBVWMiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiIwZWZhNWFhNy04OWRiLTQ5MTYtYmZlNC0wNTM3MjhlZWY2M2QiLCJpc3MiOiJodHRwczovL3NrY290ZXN0LmIyY2xvZ2luLmNvbS8wZGI2ZGJjMy02OTA4LTQ1MTctYTdmMi04MWVhNjg1YTI1ZTIvdjIuMC8iLCJleHAiOjE3NjgyODQ0MTIsIm5iZiI6MTc2ODI4MzUxMiwibmFtZSI6IlZpYW5hIFZlbGFzcXVleiwgSm9zZSBTdGV2ZW4iLCJpZHBfYWNjZXNzX3Rva2VuIjoiZXlKMGVYQWlPaUpLVjFRaUxDSnViMjVqWlNJNkltUm9ObWRsV1U0MWREZEJWbVI1WlhGVVlpMUljbVptUVUxNk5WaFFlRnAyTUhsNmVVRXdhVUZqWldNaUxDSmhiR2NpT2lKU1V6STFOaUlzSW5nMWRDSTZJbEJqV0RrNFIxZzBNakJVTVZnMmMwSkVhM3BvVVcxeFozZE5WU0lzSW10cFpDSTZJbEJqV0RrNFIxZzBNakJVTVZnMmMwSkVhM3BvVVcxeFozZE5WU0o5LmV5SmhkV1FpT2lJd01EQXdNREF3TXkwd01EQXdMVEF3TURBdFl6QXdNQzB3TURBd01EQXdNREF3TURBaUxDSnBjM01pT2lKb2RIUndjem92TDNOMGN5NTNhVzVrYjNkekxtNWxkQzh3T0RJM01XWTBNaTA0TVdWbUxUUTFaRFl0T0RGaFl5MDBPVGMzTm1NMFltVTJNVFV2SWl3aWFXRjBJam94TnpZNE1qVXhPVGM0TENKdVltWWlPakUzTmpneU5URTVOemdzSW1WNGNDSTZNVGMyT0RJMU5qQXpNU3dpWVdOamRDSTZNQ3dpWVdOeUlqb2lNU0lzSW1GamNuTWlPbHNpY0RFaVhTd2lZV2x2SWpvaVFWcFJRV0V2T0dGQlFVRkJjbVp4VlZaWWNUUm1SRGM1ZEVKS2NHTlVZVGxSV1dkQ1FtZ3ZNVmgzV1RCdmVXb3hSbEl4Vms1bldXMVdRekZSYWpWMFYybFlUazVSZURsdVRVZG9lSGhEYzAxdVFWVTJUbWhXV1dkQ2RWZ3liREZXTVZkeFdrbGtielExSzNKbFVGTjRlWEUwWm5wRk5ISkZObUV2UzBaUk0ySk9jV1F6VjBOMFIyMW9WbEpKTUZoaVYxVnhURWh2ZW5keVUzWmtVRk5vU1RRdk4weDJaM1pST0ZablZHOUdWbmwyVkV3eldIbDJNSGM1THprdk4xRmhTa1Y1YWpSd05IRmxPSE5CSWl3aVlXMXlJanBiSW5CM1pDSXNJbTFtWVNKZExDSmhjSEJmWkdsemNHeGhlVzVoYldVaU9pSkVZV3hwTFZCeVpDSXNJbUZ3Y0dsa0lqb2laR1prTURrNVlqQXRaV05pT1MwME0yVTFMV0kzWWpjdE5USTVObUk0TUdFME5qSXdJaXdpWVhCd2FXUmhZM0lpT2lJeElpd2labUZ0YVd4NVgyNWhiV1VpT2lKV2FXRnVZU0JXWld4aGMzRjFaWG9pTENKbmFYWmxibDl1WVcxbElqb2lTbTl6WlNCVGRHVjJaVzRpTENKcFpIUjVjQ0k2SW5WelpYSWlMQ0pwY0dGa1pISWlPaUl6T0M0NUxqSXlNQzR4TXpJaUxDSnVZVzFsSWpvaVZtbGhibUVnVm1Wc1lYTnhkV1Y2TENCS2IzTmxJRk4wWlhabGJpSXNJbTlwWkNJNkltVXdNbU0wTmpaakxXVTVaRGd0TkdGa01pMDVaVGhrTFdReFltUTJObUV6TkRNd01pSXNJbTl1Y0hKbGJWOXphV1FpT2lKVExURXROUzB5TVMweU5EZzVPVGM1T1RRd0xUSTFOVEl3TVRnM016RXRNVGN3TWpjeE9UTTFPUzB5TVRrNE1DSXNJbkJzWVhSbUlqb2lPQ0lzSW5CMWFXUWlPaUl4TURBek1qQXdNVUV4UWpCQ016azBJaXdpY21naU9pSXhMa0ZVVVVGUmFEaHVRMDh0UWpGclYwSnlSV3d6WWtWMmJVWlJUVUZCUVVGQlFVRkJRWGRCUVVGQlFVRkJRVUZDVVVGUmF6QkJRUzRpTENKelkzQWlPaUpOWVdsc0xsSmxZV1FnVFdGcGJDNVRaVzVrSUc5d1pXNXBaQ0J3Y205bWFXeGxJRlZ6WlhJdVVtVmhaQ0JsYldGcGJDSXNJbk5wWkNJNklqQXdNVEJoT1dKaExUVTFOakV0WXpoa01DMWtPRGd3TFRKak9HSmhNRGRqTVdJME15SXNJbk5wWjI1cGJsOXpkR0YwWlNJNld5SnJiWE5wSWwwc0luTjFZaUk2SW5GaFNsbFhNelEzT0RWcFdFUktVbDlyYVZCa1NuSm5VWGhoVGs5d1RsaHRhVmhFV0dVM1NVTktaMWtpTENKMFpXNWhiblJmY21WbmFXOXVYM05qYjNCbElqb2lVMEVpTENKMGFXUWlPaUl3T0RJM01XWTBNaTA0TVdWbUxUUTFaRFl0T0RGaFl5MDBPVGMzTm1NMFltVTJNVFVpTENKMWJtbHhkV1ZmYm1GdFpTSTZJbXAyYVdGdVlVQnphMkZ1WkdsaExtTnZiUzVqYnlJc0luVndiaUk2SW1wMmFXRnVZVUJ6YTJGdVpHbGhMbU52YlM1amJ5SXNJblYwYVNJNkltdzVRa2d5TUROSFN6QlhWSFZJVDNwSlFuUkRRVUVpTENKMlpYSWlPaUl4TGpBaUxDSjNhV1J6SWpwYkltSTNPV1ppWmpSa0xUTmxaamt0TkRZNE9TMDRNVFF6TFRjMllqRTVOR1U0TlRVd09TSmRMQ0o0YlhOZllXTmtJam94TnpVeU5UZzVNVEk0TENKNGJYTmZZV04wWDJaamRDSTZJak1nT1NJc0luaHRjMTltZEdRaU9pSnlhVmRyYUVFMlVWQkZaSEZzV0ZKMlRuWnhjWEF6YlRrd1ZISm1ZMEZDWWs0dE9FRk5NVFZpU1hOM1FtUllUbXhaV0U0d1RGZFNlbUpZVFNJc0luaHRjMTlwWkhKbGJDSTZJakUySURFaUxDSjRiWE5mYzNRaU9uc2ljM1ZpSWpvaWMzUkNiazAzV25FME1td3hVa1l5ZEV0RU1GaEJVbVpoVGtOUlFXOW9WbTFmVUZWWFltSnJSbDlST0NKOUxDSjRiWE5mYzNWaVgyWmpkQ0k2SWpNZ01pSXNJbmh0YzE5MFkyUjBJam94TXprek5qQXpNelF4TENKNGJYTmZkRzUwWDJaamRDSTZJallnTXlKOS5nQXdZNlFJQ1hnTDlScjY4ay1vQUktemZIdHdXbi0yd2RTNU9iTk9KVXd6UWdvUTBHdGR0ZzRVUkh6NElXZzlVOEJJVlgxazh3RnhEbDkxcEJwajB3cW1mT2NlUWhoSHEtRXp4Uzd5SG4teC05aDhzbl9XeUl4cDB5aWJmdWZLZGVCdmhJcGdYODdTU0gwY0g0eDhwX19WSEJCekhKSlpzY0RidVl2My1PaHYyQ1R0aTJyck0tUzVuMXhtQmpQaVdEWVUtTmZQUkZ3R1hBUHJWaXdyQXBCV01VQkduaDc5VF9yVHBZNl8xSklkSGxKbHVVVXYwZmE1dW50bW0tOV9pcUgyWlUyOTMxZUVJV25KZ3NUckpqWkZGUGFVZTZQejZxUkEyQUxnUW9zUXVQcVFoM2NPb1VfNmIxUjFranlFRDdIbG5fUjNST1RfVnFiV3hfenpnUlEiLCJzdWIiOiI4ODIwZDZiNi03MjViLTQwNDQtYWRjYi1hM2UxOGEzOGU0ZmMiLCJnaXZlbl9uYW1lIjoiSm9zZSBTdGV2ZW4iLCJmYW1pbHlfbmFtZSI6IlZpYW5hIFZlbGFzcXVleiIsImVtYWlsIjoianZpYW5hQHNrYW5kaWEuY29tLmNvIiwibm9uY2UiOiIwMTliYjQwYy03NmViLTc2YWMtOTQzMy1iODQxMDM0MTI1MmIiLCJhenAiOiIwZWZhNWFhNy04OWRiLTQ5MTYtYmZlNC0wNTM3MjhlZWY2M2QiLCJ2ZXIiOiIxLjAiLCJpYXQiOjE3NjgyODM1MTJ9.pCtGcB5Eyhc3yQEfOLVJMK_7HpEUufhtBLT55z1qbW7Zq8bEZiuLL2ChDXMgAAQb1PLRnlm2JcA9nbWlsVC1lVwfscKUNMGEL5N3Wrm6SbNAMbsflmIdEwFpeTDMaVct8BmTIg5qhQn83C7WpVwxnIoLNt9C1mgtmN3LdV2mqYY3M1nnWO3WqkZ4fVI4dtaBWKjl2SQdww1sUACV9SgbqYA83DGfc1wpA7F9_XsYUYZWR8XxsRNCETPqfMa_pG6f18clMBXkSH-Tj-KXha-EACAEQc_7ZEfujlph4cDJiSbQlVli7AO15J6pblkkd4JZY2KJZ2BZgYvU7SROHFXW9Q');
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
