/**
 * Request interceptor for the Axios clients that talk to the WordPress REST API.
 * Some hosts cannot send PUT, PATCH or DELETE, so those requests go out as POST and
 * WordPress routes them by the original method (WP_REST_Server::serve_request).
 *
 * The original method goes in the X-HTTP-Method-Override header, like the core
 * api-fetch does, and not in a `_method` query parameter: firewalls such as
 * Cloudflare managed rules and ModSecurity often block `_method` in the URL.
 * See https://developer.wordpress.org/rest-api/using-the-rest-api/global-parameters/#method
 */

const TUNNELED_METHODS = ['put', 'patch', 'delete'];

/**
 * @param {object} config Axios request config.
 * @returns {object}
 */
export function tunnelRestMethod(config) {
    if (!config.method || !TUNNELED_METHODS.includes(config.method.toLowerCase()))
        return config;

    const originalMethod = config.method.toUpperCase();

    config.method = 'post';

    if (config.headers && typeof config.headers.set === 'function')
        config.headers.set('X-HTTP-Method-Override', originalMethod);
    else
        config.headers = { ...(config.headers || {}), 'X-HTTP-Method-Override': originalMethod };

    return config;
}
