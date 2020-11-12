const jwt_decode = require('jwt-decode');

class SessionUtil {
    getApiProviderInfo = function (req, res,) {
        var obj = {
            domain: req.session.domain,
            access_token: req.session.access_token,
            service_list: req.session.service_list,
            service_selected: req.session.service_selected,
            environment: req.session.enviromnent,
            oidc_issuer_realm: req.session.oidc_issuer_realm,
            staging_endpoint: req.session.staging_endpoint,
            endpoint: req.session.endpoint
        }
        res.send(JSON.stringify(obj));
    }
    getApiDeveloperInfo = function (req, res,) {
        var obj = {
            application_list: req.session.apps,
            application_selected: req.session.app,
            response_types: ["code"]
        }
        res.send(JSON.stringify(obj));
    }
    getEndUserInfo = function (req, res,) {
        var decoded;
        if (req.session.oidc_access_token) {
            decoded = jwt_decode(req.session.oidc_access_token);
        }
        var obj = {
            oidc_access_token: req.session.oidc_access_token,
            access_token_decoded: decoded,
        }
        res.send(JSON.stringify(obj));
    }
}

module.exports = SessionUtil;