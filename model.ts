import { AuthData } from "./auth_data";
import { IOAuthModel, Client, User, Token } from "./lib/oauth2/entities";
import { OAuthErrors } from "./lib/oauth2/errors";

export class TestAuthModel implements IOAuthModel {
	getClient(clientId: string, scope: string): Promise<Client> {
		console.log(`model.getClient: ${clientId}`);
		let client = AuthData.instance.getClient(clientId);
		if (!client)
			throw OAuthErrors.InvalidClient(`Client ${clientId} not found`);
		return Promise.resolve(client);
	}

	getLoginPage(client: Client): string {
		console.log('model.getLoginPage');
		return "./login/login.html";
	}

	getUser(client: Client, username?: string, password?: string): Promise<User> {
		console.log('model.getUser');
		return new Promise((resolve, reject) => {
			let token = AuthData.instance.authenticateUser(client.id, username, password, client['scope']);
			if (token)
				resolve(token);
			else 
				reject(OAuthErrors.InvalidToken(`The user '${username}' credentials is incorrect or not found`));
		});
	}

	getAccessToken(code: string, redirect_uri: string): Promise<Token> {
		return new Promise((resolve, reject) => {
			let token = AuthData.instance.getAccessToken(code, true);
			if (token)
				resolve(token);
			else
				reject(OAuthErrors.InvalidToken());
		});
	}
}