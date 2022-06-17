import { createServer, Server, IncomingMessage, ServerResponse } from 'http';
import { createReadStream } from 'fs';
import { lstat } from 'fs/promises';
import { resolve } from 'path';

import { Lib, OAuth2Server } from '../interfaces';
import ClientOAuth2, { Token as ClientOAuth2Token } from 'client-oauth2';

export default (function (client: ClientOAuth2, port: number) {
    let server : Server | undefined;
    let closeTimeout: NodeJS.Timeout;
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
        const url = request.url ?? `http://localhost:${port}/`;
        const sendFile = file.bind(null, response);

        if (url.endsWith('/icon.png')) {
            await sendFile('icon.png', 'image/png');
        } else if (url.endsWith('/success')) {
            await sendFile('index.html', 'text/html');
        } else {
            const data = await client.code.getToken(url);

            fireCallbacks(data);

            response.statusCode = 301;
            response.setHeader('Location', `http://localhost:${port}/success`);
            response.end();
        }

        debouncedClose();
    }

    async function file(response: ServerResponse, path: string, contentType: string) {
        const resolvedPath = resolve(__dirname, '..', 'web', ...path.split(/(\\|\/)/g));
        const stat = await lstat(resolvedPath);

        await new Promise((resolve, reject) => {
            response.on('finish', resolve);
            response.on('error', reject);

            response.setHeader('Content-Type', contentType);
            response.setHeader('Content-Length', stat.size);

            createReadStream(resolvedPath)
                .pipe(response, { end: true });
        });
    }

    function fireCallbacks(clientResponse: ClientOAuth2Token) {
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

    function debouncedClose() {
        clearTimeout(closeTimeout);
        closeTimeout = setTimeout(close, 1000);
    }

    return {
        start,
        close,
        onToken
    };
}) as OAuth2Server;