// TODO: replace this with https://github.com/3scale/3scale_ws_api_for_nodejs

const url = require('url');
const request = require('request');

const { Issuer, generators } = require('openid-client');
const code_verifier = generators.codeVerifier();
const code_challenge = generators.codeChallenge(code_verifier)
const jwt_decode = require('jwt-decode');

class ApiProvider {
    setApplication = function (req, res, appId, apps) {
        var app = req.session.apps.applications.filter(obj => obj.application.id == parseInt(appId));
        req.session.app = app[0].application;
        res.send(JSON.stringify(app[0].application));
    }


    redirectToIdp = function (req, res) {
        var config = {
            client_id: req.session.app.client_id,
            client_secret: req.session.app.client_secret,
            redirect_uris: [req.session.app.redirect_url],
            response_types: ["code"]
        }
        console.log("REALM: " + req.session.oidc_issuer_realm)
        Issuer.discover(req.session.oidc_issuer_realm) // => Promise
            .then(function (myIssuer) {
                const client = new myIssuer.Client(config);
                const url = client.authorizationUrl({
                    scope: 'openid email profile',
                    resource: 'https://my.api.example.com/resource/32178',
                    code_challenge,
                    code_challenge_method: 'S256',
                });
                res.writeHead(301,
                    { Location: url }
                );
                res.end();
            }).catch(reason => {
                console.log(reason)
            });
    }

    callback = function (req, res) {
        var config = {
            client_id: req.session.app.client_id,
            client_secret: req.session.app.client_secret,
            redirect_uris: [req.session.app.redirect_url],
            response_types: ["code"]
        }
        return Issuer.discover(req.session.oidc_issuer_realm)
            .then(function (myIssuer) {
                const client = new myIssuer.Client(config);
                const params = client.callbackParams(req);
                client.callback(req.session.app.redirect_url, params, { code_verifier })
                    .then(function (tokenSet) {
                        console.log('received and validated tokens %j', tokenSet);
                        console.log('validated ID Token claims %j', tokenSet.claims());
                        console.log('validated Access Token claims %j', jwt_decode(tokenSet.access_token));
                        req.session.oidc_access_token = tokenSet.access_token;
                        res.writeHead(301,
                            { Location: "/api_provider" }
                        );
                        res.end();
                    });
            });
    }

    call3scaleGateway = function (req, res) {
        const options = {
            url: req.session.staging_endpoint,
            strictSSL: false,
            headers: {
                'Authorization': 'Bearer ' + req.session.oidc_access_token
            }
        };
        console.log(JSON.stringify(options));
        request(options, (error, response, body) => {
            if (error !== null) {
                console.error('error:', error);
                return (false);
            }
            console.log('Service List API');
            console.log('statusCode:', response && response.statusCode);
            console.log('body:', body);

            res.send(body);
        });
    }
}

module.exports = ApiProvider;