// TODO: replace this with https://github.com/3scale/3scale_ws_api_for_nodejs

const url = require('url');
const request = require('request');

class ThreeScaleManagementApi {
    serviceList = function (req, res) {
        const queryObject = url.parse(req.url, true).query;
        if (queryObject.url && queryObject.access_token) {
            console.log(queryObject);
            req.session.domain = queryObject.url;
            req.session.access_token = queryObject.access_token;
            var destination = req.session.domain + "/admin/api/services.json?access_token=" + req.session.access_token;
            var options = {
                url: destination,
                strictSSL: false,
            }
            request(options, (error, response, body) => {
                if (error !== null) {
                    console.error('error:', error);
                    return (false);
                }
                console.log('Service List API');
                console.log('statusCode:', response && response.statusCode);
                console.log('body:', body);
                req.session.service_list = JSON.parse(body);
                res.send(body);
            });
        }
    }

    proxyConfigLatest = function (req, res, serviceId, enviromnent) {
        const queryObject = url.parse(req.url, true).query;
        req.session.service_id = serviceId;
        req.session.enviromnent = enviromnent;
        var destination = req.session.domain + "/admin/api/services/" + req.session.service_id + "/proxy/configs/" + req.session.enviromnent + "/latest.json?access_token=" + req.session.access_token;
        var options = {
            url: destination,
            strictSSL: false,
        }
        request(options, (error, response, body) => {
            if (error !== null) {
                console.error('error:', error);
                return (false);
            }
            console.log('Proxy Config Show Latest API');
            console.log('statusCode:', response && response.statusCode);
            console.log('body:', body);
            var serviceConfig = JSON.parse(body);
            var issuer = serviceConfig.proxy_config.content.proxy.oidc_issuer_endpoint;
            if (issuer) {
                var url = issuer.substring(0, issuer.indexOf(':')) + "://" + issuer.substring(issuer.indexOf('@') + 1);
                req.session.oidc_issuer_realm = url;
                console.log("OIDC Issuer Realm");
                console.log(url);
            }
            req.session.staging_endpoint = serviceConfig.proxy_config.content.proxy.sandbox_endpoint;
            req.session.endpoint = serviceConfig.proxy_config.content.proxy.endpoint;
            res.send(body);
        });
    }

    applicationList = function (req, res) {
        const queryObject = url.parse(req.url, true).query;
        req.session.service_id = queryObject.service_id;
        var destination = req.session.domain + "/admin/api/applications.json?access_token=" + req.session.access_token + "&per_page=500&service_id=" + req.session.service_id;
        var options = {
            url: destination,
            strictSSL: false,
        }
        request(options, (error, response, body) => {
            if (error !== null) {
                console.error('error:', error);
                return (false);
            }

            console.log('Application List API');
            console.log('statusCode:', response && response.statusCode);
            console.log('body:', body);
            req.session.apps = JSON.parse(body);
            res.send(body);
        });
    }
}

module.exports = ThreeScaleManagementApi;