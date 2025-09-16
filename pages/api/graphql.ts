// pages/api/graphql.ts
import type { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const cookies = cookie.parse(req.headers.cookie || "");
    const authToken = cookies.authToken;
    const wcSession = cookies.wcSession;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (authToken) headers["Authorization"] = `Bearer ${authToken}`;
    if (wcSession) headers["woocommerce-session"] = `Session ${wcSession}`;

    const wpRes = await fetch(process.env.NEXT_PUBLIC_WORDPRESS_API_URL as string, {
      method: "POST",
      headers,
      body: JSON.stringify(req.body),
    });

    // Nếu Woo trả session mới -> cập nhật cookie
    const rawSession = wpRes.headers.get("woocommerce-session");
    if (rawSession) {
      const clean = rawSession.replace(/^Session\s+/, "");
      res.setHeader(
        "Set-Cookie",
        cookie.serialize("wcSession", clean, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          path: "/",
        })
      );
    }

    const data = await wpRes.text();
    res.status(wpRes.status).send(data);
  } catch (error: any) {
    console.error("GraphQL Proxy Error:", error);
    res.status(500).json({ error: "Proxy failed", details: error.message });
  }
}
