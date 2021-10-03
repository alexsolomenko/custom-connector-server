export class OAuthErrors {
	/** @see https://tools.ietf.org/html/rfc6749#section-4.1.2.1 */
	static AccessDenied(message?: string): Error {
		return new OAuthError(
			message ? message : 'The resource owner or authorization server denied the request.', 
			400, 
			'access_denied');
	}

	/** @see https://tools.ietf.org/html/rfc6750.html#section-3.1 */
	static InsufficientScope(message?: string): Error {
		return new OAuthError(
			message ? message : 'The request requires higher privileges than provided by the access token.', 
			403, 
			'insufficient_scope');
	}

	/** @see https://tools.ietf.org/html/rfc6749#section-5.2 */
	static InvalidClient(message?: string): Error {
		return new OAuthError(
			message ? message : 'Client authentication failed.', 
			400, 
			'invalid_client');
	}

	static InvalidArgument(message?: string): Error {
		return new OAuthError(
			message ? message : 'Invalid argument.', 
			500, 
			'invalid_argument');
	}

	/** @see https://tools.ietf.org/html/rfc6749#section-5.2 */
	static InvalidGrant(message?: string): Error {
		return new OAuthError(
			message ? message : 'The provided authorization grant is invalid.', 
			400, 
			'invalid_grant');
	}

	/** @see https://tools.ietf.org/html/rfc6749#section-4.2.2.1 */
	static InvalidRequest(message?: string): Error {
		return new OAuthError(
			message ? message : 'The request is missing a required parameter, includes an invalid parameter value or is otherwise malformed.', 
			400, 
			'invalid_request');
	}

	/** @see https://tools.ietf.org/html/rfc6749#section-4.1.2.1 */
	static InvalidScope(message?: string): Error {
		return new OAuthError(
			message ? message : 'The requested scope is invalid, unknown, or malformed.', 
			400, 
			'invalid_scope');
	}

	/** @see https://tools.ietf.org/html/rfc6750#section-3.1 */
	static InvalidToken(message?: string): Error {
		return new OAuthError(
			message ? message : 'The access token provided is expired, revoked, malformed, or invalid for other reasons.', 
			401, 
			'invalid_token');
	}

	/** @see https://tools.ietf.org/html/rfc6749#section-4.1.2.1 */
	static ServerError(message?: string): Error {
		return new OAuthError(
			message ? message : 'The authorization server encountered an unexpected condition that prevented it from fulfilling the request.', 
			503, 
			'server_error');
	}

	/** @see https://tools.ietf.org/html/rfc6749#section-4.1.2.1 */
	static UnauthorizedClient(message?: string): Error {
		return new OAuthError(
			message ? message : 'The client is not authorized to request an authorization code using this method.', 
			400, 
			'unauthorized_client');
	}

	/** @see https://tools.ietf.org/html/rfc6750#section-3.1 */
	static UnauthorizedRequest(message?: string): Error {
		return new OAuthError(
			message ? message : 'The request lacks any authentication information.', 
			401, 
			'unauthorized_request');
	}

	/** @see https://tools.ietf.org/html/rfc6749#section-5.2 */
	static UnsupportedGrandType(message?: string): Error {
		return new OAuthError(
			message ? message : 'The authorization grant type is not supported by the authorization server.', 
			400, 
			'unsupported_grant_type');
	}

	/** @see https://tools.ietf.org/html/rfc6750#section-3.1 */
	static UnsupportedResponseType(message?: string): Error {
		return new OAuthError(
			message ? message : 'The authorization server does not support obtaining an authorization code using this method.',
			400, 
			'unsupported_response_type');
	}
}

export class OAuthError extends Error {
	constructor(message: string, http_code?: number, name?: string) {
		super(message);
		this.name = name;
		this['code'] = http_code;
	}
}