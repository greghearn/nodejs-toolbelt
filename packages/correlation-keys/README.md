# nodejs-toolbelt package correlation-keys
This module provides a way for recording correlation key value pairs.

A configurable prefix is added to the beginning of each correlation key defaulting to 'x-correlation-' if one is not configiured. Setting your own prefix is optional, any changes to your prefix will preserve your values assigned to their corresponding keys with your new prefix.

This module makes use of the [global-cache](https://www.npmjs.com/package/global-cache) package for caching to the global object so there is only ever one instance which I use for accessing corellation keys within other middleware modules.

## Getting started

Use NPM package manager [npm](https://www.npmjs.com/get-npm) to install NPM.

```bash
npm install @greghearn/correlation-keys
```

## Usage

```js
const correlationKeys = require('@greghearn/correlation-keys')

// (optional) set a new prefix name
correlationKeys.replacePrefix('x-org-') // key prefix name change from 'x-correlation-' to 'x-org-'

// sets a key value pair to { 'x-org-idempotency': '23e7Ynqw92Cvw79' }
correlationKeys.set('idempotency', '23e7Ynqw92Cvw79') 

// fetch a value relating to a specific key
correlationKeys.get('idempotency') // returns '23e7Ynqw92Cvw79'

// keys are case insensitive
correlationKeys.get('IDeMPotENcY') // returns '23e7Ynqw92Cvw79'

// check a key exists
correlationKeys.has('idempotency') // returns boolean
```


## License
[MIT](https://choosealicense.com/licenses/mit/)