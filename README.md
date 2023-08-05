# ajou-bot

[![Export and deploy pages](https://github.com/rlj1202/ajou-bot/actions/workflows/export.yml/badge.svg)](https://github.com/rlj1202/ajou-bot/actions/workflows/export.yml)

- 아주대학교 공지사항 RSS: https://rlj1202.github.io/ajou-bot/rss.xml
- 아주대학교 소프트웨어학과 공지사항 RSS: https://rlj1202.github.io/ajou-bot/notice-sw.xml
- 아주대학교 소프트웨어융합대학 공지사항 RSS: https://rlj1202.github.io/ajou-bot/notice-sw-college.xml
- 아주대학교 학사일정 iCalendar: https://rlj1202.github.io/ajou-bot/calendar.ics

## TODOs

- [x] RSS
  - [x] 아주대학교 공지사항
  - 소프트웨어융합대학
    - [x] 소프트웨어융합대학 공지사항
    - [x] 소프트웨어학과 공지사항
    - [ ] 사이버보안학과 공지사항
    - [ ] 디지털미디어학과 공지사항
    - [ ] 국방디지털융합학과 공지사항
      - 공지사항이 안보임
    - [ ] 인공지능융합학과 공지사항
  - 정보통신대학
    - [ ] 정보통신대학 공지사항
    - [ ] 전자공학과 공지사항
    - [ ] 지능형반도체공학과 공지사항
  - 공과대학
  - 경영대학
  - 인문대학
  - 사회과학대학
  - 의과대학
  - 간호대학
  - 약학대학
  - 다산학부대학
  - 국제학부
  - 대학원
- [x] 아주대학교 학사일정 iCalendar
  - [ ] 학사일정 2023년으로 고정되어 있는 것 수정
- [ ] Discord
  - [x] Webhook
    - [x] AWS DynamoDB
    - [x] 웹훅 등록을 위한 간단한 페이지
    - [ ] 커스텀 도메인?

## 참고

- https://github.com/ajou-hack/notice-rss - 아주대학교 공지사항 게시판 RSS
- https://github.com/HyoTaek-Jang/agong - 아주대학교 공지사항 키워드 알리미 : 아공
- https://github.com/ajou-hack/dgmd-notice-rss - 아주대학교 디지털미디어학과 공지사항 게시판 RSS
- https://github.com/nailerHeum/school-notice-crawling - 아주대학교 공지사항 크롤링 with puppeteer
- https://github.com/KyoungsueKim/bug-free-broccoli - 아주대학교 공지사항 게시물을 자동으로 크롤링 해 카카오톡 채팅방으로 전달해주는 공지 봇 프로그램입니다.
