// Serverless endpoint for the homepage "Ask a question" form.
// Mirrors the original site's POST /api/contact behavior (returns ok on success).
// If a RESEND_API_KEY env var is configured, it will also email the question;
// otherwise it accepts the submission and returns success without sending.
module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  try {
    let body = req.body;
    if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
    if (!body || typeof body !== 'object') body = {};
    const { name, email, question } = body;
    if (!name || !email || !question) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const key = process.env.RESEND_API_KEY;
    if (key) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: 'Advocacy AI Training Series <onboarding@resend.dev>',
            to: ['curt@helloeiko.com'],
            reply_to: email,
            subject: `New question from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\n\n${question}`,
          }),
        });
      } catch (e) { /* swallow; still return ok to preserve UX */ }
    }

    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};
