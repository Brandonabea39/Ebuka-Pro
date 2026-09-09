const BIN_ID  = "6aa01157ffd5d16053ed5ce4";
const API_KEY = "$2a$10$P.BqoFgIbnQVH9pvRRkCuOun8sZH7eay5cQZ1cH1wi3u77XTPrely";
const BIN_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  const headers = {
    "Content-Type": "application/json",
    "X-Master-Key": API_KEY,
    "X-Bin-Versioning": "false",
  };

  try {
    if (req.method === "GET") {
      const response = await fetch(`${BIN_URL}/latest`, { headers });
      const text = await response.text();
      console.log("JSONBin GET status:", response.status, text.slice(0, 200));
      if (!response.ok) return res.status(response.status).json({ error: "JSONBin GET failed", detail: text });
      const json = JSON.parse(text);
      return res.status(200).json(json.record);

    } else if (req.method === "PUT") {
      let body = req.body;
      if (typeof body === "object") body = JSON.stringify(body);
      const response = await fetch(BIN_URL, { method: "PUT", headers, body });
      const text = await response.text();
      console.log("JSONBin PUT status:", response.status, text.slice(0, 200));
      if (!response.ok) return res.status(response.status).json({ error: "JSONBin PUT failed", detail: text });
      return res.status(200).json({ ok: true });

    } else {
      return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (err) {
    console.error("DB proxy exception:", err.message);
    return res.status(500).json({ error: err.message });
  }
}
