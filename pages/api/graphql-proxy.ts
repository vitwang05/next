// pages/api/graphql-proxy.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Lấy session token từ header request (có thể undefined)
    let sessionHeader = req.headers["woocommerce-session"];
    let sessionToken: string | undefined;

    if (Array.isArray(sessionHeader)) sessionToken = sessionHeader[0];
    else if (typeof sessionHeader === "string") sessionToken = sessionHeader;

    // Tạo headers gửi tới WP
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (sessionToken) headers["woocommerce-session"] = sessionToken;

    const wpRes = await fetch(process.env.WP_GRAPHQL_URL as string, {
      method: "POST",
      headers,
      body: JSON.stringify(req.body),
    });

    // Lấy session mới từ WP trả về header
    const newSession = wpRes.headers.get("woocommerce-session");
    if (newSession) {
      // forward cho client
      res.setHeader("woocommerce-session", newSession);
    }

    const data = await wpRes.json();
    res.status(wpRes.status).json(data);
  } catch (error: any) {
    console.error("GraphQL Proxy Error:", error);
    res.status(500).json({ error: "Proxy failed", details: error.message });
  }
}
