# Node with SQL

A small Node.js, Express, EJS, and MySQL application for viewing a user count, listing users, and changing a username after password confirmation.

## What the application does

1. `GET /` reads the number of rows in the `user` table and renders the home page.
2. `GET /users` reads all users and renders a table with their IDs, usernames, email addresses, and an edit link.
3. `GET /user/:id/edit` loads one user and renders a form prefilled with the current username.
4. The edit form submits `POST /user/:id/edit?_method=PATCH`. `method-override` converts that request to `PATCH /user/:id/edit`. The server checks the submitted password and, if it matches, updates the username and redirects to `/users`.

Passwords are not shown in the user list or edit page. The current implementation stores and compares passwords as plain text; this is suitable only as a learning example and should not be used for real accounts.

## Requirements

- Node.js and npm
- A running MySQL server
- A MySQL database named `delta`

## Setup and run

1. Install the dependencies:

   ```bash
   npm install
   ```

2. Create the database and table. For example, from a MySQL client:

   ```sql
   CREATE DATABASE delta;
   USE delta;
   ```

   Then execute the SQL in [`schema.sql`](schema.sql) to create the `user` table.

3. Configure the MySQL connection in `index.js` to match your local MySQL host, username, database, and password.

4. Start the app:

   ```bash
   node index.js
   ```

   The server listens on port **8080**. Open `http://localhost:8080/` for the count or `http://localhost:8080/users` for the user list. The project does not currently define a `start` npm script.

The app expects the `user` table to exist. It does not create or seed the table automatically. `getRandomUser()` in `index.js` creates a sample set of values with Faker, but currently only logs one generated record; it does not insert it into MySQL.

## Files and what they do

| File | Purpose |
| --- | --- |
| [`index.js`](index.js) | Express server, MySQL connection, request body and method-override middleware, Faker sample-data helper, routes, and server startup. |
| [`schema.sql`](schema.sql) | Defines the `user` table: a primary-key ID, unique username, unique required email, and required password. |
| [`views/home.ejs`](views/home.ejs) | Displays the user count passed in by the `/` route. |
| [`views/showusers.ejs`](views/showusers.ejs) | Iterates over the users passed in by `/users`, displays their ID, username, and email, and provides an edit form for each row. |
| [`views/edit.ejs`](views/edit.ejs) | Displays the selected user's email and a form for a new username plus password confirmation. |
| [`package.json`](package.json) | Project metadata and dependency declarations. It currently has a placeholder `test` script and no `start` script. |
| [`package-lock.json`](package-lock.json) | Records the resolved npm dependency versions for repeatable installs. |
| [`.gitignore`](.gitignore) | Excludes `node_modules/` from Git. |

## How the code is organized

### Server setup (`index.js`)

The app uses Express for routing, `mysql2` for database queries, EJS for HTML templates, and `method-override` so HTML forms can submit a PATCH-style update. `express.urlencoded()` parses form fields into `req.body`. The `views` directory is set explicitly relative to the project directory.

The MySQL connection currently uses hard-coded settings (`localhost`, user `root`, database `delta`, and a password). Change these settings for your environment. For a deployed or shared application, load credentials from environment variables and keep them out of source control.

### Database schema (`schema.sql`)

The `user` table has four columns:

- `id`: `VARCHAR(50)` primary key.
- `username`: `VARCHAR(50)`, unique.
- `email`: `VARCHAR(50)`, unique and required.
- `password`: `VARCHAR(50)`, required.

The schema only defines the table; it does not add records.

### Views (`views/`)

EJS templates receive data from route handlers and use `<%= ... %>` to render escaped values. `home.ejs` receives `count`; `showusers.ejs` receives `users`; and `edit.ejs` receives one `user` object.

## Current limitations

- Database error handling is incomplete: the routes use `try/catch` around asynchronous callback queries, but query errors are delivered to the callback and must be checked there. A database error can therefore lead to an invalid result access or an unhandled failure.
- The edit route builds SQL by interpolating route and form values directly into query strings. Use parameterized queries to avoid SQL injection and quoting bugs.
- Passwords are stored and compared as plain text. A real application must hash passwords with a suitable password-hashing library.
- The username has a unique constraint, but update errors (such as choosing an existing username) are not handled or shown to the user.
- There is no route for creating users, no seed script, and no authentication/session system; password confirmation here only gates this username update route.

## Dependencies

- `express`: HTTP server and routes.
- `mysql2`: MySQL client.
- `ejs`: server-rendered HTML templates.
- `method-override`: maps the edit form's `_method=PATCH` field to a PATCH request.
- `@faker-js/faker`: generates sample user values; currently used only for logging.
- `uuid`: listed as a dependency but not directly used in the current source.
