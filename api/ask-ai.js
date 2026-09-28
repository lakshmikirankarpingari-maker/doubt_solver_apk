export default async function handler(req, res) {
  try {
    // simple test first
    res.status(200).json({ answer: "API is working now 🔥" });

  } catch (error) {
    res.status(500).json({ error: "Server crashed" });
  }
}
