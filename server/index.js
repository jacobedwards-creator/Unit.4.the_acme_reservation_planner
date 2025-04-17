const express = require('express');
const {
  client,
  createTables,
  createCustomer,
  createRestaurant,
  fetchCustomers,
  fetchRestaurants,
  createReservation,
  fetchReservations,
  destroyReservation
} = require('./db');
const app = express();

app.use(express.json());

// Routes
app.get('/api/customers', async (req, res, next) => {
  try {
    res.send(await fetchCustomers());
  } catch (error) {
    next(error);
  }
});

app.get('/api/restaurants', async (req, res, next) => {
  try {
    res.send(await fetchRestaurants());
  } catch (error) {
    next(error);
  }
});

app.get('/api/reservations', async (req, res, next) => {
  try {
    res.send(await fetchReservations());
  } catch (error) {
    next(error);
  }
});

app.post('/api/customers/:id/reservations', async (req, res, next) => {
  try {
    const { restaurant_id, date, party_count } = req.body;
    const reservation = await createReservation({
      customer_id: req.params.id,
      restaurant_id,
      date,
      party_count
    });
    res.status(201).send(reservation);
  } catch (error) {
    next(error);
  }
});

app.delete('/api/customers/:customer_id/reservations/:id', async (req, res, next) => {
  try {
    await destroyReservation(req.params.id, req.params.customer_id);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).send({ error: err.message });
});

// Setup function
const init = async () => {
  await client.connect();
  console.log('Connected to database');
  
  await createTables();
  console.log('Tables created');
  
  // Create test data
  const [moe, lucy, ethyl, sushi, italian, bbq] = await Promise.all([
    createCustomer('moe'),
    createCustomer('lucy'),
    createCustomer('ethyl'),
    createRestaurant('Sushi Place'),
    createRestaurant('Italian Place'),
    createRestaurant('BBQ Place')
  ]);
  
  console.log(await fetchCustomers());
  console.log(await fetchRestaurants());
  
  const [reservation] = await Promise.all([
    createReservation({
      date: '04/25/2025',
      party_count: 2,
      restaurant_id: sushi.id,
      customer_id: moe.id
    })
  ]);
  
  console.log(await fetchReservations());
  
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Listening on port ${port}`));
};

init();