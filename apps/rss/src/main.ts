import { getNotices, getSWNotices, getSWCollegeNotices } from "@ajou-bot/core";
import { Feed } from "feed";
import fs from "fs";
import path from "path";

const publicDir = path.join(process.cwd(), "../../public");
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

async function generateNoticeRss() {
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
    favicon: "https://rlj1202.github.io/ajou-bot/favicon.ico",
    image: "https://rlj1202.github.io/ajou-bot/favicon.ico",
    feed: "https://rlj1202.github.io/ajou-bot/rss.xml",
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

  const rssFilePath = path.join(publicDir, "rss.xml");
  fs.writeFileSync(rssFilePath, feed.rss2());
}

async function generateSWNoticeRss() {
  const feed = new Feed({
    title: "아주대학교 소프트웨어학과 공지사항",
    description: "아주대학교 소프트웨어학과 공지사항입니다",
    id: "http://software.ajou.ac.kr/bbs/board.php",
    link: "http://software.ajou.ac.kr/bbs/board.php",
    copyright: "All rights reserved 2023, Jisu Sim",
    language: "ko-kr",
    author: {
      name: "Jisu Sim",
      email: "rlj1202@gmail.com",
      link: "https://github.com/rlj1202",
    },
    updated: new Date(),
    generator: "ajou-bot",
    favicon: "https://rlj1202.github.io/ajou-bot/favicon.ico",
    image: "https://rlj1202.github.io/ajou-bot/favicon.ico",
    feed: "https://rlj1202.github.io/ajou-bot/notice-sw.xml",
  });

  const articles = await getSWNotices();

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

  const rssFilePath = path.join(publicDir, "notice-sw.xml");
  fs.writeFileSync(rssFilePath, feed.rss2());
}

async function generateSWCollegeNoticeRss() {
  const feed = new Feed({
    title: "아주대학교 소프트웨어융합대학 공지사항",
    description: "아주대학교 소프트웨어융합대학 공지사항입니다",
    id: "https://sw.ajou.ac.kr/sw/board/notice.do",
    link: "https://sw.ajou.ac.kr/sw/board/notice.do",
    copyright: "All rights reserved 2023, Jisu Sim",
    language: "ko-kr",
    author: {
      name: "Jisu Sim",
      email: "rlj1202@gmail.com",
      link: "https://github.com/rlj1202",
    },
    updated: new Date(),
    generator: "ajou-bot",
    favicon: "https://rlj1202.github.io/ajou-bot/favicon.ico",
    image: "https://rlj1202.github.io/ajou-bot/favicon.ico",
    feed: "https://rlj1202.github.io/ajou-bot/notice-sw.xml",
  });

  const articles = await getSWCollegeNotices();

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

  const rssFilePath = path.join(publicDir, "notice-sw-college.xml");
  fs.writeFileSync(rssFilePath, feed.rss2());
}

async function main() {
  await generateNoticeRss();
  await generateSWNoticeRss();
  await generateSWCollegeNoticeRss();
}

main();
