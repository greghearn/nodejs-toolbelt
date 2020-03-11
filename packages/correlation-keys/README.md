# nodejs-toolbelt package correlation-keys
This module provides a way for recording correlation key value pairs between modules so you can access them between microservices for monitoring or logging requirements for example.

The module is extended from javascripts Map interface so you have access to method functionality such as set, get, clear, size, entries etc.

A configurable prefix is added to the beginning of each correlation key defaulting to 'x-correlation-' if one is not configiured. Setting your own prefix is optional, any changes to your prefix will preserve your values assigned to their corresponding keys with your new prefix.

This module makes use of nodejs global variable for caching the global object so there is only ever one instance which I use for accessing correlation keys within other middleware modules.

## Getting started

Use NPM package manager [npm](https://www.npmjs.com/get-npm) to install NPM.

```bash
npm install @greghearn/correlation-keys
```

## Usage

```js
const correlationKeys = require('@greghearn/correlation-keys')

// (optional) set a new prefix name
correlationKeys.setPrefix('x-org-') // key prefix name change from 'x-correlation-' to 'x-org-'

// sets a key value pair to { 'x-org-idempotency': '23e7Ynqw92Cvw79' }
correlationKeys.set('idempotency', '23e7Ynqw92Cvw79') 

// returns a POJO of key, value pairs for every entry in the map
correlationKeys.entries() // returns { 'x-org-idempotency': '23e7Ynqw92Cvw79' }

// fetch a value relating to a specific key
correlationKeys.get('idempotency') // returns '23e7Ynqw92Cvw79'
// or 
correlationKeys.get('x-org-idempotency') // returns '23e7Ynqw92Cvw79'

// keys are case insensitive
correlationKeys.get('IDeMPotENcY') // returns '23e7Ynqw92Cvw79'

// check a key exists
correlationKeys.has('idempotency') // returns true
// or
correlationKeys.has('x-org-idempotency') // returns true

// returns the size of the map
correlationKeys.size() // returns 1

```


## License
[MIT](https://choosealicense.com/licenses/mit/)