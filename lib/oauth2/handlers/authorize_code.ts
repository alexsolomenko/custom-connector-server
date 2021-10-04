import { Client, GRANT_TYPE, IOAuthModel, OAUTH_PROP } from "../entities";
import { OAuthErrors } from "../errors";
import { Utils } from "../utils";
import { Request, Response } from "express";
import { environment } from "../../../environments/environment";
import { Is } from "../validators";

export class AuthorizationCode {
	request: Request = undefined;
	response: Response = undefined;
	model: IOAuthModel;
	
	constructor(req: Request, res: Response, model: IOAuthModel) {
		this.request = req;
		this.response = res;
		this.model = model;
	}

	handle(): Promise<any> {
		return new Promise((resolve, reject) => {
			return this.getClient().then(client =>
			{
				if (!this.response.headersSent)
					this.response.send();	
				//this.getUser(client).then(resolve);
			}).catch(reject);
		});
	}

	getClient(): Promise<Client> {
		let clientId = Utils.getValue(this.request.query, OAUTH_PROP.clientId);
		if (!clientId)
			throw OAuthErrors.InvalidClient('Missing parameter: `client_id`');

		if (!Is.vschar(clientId))
			throw OAuthErrors.InvalidRequest('Invalid parameter: `client_id`');

		let redirectUri: string = Utils.getValue(this.request.query, OAUTH_PROP.redirectUri) || 
			Utils.getValue(this.request.body, OAUTH_PROP.redirectUri);
		
		if (redirectUri && !Is.uri(redirectUri))
			throw OAuthErrors .InvalidRequest('Invalid request: `redirect_uri` is not a valid URI');

		let scope = Utils.getValue(this.request.query, OAUTH_PROP.scope);

		return this.model.getClient(clientId, scope).then(client =>
		{
			if (!client.grants || client.grants.indexOf(GRANT_TYPE.authorizationCode) < 0)
				throw OAuthErrors.UnauthorizedClient('Unauthorized client: `grant_type` is invalid');

			if (!client.redirectUris || 0 === client.redirectUris.length)
				throw OAuthErrors.InvalidClient('Invalid client: missing client `redirectUri`');

			let uri = redirectUri ? redirectUri.toLowerCase() : redirectUri;
			if (uri) {
				if (client.redirectUris && !client.redirectUris.find(r => r.toLowerCase() == uri))
					throw OAuthErrors.InvalidClient('Invalid client: `redirect_uri` does not match client value');
			}

			client[OAUTH_PROP.redirectUri] = uri;
			client[OAUTH_PROP.scope] = scope;
			client[OAUTH_PROP.state] = Utils.getValue(this.request.query, OAUTH_PROP.state);

			return this.getUser(client);
		});
	}

	getUser(client: Client): Promise<any> {
		let loginPage = this.model.getLoginPage(client);
		if (loginPage) {
			let that = this;
			return new Promise((resolve, reject) => {
				let fs = require('fs');
				fs.readFile(loginPage, 'utf-8', function(error: any, data: any) {
					if (error)
						reject(error);
					else {
						console.log('headers sent: ' + that.response.headersSent);
						that.response.status(200);
						that.response.setHeader('Content-Type', 'text/html');
						let options = `var options = ${JSON.stringify({ 
							'client_id': client.id, 
							//'redirect_uri': client['redirect_uri'],
							'login_uri': environment.loginUrn })}`; 
						that.response.send(data.replace("{{options}}", options));
						resolve(undefined);
					}
				});
			});
		}
		else return this.model.getUser(client);
	}
}