# nodejs-toolbelt package accept-message-middyware
This module is a validation middleware wrapper providing a way for applying a schema to validate an incoming message leaving the developer to concentrate on implementing the main handlers business logic requirements.
If the schema can validate the message then no error response message is populated at the middleware level and the handler continues as normal.
If the schema cant validate the message then this middleware handles the error and creates a
response, the execution is propagated to all the other middlewares if others exist and they have a chance to update or replace the response as needed. 
Finally at the end of the sequence, the response is returned to the user.

This module automatically works out what AWS Lambda event source was invoked by looking at the message event payload. Currently this module only supports requests from API Gateway with a Content-Type of application/json but more will come soon.

This module depends on the use of [ajv](https://www.npmjs.com/package/ajv) under the hood for schema related validation & the [middy](https://www.npmjs.com/package/middy) framework for the middleware engine.

## Getting started

Install middy framework [middy](https://www.npmjs.com/package/middy) for wrapping your handler in middy.


```bash
npm install @greghearn/accept-message-middyware
```

## Usage

```javascript
const acceptMessageMiddyware = require('@greghearn/accept-message-middyware')

*** EXAMPLE PAYLOAD ***
// example of the incoming event message payload
{
  "httpMethod": "POST",
  "headers": {
    "Content-Type": "application/json",
  },
  "body": "{\"merchant_id\":\"6SSW7HV8K2ST5\",\"type\":\"inventory.count.updated\",\"event_id\":\"df5f3813-a913-45a1-94e9-fdc3f7d5e3b6\"}",
}

*** YOUR CODE ***
/**
 * Setup a schema relating to you incoming data for validating.
 * All we are doing here is saying that the body property must 
 * have 3 required fields  in the payload and the `type` property
 * must be valid based on the supplied regular expression.
 */
const schema = {
  required: ['body'],
  properties: {
    body: {
      type: 'object',
      required: ['merchant_id', 'type', 'event_id'],
      properties: {
        type: {
          regexp: '/^inventory\\.count\\.updated$/i'
        }
      }
    }
  }
}
/**
 * applying this schema when the above example payload message 
 * comes in will yeild a successful result.
 */
module.exports.handler = middy((event, context, callback) => { /* ... */ })
  .use(acceptMessageMiddleware({ schema: schema }))

```


## License
[MIT](https://choosealicense.com/licenses/mit/)