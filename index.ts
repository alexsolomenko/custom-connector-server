import { Request, Response } from "express";
import { environment } from "./environments/environment";
import { OAuth2Server } from "./lib/oauth2/server";
import { TestAuthModel } from "./model";

var bodyParser = require('body-parser');
var express = require('express');

//http://localhost:3000/auth?response_type=code&client_id=e652c8cc-0536-451f-b6b7-d765690fdc9c&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Ftoken&scope=user.read&state=zyx

var server = new OAuth2Server(new TestAuthModel());
var app = express();
// var options: ExpressOAuthServer.Options = {
// 	useErrorHandler: true, 
// 	model: new AcAutorizationModel() as any
// };

// var oauth2 = new ExpressOAuthServer(options);
// app.oauth = oauth2;

app.use([environment.authUrn, environment.tokenUrn, environment.loginUrn], bodyParser.json());
app.use([environment.authUrn, environment.tokenUrn, environment.loginUrn], bodyParser.urlencoded({ extended: false }));
app.use(express.static('login'))

// app.use(environment.authUrn, oauth2.authorize({ authenticateHandler: new AcAuthenticationHandler(options) } ));

// app.post(environment.tokenUrn, function(req: any, res: any) {
// 	console.log("-------------------------------------------");

// 	let code = undefined;
// 	if (req.body)
// 		code = req.body.code;
// 	let token = AuthData.instance.getAccessToken(code);

// 	console.log("request query ---------------------")
// 	console.log(req.originalUrl);
// 	console.log("request body ---------------------")
// 	console.log(req.body);

// 	if (token) {
// 		res.setHeader('Content-Type', 'application/json');
// 		res.end(JSON.stringify({
// 			access_token: token.accessToken, 
// 			token_type: 'bearer',
// 			expires_in: token.accessTokenExpiresAt
// 		}));
// 	}
// 	else
// 		console.log("token is undefined");
// });

app.get(environment.authUrn, (req: Request, res: Response, next: any) => 
{
	server.authorize(req, res).catch(err => next(err));
});

app.post(environment.loginUrn, (req: Request, res: Response, next: any) => {
	console.log(req.body);
	res.status(200);
	res.send();
	});

app.listen(3000);