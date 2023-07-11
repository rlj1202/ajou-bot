import axios from "axios";
import * as cheerio from "cheerio";
import qs from "qs";
import sanitizeHtml from "sanitize-html";

export interface Article {
  title: string;
  category: string;
  author: string;
  url: string;
  date: Date;
  htmlContents: string;
}

async function getArticleContent(articleNo: string): Promise<string> {
  const resp = await axios.get<string>(
    "https://www.ajou.ac.kr/kr/ajou/notice.do",
    {
      params: {
        mode: "view",
        articleNo: articleNo,
        articleLimit: 10,
        "article.offset": 0,
      },
    },
  );

  const $ = cheerio.load(resp.data);
  let contentHtml = $("div.b-content-box > div.fr-view").html() || "";
  // contentHtml = sanitizeHtml(contentHtml, {
  //   allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
  // });

  return contentHtml;
}

export async function getNotices(): Promise<Article[]> {
  const resp = await axios.get<string>(
    "https://www.ajou.ac.kr/kr/ajou/notice.do",
    {
      params: {
        mode: "list",
        articleLimit: 10,
        "article.offset": 0,
      },
    },
  );

  const $ = cheerio.load(resp.data);
  const $rows = $("table.board-table > tbody > tr");

  const total = parseInt(
    $("div.b-total-wrap > p > span").first().text().trim().match(/\d+/)?.[0] ||
      "NaN",
  );
  console.log("Total:", total);

  const promises: Promise<Article>[] = [];

  $rows.each(function (i, elem) {
    const $notice = $(this).find(
      "td.b-td-left > div.b-title-box > a > span.b-notice",
    );

    const isNotice = $notice.length > 0;

    if (isNotice) {
      //
    }

    $notice.remove();

    const index = parseInt($(this).find("td.b-num-box").text().trim());
    const category = $(this).find("td.b-num-box + td").text().trim();
    const title = $(this)
      .find("td.b-td-left > div.b-title-box > a")
      .text()
      .trim();
    const link =
      $(this).find("td.b-td-left > div.b-title-box > a").attr()?.href?.trim() ||
      "";
    const author = $(this).find("td.b-no-right + td").text().trim();
    const date = $(this).find("td.b-no-right + td + td").text().trim();

    const { articleNo } = qs.parse(link, { ignoreQueryPrefix: true });

    promises.push(
      getArticleContent(articleNo as string).then((htmlContent) => {
        return {
          title: title,
          category: category,
          author: author,
          url: `https://www.ajou.ac.kr/kr/ajou/notice.do${link}`,
          htmlContents: htmlContent,
          date: new Date(date),
        };
      }),
    );
  });

  const articles = await Promise.all(promises);

  return articles;
}

export async function getSWNotices(): Promise<Article[]> {
  return [];
}
