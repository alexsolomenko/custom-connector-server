import { Client, IOAuthModel } from "../entities";
import { Request, Response } from "express";
import { OAuthErrors } from "../errors";

export class ProcessLogin {
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
		let opt = body ? body.options : undefined;
		if (!opt)
			throw OAuthErrors.InvalidRequest();

		let client: Client = {
			id: opt.client_id,
			grants: [],
			redirect_uri: opt.redirect_uri,
			scope: opt.scope,
			state: opt.state,
		}

		return this.model.getUser(client, body.username, body.password).then(token =>
		{
			if (client.redirect_uri) {
				this.response.write(JSON.stringify({ 'code': token.authcode }));
				this.response.end();
			}
			else
				throw OAuthErrors.InvalidClient('Missing `redirect_uri`');
		});
	}
}