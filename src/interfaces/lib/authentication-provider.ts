import AccessTokenResponse from './access-token-response';
import Credentials from './credentials';

type AuthenticationProvider = (credentials: Credentials) => Promise<AccessTokenResponse> | AccessTokenResponse;

export default AuthenticationProvider;