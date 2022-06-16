import { createServer, Server, IncomingMessage, ServerResponse } from 'http';
import { createReadStream } from 'fs';
import { resolve } from 'path';

import { Lib, OAuth2Server } from '../interfaces';

export default (function (client, port) {
    let server : Server | undefined;
    const callbacks: ((data: Lib.AccessTokenResponse) => void)[] = [];

    function start() {
        server = createServer(handler);
        server.listen(port);
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

        callbacks.forEach(callback => callback({
            ...data,
            extExpiresIn: Number(data.expiresIn),
            expiresIn: Number(data.expiresIn)
        }));

        await file(response, 'index.html', 'text/html');
        await close();

        async function file(response: ServerResponse, path: string, contentType: string) {
            const resolvedPath = resolve(__dirname, '..', 'web', ...path.split(/(\\|\/)/g));
    
            await new Promise((resolve, reject) => {
                response.on('close', resolve);
                response.on('error', reject);
    
                response.writeHead(200, {
                    'Content-Type': contentType
                });
    
                createReadStream(resolvedPath)
                    .pipe(response, { end: true });             
            });
        }
    }

    return {
        start,
        close,
        onToken
    };
}) as OAuth2Server;