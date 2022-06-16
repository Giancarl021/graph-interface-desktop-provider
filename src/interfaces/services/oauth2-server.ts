import OAuth2Client from 'client-oauth2';
import { Lib } from '..';

type OAuth2ServerCallback = (data: Lib.AccessTokenResponse) => void;
type OAuth2ServerMethodStart = () => void;
type OAuth2ServerMethodClose = () => Promise<void>;
type OAuth2ServerMethodOnToken = (callback: OAuth2ServerCallback) => void
type OAuth2Server = (client: OAuth2Client, port: number) => OAuth2ServerInstance;

interface OAuth2ServerInstance {
    start: OAuth2ServerMethodStart;
    close: OAuth2ServerMethodClose;
    onToken: OAuth2ServerMethodOnToken;
}

export default OAuth2Server;

export {
    OAuth2ServerCallback,
    OAuth2ServerMethodStart,
    OAuth2ServerMethodClose,
    OAuth2ServerMethodOnToken,
    OAuth2ServerInstance
}