const {
  DynamoDBClient,
  PutItemCommand,
  DeleteItemCommand,
} = require("@aws-sdk/client-dynamodb");

const client = new DynamoDBClient({
  region: "ap-northeast-2",
});

const discordWebhookRegex =
  /discord(?:app)?.com\/api\/webhooks\/([0-9]{17,20})\/([A-Za-z0-9.\-_]{60,68})/;

class InvalidContentTypeError extends Error {
  constructor() {
    super("Only application/json is accepted");
  }
}

class InvalidDiscordWebhookURLError extends Error {
  constructor() {
    super("Invalid discord webhook url");
  }
}

function parseJsonBody(event) {
  if (event.headers["content-type"] !== "application/json") {
    throw new InvalidContentTypeError();
  }

  const data = JSON.parse(event.body);

  const { url } = data;

  const matchResult = url.match(discordWebhookRegex);

  if (!matchResult) {
    throw new InvalidDiscordWebhookURLError();
  }

  const [_, webhookId, webhookToken] = matchResult;

  return {
    webhookId,
    webhookToken,
  };
}

module.exports = {
  subscribe: async (event) => {
    try {
      const { webhookId, webhookToken } = parseJsonBody(event);

      console.log({ webhookId, webhookToken });

      await client.send(
        new PutItemCommand({
          TableName: process.env.DYNAMODB_TABLE,
          Item: {
            "webhook-id": {
              N: webhookId,
            },
            "webhook-token": {
              S: webhookToken,
            },
          },
        }),
      );

      return {
        statusCode: 201,
        body: JSON.stringify(
          {
            message: "Subscribed",
          },
          null,
          2,
        ),
      };
    } catch (err) {
      if (
        err instanceof InvalidContentTypeError ||
        err instanceof InvalidDiscordWebhookURLError
      ) {
        return {
          statusCode: 400,
          body: JSON.stringify(
            {
              message: err.message,
            },
            null,
            2,
          ),
        };
      }

      console.error(err);

      return {
        statusCode: 500,
        body: JSON.stringify(
          {
            message: "Server internal error",
          },
          null,
          2,
        ),
      };
    }
  },
  unsubscribe: async (event) => {
    try {
      const { webhookId, webhookToken } = parseJsonBody(event);

      console.log({ webhookId, webhookToken });

      await client.send(
        new DeleteItemCommand({
          TableName: process.env.DYNAMODB_TABLE,
          Key: {
            "webhook-id": {
              N: webhookId,
            },
            "webhook-token": {
              S: webhookToken,
            },
          },
        }),
      );

      return {
        statusCode: 200,
        body: JSON.stringify(
          {
            message: "Unsubscribed",
          },
          null,
          2,
        ),
      };
    } catch (err) {
      if (
        err instanceof InvalidContentTypeError ||
        err instanceof InvalidDiscordWebhookURLError
      ) {
        return {
          statusCode: 400,
          body: JSON.stringify(
            {
              message: err.message,
            },
            null,
            2,
          ),
        };
      }

      console.error(err);

      return {
        statusCode: 500,
        body: JSON.stringify(
          {
            message: "Server internal error",
          },
          null,
          2,
        ),
      };
    }
  },
};
