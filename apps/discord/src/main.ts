import axios from "axios";
import { Octokit } from "@octokit/core";

import { getNotices } from "@ajou-bot/core";

import "dotenv/config";

const accessToken = process.env.GITHUB_TOKEN;
const webhookTestUrl = process.env.DISCORD_WEBHOOK_TEST || "";
const discordLastArticleNo = parseInt(
  process.env.DISCORD_LAST_ARTICLE_NO || "",
);

if (!accessToken || accessToken.trim() === "") {
  console.log("Access token is not provided");
  process.exit(1);
}

const octokit = new Octokit({ auth: accessToken });

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

  const webhooks = [webhookTestUrl];

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
