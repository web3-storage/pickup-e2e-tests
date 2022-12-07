import { promisify } from 'util'
import dotenv from 'dotenv'
import { Command } from 'commander'

import { contexts } from './helper/contexts.js'
import { getPinFromDynamo, deletePinFromDynamo } from './helper/dynamodb.js'
import { getFileFromS3, deleteFileFromS3 } from './helper/s3.js'
import { addPin, getPin } from './helper/services.js'

dotenv.config()

const program = new Command()

program
  .version('1.0.0', '--version')
  .usage('[OPTIONS]...')
  .requiredOption('-c, --cid <value>', 'The Cid requested.')
  .option('--cleanup', 'Delete the object on S3 if exists before the test.', false)
  .option('--verbose', 'Print all the steps.', false)

program.parse()
const options = program.opts()

const TARGET_ENV = process.env.TARGET_ENV ?? 'local'

const setTimeoutPromise = promisify(setTimeout)

async function test ({cid, cleanup, verbose}) {
  try {
    console.log(`Pick up for the CID: ${cid}`)

    const context = contexts[TARGET_ENV]

    if(!context) {
      console.error(`context for env '${TARGET_ENV}' not defined`)
      process.exit(1)
    }

    if (cleanup) {
      verbose && console.log('Clean up in progress, if the cid already exists delete it')
      // Verify and Delete from Dynamo
      const pinOnDynamoDb = await getPinFromDynamo({ cid }, context)
      if (pinOnDynamoDb) {
        verbose && console.log('Pin exists on Dynamo, then I delete it')
        await deletePinFromDynamo({ cid }, context)
      }

      // Verify and Delete from S3
      const pinOnS3 = await getFileFromS3({ cid }, context)
      if (pinOnS3) {
        verbose && console.log('Pin exists on S3, then I delete it')
        await deleteFileFromS3({ cid }, context)
      }
    }

    // Call API POST
    verbose && console.log('Add pin')
    await addPin({ cid }, context)

    let pickupSuccess = false
    verbose && console.log('Check pin')

    for (let i = 0; (i < context.MAX_RETRY); i++) {
      const state = await getPin({ cid }, context)
      if (Object.values(state?.peer_map || []).find(val => val.status === 'pinned')) {
        verbose && console.log('Car found and pinned')
        pickupSuccess = true
        break
      } else {
        if (Object.values(state?.peer_map || []).find(val => val.status === 'queued')) {
          verbose && console.log('Still queued, retry')
        } else {
          verbose && console.log('Not found, retry')
        }
        await setTimeoutPromise(context.TIMEOUT_RETRY)
      }
    }

    if (!pickupSuccess) {
      throw new Error(`E2E test fail for cid: ${cid}`)
    }

    console.log(`E2E test SUCCESS for cid: ${cid}`)
  } catch (e) {
    console.error(e.message)
    process.exit(1)
  }
}

test(options)
