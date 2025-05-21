import http from "k6/http";
import { check } from "k6";

export default function () {
  const host = __ENV.BASE_URL;
  if (!host) {
    console.error("BASE_URL environment variable is not set.");
    return;
  }

  const url = `${host}`;
  const res = http.get(url);

  check(res, { "status is 200": (r) => r.status === 200 });
}
