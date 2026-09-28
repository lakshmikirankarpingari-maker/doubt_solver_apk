export default async function handler(req, res) {
  try {
    const { question, image } = req.body;

    // If no API key or no credits → fallback
    if (!process.env.OPENAI_API_KEY) {
      return res.status(200).json({
        answer: getFallbackAnswer(question)
      });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: question || "Solve the problem"
          }
        ]
      })
    });

    const data = await response.json();

    // If API fails (like no credits)
    if (!response.ok) {
      return res.status(200).json({
        answer: getFallbackAnswer(question)
      });
    }

    return res.status(200).json({
      answer: data.choices?.[0]?.message?.content || getFallbackAnswer(question)
    });

  } catch (error) {
    return res.status(200).json({
      answer: getFallbackAnswer(question)
    });
  }
}
function getFallbackAnswer(q) {
  if (!q) return "⚠️ No question provided";

  q = q.toLowerCase();

  // Simple math solving
  try {
    if (q.includes("+") || q.includes("-") || q.includes("*") || q.includes("/")) {
      const result = eval(q.replace(/[^0-9+\-*/().]/g, ""));
      return `🧠 Basic Solver Result: ${result}`;
    }
  } catch {}

  if (q.includes("force")) {
    return "Force = mass × acceleration (F = m × a)";
  }

  if (q.includes("energy")) {
    return "Kinetic Energy = 1/2 × m × v²";
  }

  return "⚠️ AI credits not available. Showing basic answer only.";
}
