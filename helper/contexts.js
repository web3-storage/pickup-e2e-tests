export const contexts = {
  staging: {
    region: 'us-west-2',
    dynamoDbEndpoint: 'https://dynamodb.us-west-2.amazonaws.com',
    dynamoDbTable: 'staging-pickup-BasicV2',
    s3Bucket: 'staging-pickup-basicapistack-carbucketdae1e77a-1l11iof62g79t',
    s3BucketEndpoint: 'staging-pickup-basicapistack-carbucketdae1e77a-1l11iof62g79t.s3.us-east-2.amazonaws.com',
    apiUrl: 'https://staging.pickup.dag.haus',
    TIMEOUT_RETRY: 1000,
    MAX_RETRY: 20,
  }
}
