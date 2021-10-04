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