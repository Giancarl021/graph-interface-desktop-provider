# graph-interface-desktop-provider

![graph-interface-desktop-provider-logo](docs/icon.png)

Authentication Provider for delegated access on [graph-interface](https://www.npmjs.com/package/graph-interface) package.

> **Important:** This version have breaking changes and is not compatible with the previous major version of this module or [graph-interface](https://github.com/Giancarl021/graph-interface).

> **Note:** This documentation consider that you already know how to use the [graph-interface](https://www.npmjs.com/package/graph-interface) package.

## Installation

You can get this package on [NPM](https://www.npmjs.com/package/graph-interface-desktop-provider)

## Usage

### Importing

CommonJS:

```javascript
const GraphInterfaceDesktopProvider = require('graph-interface-desktop-provider');
```

ES Modules:

```javascript
import GraphInterfaceDesktopProvider from 'graph-interface-desktop-provider';
```

### Initialization

The imported `GraphInterfaceDesktopProvider` function is used in the `authenticationProvider` option of the `GraphInterface` initializer function:

```javascript
const graph = GraphInterface(credentials, {
    authenticationProvider: GraphInterfaceDesktopProvider(providerOptions),
    ...options
})
```

The `providerOptions` object allows the following properties:

```typescript
interface ProviderOptions {
    interactionMode: InteractionMode;
    accountType: AccountType;
    serverPort: number;
    vaultName: string;
}

type InteractionMode = 'browser' | 'cli';

type AccountType = 'personal' | 'corporate' | 'both';
```

* **interactionMode** - The way that the package will request for an authentication. `browser` will open the default web browser with the authentication URL, while `cli` will print in the `stdout` the authentication URL. Default `browser`;

* **accountType** - The type of account that your application accept. It changes the authority of the authentication process. `corporate` uses the `credentials.tenantId` authority, `personal` uses `consumers` and `both` uses `common`. Depending on the scope of your application, an according `accountType` should be chosen. Default `both`;

* **serverPort** - The port that the web server will listen on to get the authorization code and complete the authentication. Default `9090`;

* **vaultName** - The service name of the [keytar](https://npmjs.com/package/keytar) package. It is a system-wide name, so it is highly recommended to set this property to avoid credential collision between services. Default `GraphInterface::DesktopProvider::Vault`.