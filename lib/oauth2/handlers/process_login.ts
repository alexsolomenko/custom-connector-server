import { Client, IOAuthModel } from "../entities";
import { Request, Response } from "express";
import { OAuthErrors } from "../errors";
import fetch from 'node-fetch';

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
			id: opt.id,
			grants: [],
			redirect_uri: opt.redirect_uri,
			scope: opt.scope,
			state: opt.state,
		}

		return this.model.getUser(client, body.username, body.password).then(token =>
		{
			if (client.redirect_uri) {
				let url = `${client.redirect_uri}?code=${token.authcode}&state=${client.state}`;
				
				this.response.redirect(302, url);
				this.response.end();
				
				// console.log('redirect to: ' + url);
				// return fetch(url, { 
				// 	method: 'GET'
				// 	// headers: {
				// 	// 	Referer: options.referer
				// 	// }
				// }).then(() => 
				// {
				// 	console.log('redirect to: success');
				// }).catch(err => {
				// 	console.log('redirect to err: ' + err.message);
				// });
			}
			else
				throw OAuthErrors.InvalidClient('Missing `redirect_uri`');
		});
	}

	redirect(url: string, client: Client, code: string) {
		return fetch(`${client.redirect_uri}?code=${code}&state=${client.state}`, { method: 'POST' });
	}
}