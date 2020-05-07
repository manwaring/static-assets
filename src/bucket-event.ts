import 'source-map-support/register';
import { SNS } from 'aws-sdk';
import { S3Event } from 'aws-lambda';
import { wrapper, WrapperSignature } from '@manwaring/lambda-wrapper';

const sns = new SNS({ apiVersion: '2010-03-31' });

export const handler = wrapper(async ({ event, success, error }: WrapperSignature) => {
  try {
    const keys = (event as S3Event).Records.map((event) => `/${event.s3.object.key}`);
    await publishAssetUpdatedEvent(keys);
    return success();
  } catch (err) {
    return error(err);
  }
});

function publishAssetUpdatedEvent(keys: string[]): Promise<any> {
  const params = {
    TopicArn: process.env.SITE_UPDATED_TOPIC,
    Message: JSON.stringify({ keys }),
  };
  console.log('Publishing asset updated event with params', params);
  return sns.publish(params).promise();
}
