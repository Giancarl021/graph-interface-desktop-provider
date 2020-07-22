require('dotenv').config();

const createGraphInterface = require('../graph-interface');

const credentials = {
    tenantId: process.env.TENANT_ID,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
};

const createDesktopMiddleware = require('./index');

const options = {
    cache: {
        type: 'fs'
    },
    authenticationProvider: createDesktopMiddleware({ refreshTokenPath: '.gphcache' })
};

const ttl = 3600;

async function main() {
    console.log('Connecting to Graph API...');
    const graph = await createGraphInterface(credentials, options);

    const tasks = await graph.unit('me');

    console.log('Saving response...');
    require('fs').writeFileSync(`responses/${Date.now()}.json`, JSON.stringify(tasks, null, 4));

    console.log('Response built');

    await graph.close();
}

main().catch(console.error);