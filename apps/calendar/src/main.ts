import { getEvents } from "@ajou-bot/core/calendar";
import * as ics from "ics";
import path from "path";
import fs from "fs";

async function main() {
  const data = await getEvents(2023);

  const events: ics.EventAttributes[] = data.map(
    (event): ics.EventAttributes => {
      const title = event.title;
      const start = new Date(event.start);
      const end = new Date(event.end);
      const department = event.etcChar6;
      const articleNo = event.articleNo;
      const categoryId = event.categoryId;
      const categoryNm = event.categoryNm;

      return {
        title: title,
        start: [start.getFullYear(), start.getMonth() + 1, start.getDate()],
        end: [end.getFullYear(), end.getMonth() + 1, end.getDate()],
        categories: [categoryNm],
        url: `https://www.ajou.ac.kr/kr/ajou/notice-calendar.do?mode=view&articleNo=${articleNo}`,
        // organizer: {
        //   name: department,
        // },
        uid: `${articleNo}@ajou.co.kr`,
        productId: "ajou-bot/ics",
        calName: "아주대학교 학사일정",
        classification: "PUBLIC",
      };
    },
  );

  const { error, value } = ics.createEvents(events);

  if (error) {
    throw error;
  }

  if (!value) {
    throw new Error("no result");
  }

  const publicDir = path.join(process.cwd(), "../../public");
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }

  const calendarFilePath = path.join(publicDir, "calendar.ics");
  fs.writeFileSync(calendarFilePath, value);
}
main();
