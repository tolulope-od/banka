import { Client } from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import Debug from 'debug';

const debug = Debug('postgres');

dotenv.config();

const { USER, HOST, PASSWORD, DATABASE, DB_PORT, ADMIN_PASS, USER_PASS } = process.env;

const connString = new Client({
  user: USER,
  host: HOST,
  password: PASSWORD,
  database: DATABASE,
  port: DB_PORT
});

connString.connect();

const adminPass = bcrypt.hashSync(ADMIN_PASS, 10);
const userPass = bcrypt.hashSync(USER_PASS, 10);

const createTable = async () => {
  try {
    const query = `DROP TABLE IF EXISTS users CASCADE;
  DROP TABLE IF EXISTS accounts CASCADE;
  DROP TABLE IF EXISTS transactions CASCADE;
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    firstName VARCHAR NOT NULL,
    lastName VARCHAR NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    password TEXT NOT NULL,
    isAdmin BOOLEAN NOT NULL,
    phoneNumber VARCHAR UNIQUE NULL,
    type VARCHAR NOT NULL,
    address TEXT NULL,
    avatar TEXT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS accounts (
    id SERIAL PRIMARY KEY,
    accountNumber BIGINT NOT NULL,
    owner INT NOT NULL,
    type VARCHAR NOT NULL,
    status VARCHAR NOT NULL,
    balance NUMERIC NOT NULL,
    ownerEmail TEXT NOT NULL,
    createdOn TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    type VARCHAR NOT NULL,
    accountNumber BIGINT NOT NULL,
    owner INT NOT NULL,
    cashier INT NOT NULL,
    amount NUMERIC NOT NULL,
    oldBalance NUMERIC NOT NULL,
    newBalance NUMERIC NOT NULL,
    createdOn TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(cashier) REFERENCES users(id) ON DELETE CASCADE
  );
  
  INSERT INTO users (email, firstName, lastName, password, address, avatar, phoneNumber, type, isAdmin)
  VALUES('obiwan@therebellion.com', 'Obiwan', 'Kenobi', '${adminPass}', 'Lane 251, The Empire', '/uploads/avatar/obiwan.jpg', 039084, 'staff', true);
  INSERT INTO users (email, firstName, lastName, password, address, avatar, phoneNumber, type, isAdmin)
  VALUES('thor@avengers.com', 'Thor', 'Odinson', '${userPass}', 'Asgardian Empire', '/uploads/avatar/thor.jpg', 09839084, 'client', false);
  INSERT INTO users (email, firstName, lastName, password, address, avatar, phoneNumber, type, isAdmin)
  VALUES('olegunnar@manutd.com', 'Ole', 'Solksjaer', '${userPass}', 'Old Trafford, Manchester', '/uploads/avatar/ole.jpg', 08739084, 'client', false);
  INSERT INTO users (email, firstName, lastName, password, address, avatar, phoneNumber, type, isAdmin)
  VALUES('kyloren@vader.com', 'Kylo', 'Ren', '${adminPass}', 'Tatooine, Planet C53', '/uploads/avatar/kylo.jpg', 08939084, 'staff', true);
  INSERT INTO accounts (accountNumber, owner, ownerEmail, type, status, balance)
  VALUES(5563847290, 2, 'thor@avengers.com', 'current', 'active', 349876358.08);
  INSERT INTO accounts (accountNumber, owner, ownerEmail, type, status, balance)
  VALUES(8897654324, 3, 'olegunnar@manutd.com', 'savings', 'dormant', 7665435.97);
  INSERT INTO transactions (type, accountNumber, owner, cashier, amount, oldBalance, newBalance)
  VALUES('credit', 8897654324, 3, 4, 400500.0, 7264935.97, 7665435.97);
  INSERT INTO transactions (type, accountNumber, owner, cashier, amount, oldBalance, newBalance)
  VALUES('debit', 8897654324, 3, 1, 100500.0, 7264935.97, 7665435.97);
  INSERT INTO transactions (type, accountNumber, owner, cashier, amount, oldBalance, newBalance)
  VALUES('credit', 5563847290, 2, 4, 400500.0, 7264935.97, 7665435.97);`;

    const seeder = await connString.query(query);
    debug(seeder);
    connString.end();
  } catch (err) {
    debug(err.message);
    await connString.end();
  }
};

createTable();
