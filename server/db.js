const pg = require("pg");
const uuid = require("uuid");
require("dotenv").config();

const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/acme_reservation_planner"
);

async function createTables() {
  const SQL = `
    DROP TABLE IF EXISTS reservations;
    DROP TABLE IF EXISTS customers;
    DROP TABLE IF EXISTS restaurants;

    CREATE TABLE customers(
      id UUID PRIMARY KEY,
      name VARCHAR(255) NOT NULL
    );

    CREATE TABLE restaurants(
      id UUID PRIMARY KEY,
      name VARCHAR(255) NOT NULL
    );

    CREATE TABLE reservations(
      id UUID PRIMARY KEY,
      date DATE NOT NULL,
      party_count INTEGER NOT NULL,
      restaurant_id UUID REFERENCES restaurants(id) NOT NULL,
      customer_id UUID REFERENCES customers(id) NOT NULL
    );
  `;
  await client.query(SQL);
}

async function createCustomer(name) {
  const SQL = `
    INSERT INTO customers(id, name) VALUES($1, $2) RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), name]);
  return response.rows[0];
}

async function createRestaurant(name) {
  const SQL = `
    INSERT INTO restaurants(id, name) VALUES($1, $2) RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), name]);
  return response.rows[0];
}

async function fetchCustomers() {
  const SQL = `SELECT * FROM customers`;
  const response = await client.query(SQL);
  return response.rows;
}

async function fetchRestaurants() {
  const SQL = `SELECT * FROM restaurants`;
  const response = await client.query(SQL);
  return response.rows;
}

async function createReservation({ date, party_count, restaurant_id, customer_id }) {
  const SQL = `
    INSERT INTO reservations(id, date, party_count, restaurant_id, customer_id)
    VALUES($1, $2, $3, $4, $5) RETURNING *
  `;
  const response = await client.query(SQL, [
    uuid.v4(),
    date,
    party_count,
    restaurant_id,
    customer_id
  ]);
  return response.rows[0];
}

async function fetchReservations() {
  const SQL = `SELECT * FROM reservations`;
  const response = await client.query(SQL);
  return response.rows;
}

async function destroyReservation(id, customer_id) {
  const SQL = `
    DELETE FROM reservations WHERE id=$1 AND customer_id=$2
  `;
  await client.query(SQL, [id, customer_id]);
}

module.exports = {
  client,
  createTables,
  createCustomer,
  createRestaurant,
  fetchCustomers,
  fetchRestaurants,
  createReservation,
  fetchReservations,
  destroyReservation
};