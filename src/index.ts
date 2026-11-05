export interface Env {
  AI_API_KEY?: string;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders
    }
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }

    if (url.pathname === "/") {
      return json({
        name: "UnknownCode Backend",
        status: "online",
        platform: "Cloudflare Workers"
      });
    }

    if (url.pathname === "/health") {
      return json({
        status: "healthy",
        timestamp: new Date().toISOString()
      });
    }

    if (url.pathname === "/api/chat" && request.method === "POST") {
      if (!env.AI_API_KEY) {
        return json({
          error: "AI API key belum dikonfigurasi"
        }, 503);
      }

      return json({
        message: "Backend siap. Integrasi AI provider belum dipasang."
      }, 501);
    }

    return json({
      error: "Endpoint tidak ditemukan"
    }, 404);
  }
};
