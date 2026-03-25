import { checkRateLimit, redis } from "@/lib/rateLimit";

describe("Rate limiter", () => {

  beforeEach(async () => {
    await redis.flushdb();
  });

  test("allows requests under the limit", async () => {
    const ip = "1.1.1.1";

    for (let i = 0; i < 6; i++) {
      const allowed = await checkRateLimit(ip, "login");
      expect(allowed).toBe(true);
    }
  });

  test("blocks requests after limit is exceeded", async () => {
    const ip = "1.1.1.1";

    for (let i = 0; i < 6; i++) {
      await checkRateLimit(ip, "login");
    }

    const blocked = await checkRateLimit(ip, "login");

    expect(blocked).toBe(false);
  });

  test("separate IPs have separate limits", async () => {
    const ip1 = "1.1.1.1";
    const ip2 = "2.2.2.2";

    for (let i = 0; i < 6; i++) {
      await checkRateLimit(ip1, "login");
    }

    const blocked = await checkRateLimit(ip1, "login");
    expect(blocked).toBe(false);

    const allowed = await checkRateLimit(ip2, "login");
    expect(allowed).toBe(true);
  });

  test("different routes have separate limits", async () => {
    const ip = "1.1.1.1";

    for (let i = 0; i < 6; i++) {
      await checkRateLimit(ip, "login");
    }

    const blockedLogin = await checkRateLimit(ip, "login");
    expect(blockedLogin).toBe(false);

    const allowedSignup = await checkRateLimit(ip, "signup");
    expect(allowedSignup).toBe(true);
  });

});