# nodejs-toolbelt package squareup-authenticity-middyware

This module is a middleware wrapper for validating webhook notifications to confirm that the payload originated from Square. 
While this middleware validation is not strictly required, validating the sender adds an extra layer of security and helps avoid man-in-the-middle attacks.

All v2 Webhooks notifications from Square include an X-Square-Signature header. The value of this header is an HMAC-SHA1 signature generated using your webhook notification URL and the body of the request excluding all whitespace.

Your `Signature Key` assigned in your Square Developer Portal will be used to compare the webhook signature key to the key provided in the notification payload using the X-Square-Signature header value. More information relating to squareups webook events can be found here [webhooks](https://developer.squareup.com/docs/webhooks-overview)

If your `Signature Key` can validate the incoming message then no error response is populated at the middleware level and the handler continues as normal.
If your `Signature Key` cant validate the message then this middleware handles the error and adds an error message to the response with a status code of 400 [BAD REQUEST], the execution is propagated to all the other middlewares if others exist and they have a chance to update or replace the response as needed. 
Finally at the end of the sequence, the response is returned to the user.

## What you will need.
You will need your `Signature Key` assigned by the Square Application Dashboard in the Webhooks settings page for your application.

This module depends on the use of [middy](https://www.npmjs.com/package/middy) framework for the middleware engine.

## Getting started

Once you have your webhooks setup and working, you will need to add this middleware code to your handler so that your application can validate the events it receives.

```bash
npm install @greghearn/squareup-authenticity-middyware
```
## Usage

```javascript
const squareupAuthenticityMiddyware = require('@greghearn/squareup-authenticity-middyware')

*** EXAMPLE PAYLOAD ***
// example of an incoming event message payload
{
  "httpMethod": "POST",
  "headers": {
    "Content-Type": "application/json",
    "x-square-signature": "xr7qpklzMoKXJT6qIawAha6OCuA="
  },
   "requestContext": {
      "path": "/dev/",
      "domainName": "t7ip8r6gwl.execute-api.ap-southeast-2.amazonaws.com"
   },
  "body": "{\"merchant_id\":\"6SSW7HV8K2ST5\",\"type\":\"inventory.count.updated\",\"event_id\":\"df5f3813-a913-45a1-94e9-fdc3f7d5e3b6\"}"
}

*** YOUR CODE ***
/**
 * applying this signature key when the above example payload message 
 * comes in will yield a successful result.
 */
module.exports.handler = middy((event, context, callback) => { /* ... */ })
  .use(squareupAuthenticityMiddyware({ 
    signatureKey: 'rBnSB9miw_dN-4ZA0hrQ5w' /* REPLACE ME */
  }))

```


## License
[MIT](https://choosealicense.com/licenses/mit/)