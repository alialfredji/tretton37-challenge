### Introduction

This is an Express-based application designed to offer API endpoints related to coworkers. The app utilizes a PostgreSQL database for persistent data storage and incorporates authentication management through JSON Web Tokens (JWT).

You can access the public API at [https://tretton-37-challenge.onrender.com](https://tretton-37-challenge.onrender.com).

For those keen on diving right in and want to use the public api, here's a brief overview of the available endpoints:

- User Authentication: `POST: /api/login`
- Fetch All Coworkers: `GET: /api/coworkers`
- Filter Coworkers by Name: `GET: /api/coworkers?filter=[string]`
- Paginate Coworkers List: `GET: /api/coworkers?start=[number]&end=[number]`
- Retrieve Specific Coworker: `GET: /api/coworker/:id`
- Update Coworker Details: `POST: /api/coworker`
- Reset Coworker Data: `POST: /api/reset-coworkers`

For a detailed breakdown of each endpoint, including request and response formats, head over to the [API Documentation](#api-documentation) section below

### Prerequisites

Before diving into the setup, ensure you have the following software/tools installed:
- Node.js (accompanied by NPM)
- PostgreSQL
### Database Configuration

1. **Using an Existing Database**: If you're keen on bypassing the setup of a new PostgreSQL instance and want a quick setup, you can use the following connection string hosted on [render.com](https://render.com):

```bash
postgres://tretton37_challenge_db:Dm4uaTyNio3POEdh9ZLvBQhFmNxl6aPd@dpg-cjcl4qrbq8nc73bavak0-a.frankfurt-postgres.render.com/tretton37_challenge_db
```

2. **Setting Up a New Database on Render**:
    
    - Navigate to [render.com](https://render.com/).
    - Create a new PostgreSQL database instance.
    - Once set up, you'll find the `External Database URL` on your dashboard. This will be your connection string (`PG_STRING`).

> **Tip**: If you're sourcing the database from render.com, remember to set the `PG_SSL_REQUIRED` environment variable to `true` to ensure secure connections.

### Installation & Configuration

1. Begin by cloning the repository and navigating to the project directory:
```bash
git clone git@github.com:alialfredji/tretton37-challenge.git
cd tretton37-challenge
```

2. Install the required Node.js dependencies with NPM:
```bash
npm install
```

3. Create a `.env` file in the project's root. You can use `.env.example` as a reference. Populate it with the necessary values:

```csharp
PG_STRING=<Your PostgreSQL connection string or use the provided one above>
PG_SSL_REQUIRED=<true/false (Default to 'true' if using render.com)>
JWT_SECRET=<Your JWT secret key>
JWT_SKIP_AUTH=<true/false (Use 'true' to bypass authentication)>
PORT=<Desired port number for the server, e.g., 8080>`
```

4. Launching the Application:
    - Development Mode: `npm run dev`
    - Production Mode: `npm start`


### API Documentation

#### Login endpoint

Generates and returns a JWT token for the provided username.
```js
POST: /api/login

Body:
{
  username: String
}

Response:
  - String JWT token string
```

#### Get All coworkers endpoint

Retrieves a list of coworkers based on the provided query parameters.
```js
GET: /api/coworkers

Headers:
  - Authorization: Bearer <JWT TOKEN>

Query params:
  - start: Number
  - end: Number
  - filter: String

Response:
{
  data: [{
    id: Number,
    name: String,
    text: String,
    city: String,
    country: String,
    imagePortraitUrl: String,
    imageFullUrl: String
  }
  ...,
  ],
  totalLength: Number,
}
```

#### Get Single coworker endpoint
Fetches a specific coworker based on their ID
```js
GET: /api/coworker/:id

Headers:
  - Authorization: Bearer <JWT TOKEN>

Response:
{
  name: String,
  text: String,
  imagePortraitUrl: String
}
```

#### Edit coworker endpoint
Edits the details of a specific coworker.
```js
POST: /api/coworker

Headers:
  - Authorization: Bearer <JWT TOKEN>

Body:
{
  id: String/Number REQUIRED,
  name: String,
  city: String,
  text: String
}

Response:
{
  name: String,
  text: String,
  city: String
}
```

#### Reset coworkers data endpoint
Resets and repopulates coworker data from an external source
```js
POST: /api/reset-coworkers

Headers:
  - Authorization: Bearer <JWT TOKEN>

Response:
  - String message inidicating job is finished
```

## Note

- If you haven't populated the coworker data in the database, you'll need to execute `/api/reset-coworkers`. If `JWT_SKIP_AUTH` is set to `false`, you must login before accessing `/api/reset-coworkers`.
- Always ensure to pass the JWT token in the Authorization header for the endpoints that require authentication if `JWT_SKIP_AUTH` is set to `false`.
- While most endpoints require JWT authentication, you can bypass this by setting the `JWT_SKIP_AUTH` environment variable to `true`.
- The provided JWT token has a lifespan of 1 hour. Remember to reauthenticate if your session expires.

