import { createServer, Server, IncomingMessage, ServerResponse } from 'http';
import { createReadStream } from 'fs';
import { resolve } from 'path';

import { Lib, OAuth2Server } from '../interfaces';
import { Token } from 'client-oauth2';

export default (function (client, port) {
    let server : Server | undefined;
    const callbacks: ((data: Lib.AccessTokenResponse) => void)[] = [];

    async function start() {
        server = createServer(handler);

        await new Promise(resolve => {
            server!.listen(port, () => resolve(null));
        });
    }

    async function close() {
        await new Promise((resolve, reject) => {
            if (!server) return resolve(null);
            server.close(err => err ? reject(err) : resolve(null));
        });
    }

    function onToken(callback: (data: Lib.AccessTokenResponse) => void) {
        callbacks.push(callback);
    }

    async function handler(request: IncomingMessage, response: ServerResponse) {
        const url = request.url!;
        if (url.endsWith('/icon.png')) {
            await file(response, 'icon.png', 'image/png');
            return;
        }

        const data = await client.code.getToken(url);

        dispatchCallbacks(data);

        await file(response, 'index.html', 'text/html');
        await close();
    }

    async function file(response: ServerResponse, path: string, contentType: string) {
        const resolvedPath = resolve(__dirname, '..', 'web', ...path.split(/(\\|\/)/g));

        await new Promise((resolve, reject) => {
            response.on('finish', resolve);
            response.on('error', reject);

            response.writeHead(200, {
                'Content-Type': contentType
            });

            createReadStream(resolvedPath)
                .pipe(response, { end: true });             
        });
    }

    function dispatchCallbacks(clientResponse: Token) {
        const { data } = clientResponse;
        const response = {
            accessToken: data['access_token'],
            refreshToken: data['refresh_token'],
            tokenType: data['token_type'],
            expiresIn: Number(data['expires_in']),
            extExpiresIn: Number(data['ext_expires_in'])
        } as Lib.AccessTokenResponse;

        callbacks.forEach(callback => callback(response));
    }

    return {
        start,
        close,
        onToken
    };
}) as OAuth2Server;