import express from 'express';

const router = express.Router();

// Create a new reservation
router.post('/reservations', (req, res) => {
  const { numberOfPeople, time, date } = req.body;

  // Validation
  if (!numberOfPeople || !time || !date) {
    return res
      .status(400)
      .json({ error: 'Missing required fields: numberOfPeople, time, date' });
  }

  // Logic to create reservation in database
  const reservation = {
    id: Math.random().toString(36).substr(2, 9),
    numberOfPeople,
    time,
    date,
    createdAt: new Date(),
  };

  res
    .status(201)
    .json({ message: 'Reservation created successfully', reservation });
});

// Get all reservations
router.get('/reservations', (req, res) => {
  // Logic to retrieve all reservations
  res.json({ message: 'Retrieved all reservations', reservations: [] });
});

// Get reservation by ID
router.get('/reservations/:id', (req, res) => {
  const { id } = req.params;
  // Logic to retrieve a specific reservation
  res.json({ message: `Retrieved reservation with id: ${id}` });
});

// Delete (cancel) an existing reservation
router.delete('/reservations/:id', (req, res) => {
  const { id } = req.params;

  // Logic to delete reservation from database
  res.json({ message: `Reservation with id: ${id} has been cancelled` });
});

// Update an existing reservation
router.put('/reservations/:id', (req, res) => {
  const { id } = req.params;
  const { numberOfPeople, time, date } = req.body;

  // Validation
  if (!numberOfPeople || !time || !date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (numberOfPeople < 1 || numberOfPeople > 6) {
    return res
      .status(400)
      .json({ error: 'Number of people must be between 1 and 6' });
  }

  const timeRegex = /^(1[7-9]|2[0-2]):(00|30)$/;
  if (!timeRegex.test(time)) {
    return res
      .status(400)
      .json({ error: 'Time must be between 5pm-11pm in 30-minute intervals' });
  }

  const reservationDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (reservationDate < today) {
    return res
      .status(400)
      .json({ error: 'Date must be today or in the future' });
  }

  // Logic to update reservation
  res.json({
    message: `Reservation with id: ${id} has been updated`,
    updatedData: { numberOfPeople, time, date },
  });
});

export default router;
