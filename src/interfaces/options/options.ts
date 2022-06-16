import ApplicationType from './application-type';
import InteractionMode from './interaction-mode';

interface Options {
    interactionMode: InteractionMode;
    applicationType: ApplicationType;
    serverPort: number;
    vaultName: string;
}

export default Options;