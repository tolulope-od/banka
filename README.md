# banka

A light-weight core banking application that supports a single bank and allows users create bank accounts and make withdrawals &amp; deposits by visiting a local branch

![GitHub](https://img.shields.io/github/license/tolulope-od/banka.svg?style=plastic)
[![Build Status](https://travis-ci.org/tolulope-od/banka.svg?branch=develop)](https://travis-ci.org/tolulope-od/banka)
[![Coverage Status](https://coveralls.io/repos/github/tolulope-od/banka/badge.svg?branch=develop)](https://coveralls.io/github/tolulope-od/banka?branch=develop)
![GitHub language count](https://img.shields.io/github/languages/count/tolulope-od/banka.svg)
[![Maintainability](https://api.codeclimate.com/v1/badges/fc4ec657a924070a7404/maintainability)](https://codeclimate.com/github/tolulope-od/banka/maintainability)
![GitHub closed pull requests](https://img.shields.io/github/issues-pr-closed/tolulope-od/banka.svg)

# Website

https://tolulope-od.github.io/banka/

# Table of Contents

1. <a href="#hosted-app">Hosted App</a>
2. <a href="#pivotal-tracker-board">Pivotal Tracker Board</a>
3. <a href="#api-documentation">API Documentation</a>
4. <a href="#built-with">Built With</a>
5. <a href="#getting-started">Getting Started</a>
6. <a href="#application-features">Application Features</a>
7. <a href="#installation">Installation</a>
8. <a href="#running-tests">Running Tests</a>
9. <a href="#deployment">Deployment</a>
10. <a href="#api-endpoints">API endpoints</a>
11. <a href="#license">License</a>
12. <a href="#author">Author</a>
13. <a href="#acknowledgments">Acknowledgments</a>

## Hosted App

https://bankaa-app.herokuapp.com

## Pivotal Tracker Board

https://www.pivotaltracker.com/n/projects/2319922

## API Documentation

https://bankaa-app.herokuapp.com/api-docs/

## Built With

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Html]()
- [CSS]()
- [Postgres](https://www.postgresql.org/)

## Getting Started

**Development**

To clone and run this application, you'll need [Git](https://git-scm.com) installed on your computer. From your command line:

```bash
# Clone this repository
$ git clone https://github.com/tolulope-od/banka.git
```

Refer to the [.env.sample](.env.sample) file for the required environment variables to get the application up and running.

**Production**

This application's frontend is served on [this](https://tolulope-od.github.io/banka/) url and accomodates two types of users; a **client** and an **admin/staff**. All types of users share the same login page. The idea is to check the type of user upon login and then redirect to the appropriate pages. A sample admin login credential as it's stored in the database is:

```gherkin
email: obiwan@therebellion.com
password: password123
```

Upon successful login, the sole admin has the ability to add other staff and/or admin.

## Application Features

- User Registration
- Bank Account Creation
- Bank deposits and withdrawals
- Bank account management

## Installation

To run this application in development mode, you'll need [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Enter the project directory
$ cd banka

# Install dependencies
$ npm install

# Start the development server
$ npm run dev

```

When the development server is up and running (i.e displays a success message on your command line), you can test the server response by visiting the following endpoint using Postman:

`GET localhost:5000/`

For a sample response from the server

## Running Tests

Unit tests are available on this repository and dependencies to enable them work are included in the `package.json` file. To run unit tests, you can do the following:

```bash
# Enter the project's directory
$ cd banka/

# To run the available unit tests
$ npm test
```

**Install nyc globally to generate and view coverage reports via the command line**

```bash
npm install -g nyc
```

**Using Postman**

If you have Postman installed, you can test routes listed below. An example response spec would be:

```bash
# on successful request to the sign in route /api/v1/auth/signin
{
  "status": 200,
  "data": [
    {
      "token": "kjkskjhfdsjhf_o.jkshdjhsj",
      "id", 1,
      "firstName": "Kylo",
      "lastName": "Ren",
      "email": "kylo@theempire.com"
    }
  ]
}
```

```bash
# on errored request to the sign in route /api/v1/auth/signin
{
  "status": 404,
  "error": "User not found"
}
```

## Deployment

To build out the source code of this project into a browser-friendly and easily depolyable module, an npm script has been provided for that. Simply run the build script and deploy to the platform of your choice

```bash
# cd into project directory
$ cd banka/

# run build script
$ npm run build
```

## API endpoints

| Method   |                    Endpoint                     |                Description                 |        Access         |
| :------- | :---------------------------------------------: | :----------------------------------------: | :-------------------: |
| `POST`   |              `/api/v1/auth/signup`              |       Register a new user on the app       |        Clients        |
| `POST`   |              `/api/v1/auth/signin`              |           Login an existing user           | Clients & Staff/Admin |
| `POST`   |               `/api/v1/accounts`                |             Create an account              |        Client         |
| `PATCH`  |       `/api/v1/accounts/<account-number>`       |          Edit an accounts status           |      Admin/Staff      |
| `DELETE` |       `/api/v1/account/<account-number>`        |             Delete an account              |      Admin/Staff      |
| `POST`   |  `/api/v1/transactions/<account-number>/debit`  |              Debit an account              |      Admin/Staff      |
| `POST`   | `/api/v1/transactions/<account-number>/credit`  |             Credit an account              |      Admin/Staff      |
| `GET`    | `api/v1/accounts/<account-number>/transactions` |   View an account's Transaction history    | Clients & Admin/Staff |
| `GET`    |   `api/v1/user/<user-email-address>/accounts`   | View all accounts owned by a specific user | Clients & Admin/Staff |
| `GET`    |       `api/v1/accounts/<account-number>`        |      View aspecific account's details      | Clients & Admin/Staff |
| `GET`    |                `api/v1/accounts`                |      View a list of all bank accounts      |      Admin/Staff      |
| `GET`    |         `api/v1/accounts?status=active`         |  View a list of all active bank accounts   |      Admin/Staff      |
| `GET`    |        `api/v1/accounts?status=dormant`         |  View a list of all dormant bank accounts  |      Admin/Staff      |
| `GET`    |   `api/v1/user/<user-email-address>/accounts`   | View all accounts owned by a specific user |      Admin/Staff      |
| `GET`    |                 `api/v1/users`                  |            Admin get all staff             |      Admin/Staff      |
| `PATCH`  |                 `api/v1/users`                  |        Upgrade a client to a staff         |      Admin Only       |
| `POST`   |                 `api/v1/users`                  |            Admin create cashier            |      Admin Only       |

Refer to the [API Documentation](https://bankaa-app.herokuapp.com/api-docs/) for detailed information on all endpoints

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Author

- **Tolulope Odueke**

## Acknowledgments

- Brad Traversy - [MERN Stack Front To Back](https://www.udemy.com/mern-stack-front-to-back/)
- Bolaji Olajide - [Intro to Building APIs](https://www.youtube.com/watch?v=WLIqvJzD9DE)
