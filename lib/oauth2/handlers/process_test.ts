import { IOAuthModel } from "../entities";
import { Request, Response } from "express";
import { environment } from "../../../environments/environment";
import fetch from 'node-fetch';

export class ProcessTest {
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
			if (func && func.toLowerCase() == 'gettemplate')
				this.getTemplate(this.request.query);
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
		let name = query.id;
		let subject = query.subject;
		console.log(`${name} ${subject}`);

		this.response.status(200);
		this.response.contentType('application/json');
		this.response.setHeader('Access-Control-Allow-Origin', '*');
		switch(name) {
			case "1": 
				this.response.send(JSON.stringify({'template': 'I greately appreciate your kind words.'}) );
			break;
			case "2": 
				this.response.send(JSON.stringify({'template': 'I am very thankful for your kind help.'}) );
			break;
			default:
				this.response.send('');
				break;
		}
	}
}