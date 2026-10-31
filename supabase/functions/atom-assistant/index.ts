// ATOM cloud assistant: authenticated Supabase Edge Function.
// Required server secret: OPENAI_API_KEY. Optional: OPENAI_MODEL (defaults to gpt-6-astra).
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  const auth = req.headers.get("Authorization") || "";
  if (!auth.startsWith("Bearer ")) return json({ error: "Sign-in required" }, 401);
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY") || Deno.env.get("SUPABASE_PUBLISHABLE_KEY");
  const openaiKey = Deno.env.get("OPENAI_API_KEY");
  const model = Deno.env.get("OPENAI_MODEL") || "gpt-6-astra";
  if (!supabaseUrl || !anonKey || !openaiKey) return json({ error: "Server configuration is incomplete" }, 503);
  // Validate the caller's access token with Supabase Auth; never trust a user_id supplied by the browser.
  const authResponse = await fetch(new URL("/auth/v1/user", supabaseUrl), {
    headers: { apikey: anonKey, Authorization: auth },
  });
  if (!authResponse.ok) return json({ error: "Invalid or expired session" }, 401);
  const body = await req.json().catch(() => null);
  if (!body || typeof body.message !== "string") return json({ error: "A message is required" }, 400);
  const message = body.message.trim().slice(0, 4000);
  if (!message) return json({ error: "Message is empty" }, 400);
  const history = Array.isArray(body.history)
    ? body.history.slice(-8).filter((item: any) =>
        item && ["user", "assistant"].includes(item.role) && typeof item.content === "string"
      ).map((item: any) => ({ role: item.role, content: item.content.slice(0, 1500) }))
    : [];
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${openaiKey}` },
    body: JSON.stringify({
      model,
      instructions: "You are ATOM, a practical personal-workspace assistant. Reply in the user's language, usually Chinese. Be clear and concise. You may suggest plans and task organization, but you cannot claim to have changed apps, files, accounts, or devices. Never request passwords, API keys, or payment details. Do not invent completed actions.",
      input: [...history, { role: "user", content: message }],
      max_output_tokens: 700,
      store: false,
    }),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    console.error("OpenAI response error", response.status, result?.error?.type || "unknown");
    return json({ error: "AI provider request failed" }, 502);
  }
  const reply = Array.isArray(result.output)
    ? result.output.flatMap((item: any) => item.type === "message" && Array.isArray(item.content)
        ? item.content.filter((part: any) => part.type === "output_text").map((part: any) => part.text)
        : []).join("\n").trim()
    : "";
  if (!reply) return json({ error: "AI provider returned no text" }, 502);
  return json({ reply });
});
