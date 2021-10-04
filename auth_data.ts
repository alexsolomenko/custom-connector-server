import { environment } from "./environments/environment";
import { Client, Token, User } from "./lib/oauth2/entities";

export class AuthData {
	private constructor() {}
	static instance: AuthData = new AuthData();

	private md5 = require('md5');

	private clients: Client[] = [
		// test clients
		{ 
			id: 'e652c8cc-0536-451f-b6b7-d765690fdc9c',
			name: 'Power Automate',
			secretKey: '_',
			redirectUris: [environment.hostUrl + environment.testUrn, 'https://global.consent.azure-apim.net/redirect'], 
			grants: ['authorization_code'],
		}
	];

	private users: User[] = [ 
		// test users
		// pass is MD5 hash
		{ name: 'user1', pass: '123456' }, 
		{ name: 'user2', pass: '456789' }
	];

	private tokens: Token[] = [];

	getClient(clientId: string): Client {
		return this.clients.find(c => c.id == clientId);
	}

	getUser(username: string, pass: string): User {
		return this.users.find(u => u.name.toLowerCase() == username.toLowerCase() && u.pass == pass);
	}

	private uuidv4() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		  var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
		  return v.toString(16);
		});
	}

	authenticateUser(client_id: string, username: string, pass: string, scope: string[]): Token {
		let token: Token;
		let user = this.getUser(username, pass);
		if (user) {
			let client = this.clients.find(c => c.id == client_id);
			if (client) {
				token = this.tokens.find(t => t.user.name == user.name && t.client.id == client_id);
				// TODO also need to check the scope
				if (!token)
					token = {
						accessToken: this.md5(`${client.id}-${user.id}-${(Array.isArray(scope) ? scope.join(',') : scope)}-${new Date().valueOf()}`),
						accessTokenExpiresAt: undefined,
						refreshToken: undefined,
						refreshTokenExpiresAt: undefined,
						scope: scope,
						client: client,
						user: user,
						authcode: this.md5(this.uuidv4()),
					};
					this.tokens.push(token);
			}
		}
		return token;
	}

	getAccessToken(authcode: any): Token {
		return this.tokens.find(t => t.authcode == authcode);
	}
}