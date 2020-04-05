# nodejs-toolbelt package accept-message-middyware for aws lambda functions
This module is a aws lambda event validation middleware wrapper providing a way for applying a schema to validate an incoming message leaving the developer to concentrate on implementing their main handlers business logic requirements.
If the schema can validate the message then no error response message is populated at the middleware level and the handler continues as normal.
If the schema cant validate the message then this middleware handles the error and adds the error message to the middleware error chain propagated to all the other middlewares if others exist and they have a chance to update or replace the response as needed. 
Finally at the end of the sequence, the response is returned to the user.

This module depends on the use of [ajv](https://www.npmjs.com/package/ajv) under the hood for schema related validation & the [middy](https://www.npmjs.com/package/middy) framework for the middleware engine.
Install dependancy framework [middy](https://www.npmjs.com/package/middy) for wrapping your handler in middy.

## Getting started

```bash
npm install --save @greghearn/accept-message-middyware
```

## Options
All Options are optional, therefore this middleware could be used just for schema validation and/or could be used for parsing the incoming message event for object notation usage.
- schema (optional) default = {}
  A valid ajv schema object used to test the incoming event for validity
- debug (optional) default = false
  A boolean value used to output and error messages from the ajv schema tests. Debugging currently sent to default console.

## Usage

```javascript
const acceptMessageMiddyware = require('@greghearn/accept-message-middyware')

*** EXAMPLE PAYLOAD ***
// example of an incoming event message payload
{
  "httpMethod": "POST",
  "headers": {
    "Content-Type": "application/json",
  },
  "body": "{\"merchant_id\":\"6SSW7HV8K2ST5\",\"type\":\"inventory.count.updated\",\"event_id\":\"df5f3813-a913-45a1-94e9-fdc3f7d5e3b6\"}",
}

*** YOUR CODE ***
/**
 * Setup a schema relating to your incoming data for validating.
 * All we are doing here is saying that the body property must 
 * have 3 required fields in the payload and a regular expression 
 * is to be matched on the `type` properties value. If the
 * message payloads matches this then we have a valid message.
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
 * comes in will yield a successful result.
 */
module.exports.handler = middy((event, context, callback) => { 
  // prints "{\"merchant_id\":\"6SSW7HV8K2ST5\",\"type\":\"inventory.count.updated\",\"event_id\":\"df5f3813-a913-45a1-94e9-fdc3f7d5e3b6\"}"
  console.log(event.body)

}).use(acceptMessageMiddyware({ 
  schema: schema,
  debug: false
}))

```


## License
[MIT](https://choosealicense.com/licenses/mit/)