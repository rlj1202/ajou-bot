import axios from "axios";

export async function getEvents(year: number) {
  const allData: {
    articleNo: number;
    articleTitle: string;
    etcChar2: string;
    etcChar3: string;
    etcChar6: string;
    etcChar12: string;
    etcChar13?: string;
    etcChar14?: string;
    categoryId: number;
    categoryNm: string;
    start: string;
    end: string;
    startDt: string;
    endDt: string;
    startY: string;
    endY: string;
    url?: string;
    title: string;
    addInfo: string;
    color: string;
    index: string;
  }[] = [];

  for (let month = 1; month <= 12; month++) {
    const resp = await axios.get(
      "https://www.ajou.ac.kr/kr/ajou/notice-calendar.do",
      {
        params: {
          mode: "calendar",
          boardNo: 1021,
          date: `${year}-${month < 10 ? `0${month}` : month}-01`,
          // type: "today",
        },
      },
    );

    const { todayData, data, success, today, todayName } = resp.data;

    if (!success) continue;

    allData.push(...data);
  }

  return allData;
}
