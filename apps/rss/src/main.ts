import { getNotices } from "@ajou-bot/core";
import { Feed } from "feed";
import fs from "fs";
import path from "path";

async function main() {
  const feed = new Feed({
    title: "아주대학교 공지사항",
    description: "아주대학교 공지사항입니다",
    id: "https://www.ajou.ac.kr/kr/ajou/notice.do",
    link: "https://www.ajou.ac.kr/kr/ajou/notice.do",
    copyright: "All rights reserved 2023, Jisu Sim",
    language: "ko-kr",
    author: {
      name: "Jisu Sim",
      email: "rlj1202@gmail.com",
      link: "https://github.com/rlj1202",
    },
    updated: new Date(),
    generator: "ajou-bot",
  });

  const articles = await getNotices();

  for (const article of articles) {
    feed.addItem({
      title: article.title,
      category: [{ name: article.category }],
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

  const publicDir = path.join(process.cwd(), "../../public");
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }

  const rssFilePath = path.join(publicDir, "rss.xml");
  fs.writeFileSync(rssFilePath, feed.rss2());
}
main();
