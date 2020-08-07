const fs = require('fs');
const http = require('http');
const open = require('open');
const Client = require('client-oauth2');
const get = require('./src/util/request');
const { options: filler, fillOptions } = require('./src/util/options');
const createSecureJsonInterface = require('./src/util/sjson');

module.exports = function (options = filler) {
    fillOptions(options, filler);
    return async function (credentials) {
        const clientId = credentials.clientId || credentials.client_id || credentials['client-id'];
        const clientSecret = credentials.clientSecret || credentials.client_secret || credentials['client-secret'];
        const tenantId = credentials.tenantId || credentials.tenant_id || credentials['tenant-id'];

        const refreshToken = createSecureJsonInterface(
            `${options.refreshTokenPath}/refresh_token-${JSON.stringify(credentials)}`,
            process.env.USER || process.env.USERNAME,
            true
        );

        if (refreshToken.exists()) {
            const { refresh_token } = refreshToken.load();

            const getOptions = {
                url: `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                form: {
                    client_id: clientId,
                    client_secret: clientSecret,
                    grant_type: 'refresh_token',
                    redirect_uri: 'http://localhost:' + options.port,
                    scope: 'https://graph.microsoft.com/.default offline_access',
                    refresh_token
                }
            };
            const response = await get(getOptions);

            if(response.refresh_token) {
                refreshToken.save({
                    refresh_token: response.refresh_token
                });
            }

            return response;
        }

        const response = await new Promise((resolve, reject) => {
            let server;
            try {
                server = http.createServer(async (req, res) => {
                    if (req.url === '/favicon.ico') {
                        res.writeHead(404);
                        return res.end();
                    };
                    const data = await client.code.getToken(req.url);
                    res.write(fs.readFileSync(__dirname.replace(/\\/g, '/') + '/src/assets/success.html', 'utf8'));
                    res.end();
                    server.close();
                    return resolve(data);
                });

                server.listen(9090);

                const client = new Client({
                    clientId,
                    clientSecret,
                    authorizationUri: `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize`,
                    accessTokenUri: `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
                    redirectUri: 'http://localhost:9090',
                    scopes: ['https://graph.microsoft.com/.default', 'offline_access']
                });

                open(client.code.getUri());
            } catch (err) {
                if(server) server.close();
                return reject(err);
            }
        });

        const expires_in = Math.round((response.expires.getTime() - new Date()) / 1000);

        refreshToken.save({
            refresh_token: response.refreshToken
        });

        return {
            access_token: response.accessToken,
            expires_in
        };
    }
}