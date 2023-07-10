import { getNotices } from "@ajou-bot/core";

async function main() {
  const articles = await getNotices();

  for (const article of articles) {
    console.log(article);
  }
}
main();
