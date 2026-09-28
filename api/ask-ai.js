export default async function handler(req, res) {
  try {
    const { question } = req.body || {};

    if (!question) {
      return res.status(200).json({ answer: "Ask something first" });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: question,
      }),
    });

    const data = await response.json();

    const answer =
      data?.output?.[0]?.content?.[0]?.text ||
      "⚠️ AI did not respond";

    res.status(200).json({ answer });

  } catch (err) {
    console.error(err);
    res.status(200).json({
      answer: "⚠️ AI error (check API key or credits)"
    });
  }
}
