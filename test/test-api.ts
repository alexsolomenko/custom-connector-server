import { IOAuthModel } from "../lib/oauth2/entities";
import { Request, Response } from "express";
import { environment } from "../environments/environment";
import fetch from 'node-fetch';
import { AuthData } from "./auth_data";
import { OAuthErrors } from "../lib/oauth2/errors";

export class TestAPI {
	request: Request = undefined;
	response: Response = undefined;
	model: IOAuthModel;
	
	constructor(req: Request, res: Response, model: IOAuthModel) {
		this.request = req;
		this.response = res;
		this.model = model;
	}

	handle(): Promise<any> {
		if (this.request.originalUrl.startsWith(environment.apiUrn)) {
			let func = this.request.path.substr(environment.apiUrn.length + 1);
			const query = this.request.query;
			if (func && func.toLowerCase() == 'gettemplate')
				this.getTemplate(query);
			return Promise.resolve();
		}
		else {
			let data = JSON.stringify({ 'grant_type': 'authorization_code', 'code': this.request.query.code });
			return fetch(environment.hostUrl + environment.tokenUrn, {
				method: 'POST',
				headers: {
				'Content-Type': 'application/json'
				},
				body: data
			}).then(res => {
				res.json().then(json => this.response.send(json));
			});
		}
	}

	getTemplate(query: any) {
		let id = query.id;
		let subject = query.subject;
		let authorization: string = this.request.headers.authorization;
		
		console.log(`authorization: ${authorization}`);
		if (!authorization)
			throw OAuthErrors.UnauthorizedClient();

		let user = AuthData.instance.getUserByToken(authorization.split(/\s+/)[1]);
		console.log(`${user ? user.name : 'undefined'}.getTemplate id: ${id}`);

		this.response.status(200);
		this.response.contentType('application/json');
		this.response.setHeader('Access-Control-Allow-Origin', '*');
		switch(id) {
			case "1": 
				this.response.send(JSON.stringify({'template': 'I greately appreciate your kind words.'}) );
			break;
			case "2": 
				this.response.send(JSON.stringify({'template': 'I am very thankful for your kind help.'}) );
			break;
			case "3": 
				this.response.send(JSON.stringify({'template': '<h2 style="color: red;font-family: monospace;">I\'m very thankful for your kind help.</h2>'}) );
			break;
			default:
				this.response.send('');
				break;
		}
	}
}