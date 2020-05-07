import 'source-map-support/register';
import { CloudFront } from 'aws-sdk';
import { sns, SnsSignature } from '@manwaring/lambda-wrapper';

const cloudFront = new CloudFront({ apiVersion: '2019-03-26' });

export const handler = sns(async ({ message, success, error }: SnsSignature) => {
  try {
    const { keys } = message;
    await invalidateCDN(keys);
    return success('Successfully invalidated CDN');
  } catch (err) {
    return error(err);
  }
});

function invalidateCDN(Items: string[]): Promise<any> {
  const params = {
    DistributionId: process.env.CDN,
    InvalidationBatch: {
      CallerReference: new Date().getTime().toString(),
      Paths: { Quantity: Items.length, Items },
    },
  };
  console.info('Invalidating CDN with params', JSON.stringify(params));
  return cloudFront.createInvalidation(params).promise();
}
