import { Request, Response } from "express";
import { Utils } from "./utils";
import { GRANT_TYPE, IOAuthModel, RESPONSE_TYPE } from "./entities";
import { OAuthErrors } from "./errors";
import { AuthorizationCode } from "./handlers/authorize_code";
import { AuthorizationToken } from "./handlers/authorize_token";
import { ProcessLogin } from "./handlers/process_login";
import { ProcessTest } from "./handlers/process_test";

export class OAuth2Server {
	model: IOAuthModel;
	constructor(model: IOAuthModel) {
		this.model = model;
	}

	authorizeCode = (req: Request, res: Response, next: any): Promise<any> => {
		if (Utils.getValue(req.query, 'response_type') == RESPONSE_TYPE.code)
			return new AuthorizationCode(req, res, this.model).handle().catch(err => next(err));
		else
			return next(OAuthErrors.UnsupportedResponseType());
	}

	processLogin = (req: Request, res: Response, next: any): Promise<any> => {
		if (Utils.getValue(req.query, 'response_type') == RESPONSE_TYPE.login)
			return new ProcessLogin(req, res, this.model).handle().catch(err => next(err));
		else
			return next(OAuthErrors.UnsupportedResponseType());
	}

	authorizeAccessToken = (req: Request, res: Response, next: any): Promise<any> => {
		if (Utils.getValue(req.body, 'grant_type') == GRANT_TYPE.authorizationCode)
			return new AuthorizationToken(req, res, this.model).handle().catch(err => next(err));
		else
			return next(OAuthErrors.UnsupportedGrandType);
	}

	processTest = (req: Request, res: Response, next: any): Promise<any> => {
		return new ProcessTest(req, res, this.model).handle().catch(err => next(err));
	}
}