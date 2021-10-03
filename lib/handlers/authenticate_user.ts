import { IOAuthModel } from "../oauth2/entities";

export class AuthenticateUser {
	request: Request = undefined;
	response: Response = undefined;
	model: IOAuthModel;
	
	constructor(req: Request, res: Response, model: IOAuthModel) {
		this.request = req;
		this.response = res;
		this.model = model;
	}

	handle(): Promise<any> {
		return Promise.resolve();
		// return new Promise((resolve, reject) => {
		// 	return this.getClient().then(client =>
		// 	{
		// 		if (!this.response.headersSent)
		// 			this.response.send();	
		// 	}).catch(reject);
		// });
	}
}