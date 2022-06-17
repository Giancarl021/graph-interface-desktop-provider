import AccountType from './account-type';
import InteractionMode from './interaction-mode';

interface ProviderOptions {
    interactionMode: InteractionMode;
    accountType: AccountType;
    serverPort: number;
    vaultName: string;
}

export default ProviderOptions;