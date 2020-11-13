var session = {
    getApiProviderInfo: function () {
        var destination = "/api/session/api_provider";
        return fetch(destination).then((response) => {
            if (!response.ok) {
                throw new Error();
            }
            return response.json();
        })
            .then((json) => {
                console.log(json);
                return json;
            })
            .catch((reason) => {
                console.log(reason)
            });
    },
    getApiDeveloperInfo: function () {
        var destination = "/api/session/api_developer";
        return fetch(destination).then((response) => {
            if (!response.ok) {
                throw new Error();
            }
            return response.json();
        })
            .then((json) => {
                console.log(json)
                return json;
            })
            .catch((reason) => {
                console.log(reason)
            });
    },
    getEndUserInfo: function () {
        var destination = "/api/session/end_user";
        return fetch(destination).then((response) => {
            if (!response.ok) {
                throw new Error();
            }
            return response.json();
        })
            .then((json) => {
                console.log(json)
                if (json.oidc_access_token) {
                    return json;
                }
            })
            .catch((reason) => {
                console.log(reason)
            });
    }
}

var threeScaleManagement = {
    getServiceList: function (adminDomain, accessToken) {
        var destination = "/admin/api/services.json?url=" + adminDomain + "&access_token=" + accessToken;
        return fetch(destination).then((response) => {
            if (!response.ok) {
                setApiProviderInfoView(SectionState.Focused);
                throw new Error();
            }
            return response.json();
        })
    },
    getProxyConfigLatest: function (serviceId, environment) {
        var destination = "/admin/api/services/" + serviceId + "/proxy/configs/" + environment + "/latest.json";
        return fetch(destination).then((response) => {
            if (!response.ok) {
                throw new Error();
            }
            return response.json();
        });
    },
    getApplicationList: function(serviceId){
        var destination = "/admin/api/applications.json?service_id=" + serviceId;
        return fetch(destination).then((response) => {
            if (!response.ok) {
                throw new Error();
            }
            return response.json();
        })
    }
}

var myApp = {
    getApplicationInfo: function(appId){
        var destination = "/api/application/" + appId;
        return fetch(destination, { method: 'PUT' }).then((response) => {
            if (!response.ok) {
                throw new Error();
            }
            return response.json();
        })
    },
    call3scaleGateway: function(){
        var destination = "/api_provider/3scale_gateway";
        return fetch(destination).then((response) => {
            if (!response.ok) {
                throw new Error();
            }
            return response.json();
        })
    }
}