var session = {
    getApiProviderInfo: function(){
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
    getApiDeveloperInfo: function(){
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
    getEndUserInfo: function(){
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