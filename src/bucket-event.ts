import "source-map-support/register";
import { SNS } from "aws-sdk";
import { wrapper, WrapperSignature } from "@manwaring/lambda-wrapper";

const sns = new SNS({ apiVersion: "2010-03-31" });

export const handler = wrapper(async ({ success, error }: WrapperSignature) => {
  try {
    await publishSiteUpdatedEvent();
    return success();
  } catch (err) {
    return error(err);
  }
});

function publishSiteUpdatedEvent(): Promise<any> {
  const params = {
    TopicArn: process.env.SITE_UPDATED_TOPIC,
    Message: JSON.stringify("Updated"),
  };
  console.log("Publishing site updated event with params", params);
  return sns.publish(params).promise();
}
