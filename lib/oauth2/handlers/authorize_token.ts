import { IOAuthModel } from "../entities";
import { Request, Response } from "express";
import { OAuthErrors } from "../errors";

export class AuthorizationToken {
	request: Request = undefined;
	response: Response = undefined;
	model: IOAuthModel;
	
	constructor(req: Request, res: Response, model: IOAuthModel) {
		this.request = req;
		this.response = res;
		this.model = model;
	}

	handle(): Promise<any> {
		let body = this.request.body;
		return this.model.getAccessToken(body.code, body.redirect_uri).then(token => {
			this.response.setHeader('Content-Type', 'application/json');
			this.response.end(JSON.stringify({
				access_token: token.accessToken, 
				token_type: 'bearer',
				expires_in: token.accessTokenExpiresAt
			}));
		});
	}
}