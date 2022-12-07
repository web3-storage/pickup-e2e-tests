# Pickup e2e test suite

The `Pickup` e2e test suite provides a set of tools for e2e testing.

## e2e testing `pickup` service

There is 1 test for `pickaup`: `smoke`.  

### Configure the services

The `helpers/contexts.js` contains the configuration for the environemnts.

It's currently configured only the `staging` env.

```
region: 'us-west-2',
dynamoDbEndpoint: 'https://dynamodb.us-west-2.amazonaws.com',
dynamoDbTable: 'staging-pickup-BasicV2',
s3Bucket: 'staging-pickup-basicapistack-carbucketdae1e77a-1l11iof62g79t',
s3BucketEndpoint: 'staging-pickup-basicapistack-carbucketdae1e77a-1l11iof62g79t.s3.us-east-2.amazonaws.com',
apiUrl: 'https://staging.pickup.dag.haus',
TIMEOUT_RETRY: 1000,
MAX_RETRY: 20,
```

The required values:
* apiUrl: The api endpoint. Eg. 'https://staging.pickup.dag.haus',
* TIMEOUT_RETRY: The time in ms between the retry. Eg. 1000,
* MAX_RETRY: The check max retry before fail. Eg. 20,

The following values are required only to cleanup the bucket and dynamo before the smoke test:
* region: The AWS region. Eg. 'us-west-2'
* dynamoDbEndpoint: The dynamoDb endpoint. Eg.  'https://dynamodb.us-west-2.amazonaws.com'
* dynamoDbTable: The dynamoDb table. Eg. 'staging-pickup-BasicV2'
* s3Bucket: The S3 bucket. Eg. 'staging-pickup-basicapistack-carbucketdae1e77a-1l11iof62g79t',
* s3BucketEndpoint: The S3 endpoint. Eg. 'staging-pickup-basicapistack-carbucketdae1e77a-1l11iof62g79t.s3.us-east-2.amazonaws.com',


### How to run tests

Install node deps, please note node `v18` is required.

```bash
npm i
```

Copy the file `.env.tpl` to `.env` and add the `PICKUP_BASIC_AUTH_TOKEN` 

```dotenv
# Base64 encoded user:pass string
PICKUP_BASIC_AUTH_TOKEN="add-the-auth-token-here"
```

- run smoke test

```bash
TARGET_ENV=staging npm run test:smoke -- --verbose -c bafybeigbtmkd72kgeaqikcf4fb3xaz2gmkrivji6nyxzbcxmds256ctad4
```

It's possbile to run the test with a cleanup. Before the `addPin` is called, the dynamoDb entry is removed and the S3 file is deleted.
In the long term this function will probably removed.

```bash
AWS_PROFILE=your-profile TARGET_ENV=staging npm run test:smoke -- --verbose -c bafybeigbtmkd72kgeaqikcf4fb3xaz2gmkrivji6nyxzbcxmds256ctad4 --cleanup
```

Note: the AWS profile should have access to the dynamoDb table and the S3 bucket. 
