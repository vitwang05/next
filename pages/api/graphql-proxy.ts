// src/pages/api/graphql-proxy.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const wpRes = await fetch(process.env.WP_GRAPHQL_URL as string, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // forward cookie để WooCommerce nhận session guest
        Cookie: req.headers.cookie || "",
      },
      body: JSON.stringify(req.body),
    });

    // Forward cookie set từ WP (session) và rewrite Domain để cookie gắn vào domain hiện tại
    const getSetCookie = (wpRes.headers as any).getSetCookie?.bind(
      wpRes.headers as any
    );
    const rawCookies: string[] = getSetCookie
      ? getSetCookie()
      : (() => {
          const single = wpRes.headers.get("set-cookie");
          return single ? [single] : [];
        })();
    if (rawCookies.length > 0) {
      const isProd = process.env.NODE_ENV === "production";
      const rewritten = rawCookies.map((c) => {
        let s = c
          .replace(/Domain=[^;]+;?\s*/gi, "")
          .replace(/;\s*SameSite=[^;]+/gi, "")
          .replace(/;\s*Path=[^;]+/gi, "");
        if (!isProd) {
          s = s.replace(/;\s*Secure/gi, "");
        }
        if (!/;\s*Path=/i.test(s)) s += "; Path=/";
        return s;
      });
      res.setHeader("set-cookie", rewritten);
    }

    const data = await wpRes.json();
    res.status(200).json(data);
  } catch (e: any) {
    console.error("Proxy error:", e);
    res.status(500).json({ error: "Proxy failed" });
  }
}
