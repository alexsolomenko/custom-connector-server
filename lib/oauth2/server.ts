import { Request, Response } from "express";
import { Utils } from "./utils";
import { IOAuthModel, RESPONSE_TYPE } from "./entities";
import { OAuthErrors } from "./errors";
import { AuthorizationCode } from "./handlers/authorize_code";

export class OAuth2Server {
	model: IOAuthModel;
	constructor(model: IOAuthModel) {
		this.model = model;
	}

	authorize(req: Request, res: Response): Promise<any> {
		let result: Promise<any>;
		switch(Utils.getValue(req.query, 'response_type')) {
			case RESPONSE_TYPE.code: 
				result = new AuthorizationCode(req, res, this.model).handle();
				break;
			default:
				result = Promise.reject(OAuthErrors.UnsupportedResponseType());
				break;
		}
		return result;
	}
}