const { client } = require('./db');

const init = async()=> {
    console.log('connecting to database');
    await client.connect();
    console.log('connected to database');
};

init();
