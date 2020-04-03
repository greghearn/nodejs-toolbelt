# nodejs-toolbelt package accept-message-middyware for aws lambda functions
This module is a aws lambda event validation & message transforming middleware wrapper providing a way for applying a schema to validate an incoming message whilst automatically converting any message data to an object leaving the developer to concentrate on implementing their main handlers business logic requirements.
If the schema can validate the message then no error response message is populated at the middleware level and the handler continues as normal.
If the schema cant validate the message then this middleware handles the error and adds the error message to the response with a status code of 400 [BAD REQUEST], the execution is propagated to all the other middlewares if others exist and they have a chance to update or replace the response as needed. 
Finally at the end of the sequence, the response is returned to the user.

This module automatically works out what AWS Lambda event source was invoked by looking at the message event payload before validating the event and transforming the message data to an object if required.
A configuration option exists to turn the message data transformation off if required.

## Event source types
Currently this module supports the following lambda event sources:
- 1. HTTP: Any requests with a header Content-Type of application/json will workk IE: Amazon API Gateway.
- 2. AWS Lambda with Amazon Simple Notification Service with an array of type Records.

This module depends on the use of [ajv](https://www.npmjs.com/package/ajv) under the hood for schema related validation & the [middy](https://www.npmjs.com/package/middy) framework for the middleware engine.
Install dependancy framework [middy](https://www.npmjs.com/package/middy) for wrapping your handler in middy.

## Getting started

```bash
npm install --save @greghearn/accept-message-middyware
```

## Options
All Options are optional, therefore this middleware could be used just for schema validation and/or could be used for parsing the incoming message event for object notation usage.
- schema (optional) default = {}
  - A valid ajv schema object used to test the incoming event for validity
- convert (optional) default = false
  - A boolean value used to transform the incoming event message from a string to object notation for referencing within the handler.
- debug (optional) default = false
  - A boolean value used to output and error messages from the ajv schema tests. Debugging currently sent to default console.

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
  /**
   * `convert` is set to true in configutation so therefore 
   * the body can be accessible in the handler via object notation.
   */
  const eventId = event.body.event_id

  // prints `df5f3813-a913-45a1-94e9-fdc3f7d5e3b6`
  console.log(eventId)

  /**
   * If `convert` was set to false in the configutation then
   * the body will be preserved in it's raw format as a string.
   */
  // prints "{\"merchant_id\":\"6SSW7HV8K2ST5\",\"type\":\"inventory.count.updated\",\"event_id\":\"df5f3813-a913-45a1-94e9-fdc3f7d5e3b6\"}"
  console.log(event.body)

}).use(acceptMessageMiddyware({ 
  schema: schema,
  convert: true
}))

```


## License
[MIT](https://choosealicense.com/licenses/mit/)