import "source-map-support/register";
import { CloudFront } from "aws-sdk";
import { sns, SnsSignature } from "@manwaring/lambda-wrapper";

const cloudFront = new CloudFront({ apiVersion: "2016-11-25" });

export const handler = sns(
  async ({ message, success, error }: SnsSignature) => {
    try {
      const { keys } = message;
      await invalidateCDN(keys);
      return success("Successfully invalidated CDN");
    } catch (err) {
      return error(err);
    }
  }
);

function invalidateCDN(Items: string[]): Promise<any> {
  const params = {
    DistributionId: process.env.CDN,
    InvalidationBatch: {
      CallerReference: new Date().getTime().toString(),
      Paths: { Quantity: 1, Items },
    },
  };
  console.info("Invalidating CDN with params", params);
  return cloudFront.createInvalidation(params).promise();
}
