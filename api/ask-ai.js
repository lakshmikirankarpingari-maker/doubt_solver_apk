export default async function handler(req, res) {
  try {
    const { question } = req.body;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: question
      })
    });

    const data = await response.json();

    const answer =
      data.output?.[0]?.content?.[0]?.text || "No answer";

    res.status(200).json({ answer });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}
