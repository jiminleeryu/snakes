const Score = require('./backend/scoreModel');


app.post('/api/scores', async (req, res) => {
  const { username, score } = req.body;

  try {
    const newScore = new Score({ username, score });
    await newScore.save();
    res.status(201).json({ message: 'Score added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
