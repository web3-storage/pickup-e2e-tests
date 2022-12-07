import { S3Client, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'

const getKeyFromCid = (cid) => `pickup/${cid}/${cid}.root.car`

export const getFileFromS3 = async ({ cid }, context) => {
  const s3Client = new S3Client({ region: context.region })

  try {
    const data = await s3Client.send(new HeadObjectCommand({
      Bucket: context.s3Bucket,
      Key: getKeyFromCid(cid)
    }))

    return data
  } catch (e) {
    if(e.name === 'NotFound') {
      return null
    }

    throw e
  }
}

export const deleteFileFromS3 = async ({ cid }, context) => {
  const s3Client = new S3Client({ region: context.region })

  try {
    await s3Client.send(new DeleteObjectCommand({
      Bucket: context.s3Bucket,
      Key: getKeyFromCid(cid)
    }))

    if(await getFileFromS3({ cid }, context)) {
      throw new Error('Failed to delete S3 item')
    }
  } catch (e) {
    if(e.name === 'NotFound') {
      return null
    }

    throw e
  }
}
