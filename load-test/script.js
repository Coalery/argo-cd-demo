import http from "k6/http";
import { check } from "k6";

export const options = {
  stages: [
    { duration: "1s", target: 50 },
    { duration: "1m", target: 50 },
    { duration: "1s", target: 0 },
  ],
};

export default function () {
  const host = __ENV.BASE_URL;
  if (!host) {
    console.error("BASE_URL environment variable is not set.");
    return;
  }

  const url = `${host}/load`;
  const res = http.get(url);

  check(res, { "status is 200": (r) => r.status === 200 });
}
