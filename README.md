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
3. <a href="#built-with">Built With</a>
4. <a href="#getting-started">Getting Started</a>
5. <a href="#application-features">Application Features</a>
6. <a href="#installation">Installation</a>
7. <a href="#running-tests">Running Tests</a>
8. <a href="#deployment">Deployment</a>
9. <a href="#api-endpoints">API endpoints</a>
10. <a href="#license">License</a>
11. <a href="#author">Author</a>
12. <a href="#acknowledgments">Acknowledgments</a>

## Hosted App

https://bankaa-app.herokuapp.com

## Pivotal Tracker Board

https://www.pivotaltracker.com/n/projects/2319922

## Built With

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Html]()
- [CSS]()

## Getting Started

To clone and run this application, you'll need [Git](https://git-scm.com) installed on your computer. From your command line:

```bash
# Clone this repository
$ git clone https://github.com/tolulope-od/banka.git
```

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

`GET localhost:5000/test` 

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
  "data": {
    "token": "kjkskjhfdsjhf_o.jkshdjhsj",
    "id", 1,
    "firstName": "Kylo",
    "lastName": "Ren",
    "email": "kylo@theempire.com"
  }
}
```

```bash
# on errored request to the sign in route /api/v1/auth/signin
{
  "status": 400,
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

```
POST Request -> localhost:5000/api/v1/auth/signup
POST Request -> localhost:5000/api/v1/auth/signin
POST Request -> localhost:5000/api/v1/accounts
PATCH Request -> localhost:5000/api/v1/accounts/<account-number>
DELETE Request -> localhost:5000/api/v1/account/<account-number>
POST Request -> localhost:5000/api/v1/transactions/<account-number>/debit
POST Request -> localhost:5000/api/v1/transactions/<account-number>/credit
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Author

- **Tolulope Odueke**

## Acknowledgments
- Brad Traversy - [MERN Stack Front To Back](https://www.udemy.com/mern-stack-front-to-back/)
- Bolaji Olajide - [Intro to Building APIs](https://www.youtube.com/watch?v=WLIqvJzD9DE)