export async function onRequestPost({ request, env }) {
  if (!env.XAI_API_KEY) {
    return new Response(
      JSON.stringify({ error: "Missing XAI_API_KEY on server" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  let body = {};
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid JSON body" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const prompt = body.prompt;
  const model = body.model || "grok-3-mini";
  const max_tokens = body.max_tokens || 1000;

  if (!prompt || typeof prompt !== "string") {
    return new Response(
      JSON.stringify({ error: "Missing prompt" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const upstream = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.XAI_API_KEY}`
    },
    body: JSON.stringify({
      model,
      max_tokens,
      messages: [{ role: "user", content: prompt }]
    })
  });

  const text = await upstream.text();
  return new Response(text, {
    status: upstream.status,
    headers: { "Content-Type": "application/json" }
  });
}
