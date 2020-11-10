const path = require("path");
const express = require('express');
const app = express()
const port = 3000
var session = require('express-session')

const TreeScaleManagementApi = require('./3scale_management_api/3scale_management_api.js');
const ApiProvder = require('./3scale_api_prodiver/api_provider.js');
const SessionUtil = require('./util/session_util.js');

const threeScaleManagementApi = new TreeScaleManagementApi();
const apiProvider = new ApiProvder();
const sessionUtil = new SessionUtil();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
}))

app.set("view engine", "ejs");
app.set("views", "src/views");
app.use(express.static('src/public'));

app.get('/', (req, res) => {
  res.render("index", { title: "Book Reviews" });
})

app.post('/', (req, res) => {
  req.session.destroy(() => {
    res.writeHead(301, { Location: '/' });
    res.end();
  })
});

app.get('/api_provider', (req, res) => {
  res.render("api_provider");
})

app.post('/api_provider/oidc_auth', (req, res) => {
  apiProvider.redirectToIdp(req, res);
})

app.get('/api_provider/3scale_gateway', (req, res) => {
  apiProvider.call3scaleGateway(req, res);
})

app.get('/api_provider/oidc_auth/cb', (req, res) => {
  apiProvider.callback(req, res);
})

app.put('/api/application/:app_id', (req, res) => {
  apiProvider.setApplication(req, res, req.params.app_id);
})

// SessionUtil

app.get('/api/session/api_provider', (req, res) => {
  sessionUtil.getApiProviderInfo(req, res);
})

app.get('/api/session/api_developer', (req, res) => {
  sessionUtil.getApiDeveloperInfo(req, res);
})

app.get('/api/session/end_user', (req, res) => {
  sessionUtil.getEndUserInfo(req, res);
})

// 3scale Management API proxys

app.get('/admin/api/services.json', (req, res) => {
  threeScaleManagementApi.serviceList(req, res);
})

app.get('/admin/api/services/:service_id/proxy/configs/:environment/latest.json', (req, res) => {
  threeScaleManagementApi.proxyConfigLatest(req, res, req.params.service_id, req.params.environment);
})

app.get('/admin/api/applications.json', (req, res) => {
  threeScaleManagementApi.applicationList(req, res);
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
