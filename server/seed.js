const {
    client,
    createTables,
    createCustomer,
    createRestaurant,
    fetchCustomers,
    fetchRestaurants,
    createReservation,
    fetchReservations,
    destroyReservation,
  } = require("./db");
  
  const init = async () => {
    await client.connect();
    console.log("connected to database");
  
    await createTables();
    console.log("tables created");
  
    const [moe, lucy, ethyl, sushi, italian, bbq] = await Promise.all([
      createCustomer("Moe"),
      createCustomer("Lucy"),
      createCustomer("Ethyl"),
      createRestaurant("Sushi Place"),
      createRestaurant("Italian Place"),
      createRestaurant("BBQ Place"),
    ]);
    console.log("customers and restaurants created");
  
    console.log(await fetchCustomers());
    console.log(await fetchRestaurants());
  
    const [reservation1, reservation2] = await Promise.all([
      createReservation({
        date: "04/25/2025",
        party_count: 2,
        restaurant_id: sushi.id,
        customer_id: moe.id,
      }),
      createReservation({
        date: "11/10/2025",
        party_count: 4,
        restaurant_id: italian.id,
        customer_id: lucy.id,
      }),
    ]);
    console.log("reservations created");
  
    console.log(await fetchReservations());
  
    await destroyReservation(reservation1.id, moe.id);
    console.log("deleted reservation");
  
    console.log(await fetchReservations());
  
    await client.end();
  };
  
  init();