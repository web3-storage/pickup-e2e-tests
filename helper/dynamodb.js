import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, GetCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb'

export const getPinFromDynamo = async ({ cid }, context) => {
  const dynamo = new DynamoDBClient({ endpoint: context.dynamoDbEndpoint, region: context.region })

  const client = DynamoDBDocumentClient.from(dynamo)

  const res = await client.send(new GetCommand({
    TableName: context.dynamoDbTable,
    Key: { cid }
  }))

  const pin = res.Item

  return pin
}

export const deletePinFromDynamo = async ({ cid }, context) => {
  const dynamo = new DynamoDBClient({ endpoint: context.dynamoDbEndpoint, region: context.region })

  const client = DynamoDBDocumentClient.from(dynamo)

  await client.send(new DeleteCommand({
    TableName: context.dynamoDbTable,
    Key: { cid }
  }))

  if(await getPinFromDynamo({ cid }, context)) {
    throw new Error('Failed to delete dynamo item')
  }
}
