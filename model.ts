import { AuthData } from "./auth_data";
import { IOAuthModel, Client, User } from "./lib/oauth2/entities";
import { OAuthErrors } from "./lib/oauth2/errors";

export class TestAuthModel implements IOAuthModel {
	getClient(clientId: string, scope: string): Promise<Client> {
		console.log(`getClient: ${clientId}`);
		let client = AuthData.instance.getClient(clientId);
		if (!client)
			throw OAuthErrors.InvalidClient(`Client ${clientId} not found`);
		return Promise.resolve(client);
	}

	getLoginPage(client: Client): string {
		return "./login/login.html";
	}

	getUser(client: Client): Promise<User> {
		return Promise.resolve(undefined);
	}
}