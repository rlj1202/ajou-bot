import { getNotices } from "@ajou-bot/core";
import { Feed } from "feed";
import fs from "fs";

async function main() {
  const feed = new Feed({
    title: "아주대학교 공지사항",
    description: "",
    id: "https://www.ajou.ac.kr/",
    link: "https://www.ajou.ac.kr/",
    copyright: "All rights reserved 2023, Jisu Sim",
    author: {
      name: "Jisu Sim",
      email: "rlj1202@gmail.com",
      link: "https://github.com/rlj1202",
    },
  });

  const articles = await getNotices();

  for (const article of articles) {
    feed.addItem({
      title: article.title,
      description: article.category,
      id: article.url,
      link: article.url,
      date: article.date,
      content: article.htmlContents,
      author: [
        {
          name: article.author,
        },
      ],
    });
  }

  fs.writeFileSync("./rss.xml", feed.rss2());
}
main();
