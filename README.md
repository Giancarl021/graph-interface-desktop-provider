# graph-interface-desktop-provider

Provides an oAuth2 Authentication for the [graph-interface](https://www.npmjs.com/package/graph-interface) module.

## Installation

Run

```bash
npm install graph-interface-desktop-provider --save
```

or, if you use Yarn

```bash
yarn add graph-interface-desktop-provider
```

## Usage

First import the module and the [graph-interface](https://www.npmjs.com/package/graph-interface) module.

```javascript
const createGraphInterface = require('graph-interface');
const createDesktopMiddleware = require('graph-interface-desktop-provider');
```

Then use in the ``authorizationProvider`` option when creating your graph interface:

```javascript
const graph = await createGraphInterface(credentials, {
    authorizationProvider: createDesktopMiddleware(options)
    // options
});
```

### Options

```javascript
{
    refreshTokenPath: '.' // The path where the refresh token will be stored
}
```