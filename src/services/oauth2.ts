import OAuth2Client from 'client-oauth2';
import open from 'open';
import { randomBytes } from 'crypto';

import Server from './oauth2-server';

import { InteractionMode, Lib } from '../interfaces';
import constants from '../util/constants';

export default function (credentials: Lib.Credentials, authority: string, serverPort: number, interactionMode: InteractionMode) {
    async function getToken(): Promise<Lib.AccessTokenResponse> {
        return await new Promise((resolve, reject) => {
            const client = new OAuth2Client({
                clientId: credentials.clientId,
                clientSecret: credentials.clientSecret,
                authorizationUri: `https://login.microsoftonline.com/${authority}/oauth2/v2.0/authorize`,
                accessTokenUri: `https://login.microsoftonline.com/${authority}/oauth2/v2.0/token`,
                redirectUri: `http://localhost:${serverPort}`,
                scopes: constants.scopes,
                state: randomBytes(16).toString('hex')
            });

            const server = Server(client, serverPort);
    
            try {
                let interactionCallback: () => void;

                const url = client.code.getUri();

                switch (interactionMode) {
                    case 'browser':
                        interactionCallback = () => void open(url);
                        break;
                    
                    case 'cli':
                        interactionCallback = () => console.log(`Open this URL in your local browser:\n  ${url}`);
                        break;
                    
                    default:
                        throw new Error('Invalid interaction mode');
                }
                
                server.onToken(resolve);
                
                server.start().then(interactionCallback);
            } catch (err) {
                const rej = () => reject(err);

                server.close()
                    .then(rej)
                    .catch(rej);
            }
        });
    }

    return {
        getToken
    };
}