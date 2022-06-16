import fillObject from 'fill-object';
import { request } from 'undici';

import Vault from './src/services/vault';
import Form from './src/services/form';
import OAuth2 from './src/services/oauth2';

import constants from './src/util/constants';

import { Options, Lib } from './src/interfaces';

export = function GraphInterfaceDesktopProvider(options?: Partial<Options>) : Lib.AuthenticationProvider {
    const _options = fillObject(options ?? {}, constants.options) as Options;
    const vault = Vault(_options.vaultName);

    async function authenticationProvider(credentials: Lib.Credentials) : Promise<Lib.AccessTokenResponse> {
        let authority: string;

        switch (_options.applicationType) {
            case 'both':
                authority = 'common';
                break;
            case 'personal':
                authority = 'consumers';
                break;
            case 'corporate':
                authority = credentials.tenantId;
                break;
            default:
                throw new Error('Invalid account type');
        }

        if (await vault.has(constants.vaultKeys.refreshToken)) {
            const refreshToken = await vault.get<string>(constants.vaultKeys.refreshToken);

            const response = await request(`https://login.microsoftonline.com/${authority}/oauth2/v2.0/token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: Form({
                    client_id: credentials.clientId,
                    client_secret: credentials.clientSecret,
                    refresh_token: refreshToken,
                    redirect_uri: `http://localhost:${_options.serverPort}`,
                    grant_type: 'refresh_token',
                    scope: constants.scopes.join(' ')
                })
            });
            
            if (response.statusCode === 200) {
                const data = await response.body.json() as Lib.AccessTokenResponse;
            
                if (data.refreshToken) {
                    await vault.set(constants.vaultKeys.refreshToken, data.refreshToken);
                }

                return data;   
            }

            await vault.remove(constants.vaultKeys.refreshToken);
        }
        
        const oAuth2 = OAuth2(credentials, authority, _options.serverPort, _options.interactionMode);
        
        const data = await oAuth2.getToken();

        await vault.set(constants.vaultKeys.refreshToken, data.refreshToken);

        return data;
    }

    return authenticationProvider;
};