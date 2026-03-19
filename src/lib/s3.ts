import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const BUCKET_NAME = process.env.S3_BUCKET_NAME!
const REGION = process.env.S3_REGION ?? 'ap-northeast-1'

const globalForS3 = globalThis as unknown as { s3Client: S3Client }

function createS3Client(): S3Client {
  return new S3Client({ region: REGION })
}

const s3 = globalForS3.s3Client ?? createS3Client()

if (process.env.NODE_ENV !== 'production') {
  globalForS3.s3Client = s3
}

export async function getPresignedUploadUrl(
  key: string,
  contentType: string,
  expiresIn = 300,
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  })
  return getSignedUrl(s3, command, { expiresIn })
}

export async function getPresignedDownloadUrl(
  key: string,
  expiresIn = 3600,
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  })
  return getSignedUrl(s3, command, { expiresIn })
}

export async function deleteObject(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  })
  await s3.send(command)
}
