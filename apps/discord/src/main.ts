import axios from "axios";
import { Octokit } from "@octokit/core";
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";

import { getNotices } from "@ajou-bot/core";

import "dotenv/config";

const accessToken = process.env.GITHUB_TOKEN;
const discordLastArticleNo = parseInt(
  process.env.DISCORD_LAST_ARTICLE_NO || "",
);

const tableName = "ajou-bot-discord-webhooks-production";

if (!accessToken || accessToken.trim() === "") {
  console.log("Access token is not provided");
  process.exit(1);
}

const octokit = new Octokit({ auth: accessToken });

const dynamoDbClient = new DynamoDBClient({
  region: "ap-northeast-2",
});

async function setDiscordLastArticleNo(value: string) {
  await octokit.request(
    "PATCH /repos/{owner}/{repo}/actions/variables/{name}",
    {
      owner: "rlj1202",
      repo: "ajou-bot",
      name: "DISCORD_LAST_ARTICLE_NO",
      value: `${value}`,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    },
  );
}

async function getDiscordWebhookUrls(): Promise<string[]> {
  const resp = await dynamoDbClient.send(
    new ScanCommand({ TableName: tableName }),
  );

  if (!resp.Items) {
    console.error("Failed to get webhook urls");
    return [];
  }

  const webhooks = resp.Items.map((item) => ({
    webhookId: item["webhook-id"].N,
    webhookToken: item["webhook-token"].S,
  }));

  const webhookUrls = webhooks.map(
    (item) =>
      `https://discord.com/api/webhooks/${item.webhookId}/${item.webhookToken}`,
  );

  return webhookUrls;
}

async function main() {
  console.log(`Discort last article no: ${discordLastArticleNo}`);

  const articles = await getNotices();
  articles.sort((a, b) => parseInt(a.id) - parseInt(b.id));

  console.log(
    `Cur article ids: ${articles.map((article) => article.id).join(", ")}`,
  );

  const newArticles = articles
    .sort((a, b) => parseInt(a.id) - parseInt(b.id))
    .filter((article) => parseInt(article.id) > discordLastArticleNo);

  console.log(`New articles: ${newArticles.length}`);

  if (!newArticles.length) {
    console.log("There are no new articles");
    return;
  }

  const webhooks = await getDiscordWebhookUrls();

  console.log(`${webhooks.length} webhook urls are found`);

  for (const article of newArticles) {
    const form = new FormData();
    form.append(
      "content",
      [`${article.title}`, "", `${article.url}`].join("\n"),
    );
    form.append(
      "avatar_url",
      "https://rlj1202.github.io/ajou-bot/discord-profile.png",
    );

    const promises = webhooks.map((url) => axios.post(url, form));

    await Promise.all(promises);
  }

  const lastArticleNo = articles[articles.length - 1].id;
  console.log(`Update discordLastArticleNo to ${lastArticleNo}`);
  await setDiscordLastArticleNo(lastArticleNo);
}

main();
