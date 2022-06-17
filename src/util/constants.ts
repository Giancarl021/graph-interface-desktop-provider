import { ProviderOptions } from '../interfaces';

const options = {
    interactionMode: 'browser',
    applicationType: 'both',
    serverPort: 9090,
    vaultName: 'GraphInterface::DesktopProvider::Vault'
} as ProviderOptions;

const vaultKeys = {
    refreshToken: 'RefreshToken',
    waterMark: 'WaterMark'
};

const scopes = [ 'https://graph.microsoft.com/.default', 'offline_access' ];

export default {
    options,
    vaultKeys,
    scopes
};