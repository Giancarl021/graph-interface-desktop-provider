import ApplicationType from './application-type';
import InteractionMode from './interaction-mode';

interface ProviderOptions {
    interactionMode: InteractionMode;
    applicationType: ApplicationType;
    serverPort: number;
    vaultName: string;
}

export default ProviderOptions;