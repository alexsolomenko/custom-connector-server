import { environment } from "./environments/environment";
import { OAuth2Server } from "./lib/oauth2/server";
import { Request, Response } from "express";

import { TestAuthModel } from "./test/test-model";
import { TestAPI } from "./test/test-api";

var bodyParser = require('body-parser');
var express = require('express');

//http://localhost:3000/auth?response_type=code&client_id=e652c8cc-0536-451f-b6b7-d765690fdc9c&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Ftest&scope=user.read&state=zyx

var model = new TestAuthModel();
var server = new OAuth2Server(model);
var app = express();

app.use([environment.authUrn, environment.tokenUrn, environment.loginUrn], bodyParser.json());
app.use([environment.authUrn, environment.tokenUrn, environment.loginUrn], bodyParser.urlencoded({ extended: false }));

app.use(express.static('login'))

app.get(environment.authUrn, server.authorizeCode);
app.post(environment.loginUrn, server.processLogin);
app.post(environment.tokenUrn, server.authorizeAccessToken);

app.get([environment.testUrn, /\/api/], function (req: Request, res: Response, next: any) {
	return new TestAPI(req, res, model).handle().catch(err => next(err));
});

app.listen(3000);