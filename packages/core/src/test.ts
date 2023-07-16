import { getSWNotices } from "./index";

async function main() {
  const test = await getSWNotices();

  console.log(test);
}
main();
