# REST Example Web Service

by Sebastian Kurka

A RESTful web service, focusing on a shopping cart application. Users can manage their cart entries and view available items.

## API Endpoints

### Users

- `POST /v1/users`: Create a new user.
  - Request body:
    ```json
    {
      "username": "username",
      "password": "password1234"
    }
    ```
- `GET /v1/users/:userId`: Get a user by ID along with their cart entries.
- `DELETE /v1/users/:userId`: Delete a user by ID.

### Items

- `POST /v1/items`: Create a new item.

  - Request body:
    ```json
    {
      "name": "Wein",
      "priceEuroCent": "800"
    }
    ```

- `GET /v1/items`: Get all items.

- `GET /v1/items/:id`: Get a specific item by ID.

- `PATCH /v1/items/:id`: Update an item.

  - Request body (at least one of the fields is required):
    ```json
    {
      "name": "Bier",
      "priceEuroCent": "500"
    }
    ```

- `DELETE /v1/items/:id`: Delete an item by ID.

### Cart Entries

- `POST /v1/cartEntries`: Add a new cart entry.

  - Request body:
    ```json
    {
      "userId": "1",
      "itemId": "1",
      "quantity": "3"
    }
    ```

- `PATCH /v1/cartEntries/:id`: Update a cart entry.

  - Request body:
    ```json
    {
      "userId": "1",
      "itemId": "1",
      "quantity": "5"
    }
    ```

- `DELETE /v1/cartEntries/:id`: Delete a cart entry by ID.

## Installation

1. Clone the repository.
2. Navigate to the directory.
3. Run `npm install` to install the required dependencies.
4. Start the server with `npm start`.

The script was developed for Node 20.

## Development Scripts

- `npm run start`: Start the application.
- `npm run watch`: Watch and reload the server on changes.
- `npm test`: Run tests.
- `npm run test:watch`: Run tests and watch for changes.

## Dependencies

- `bcrypt`: Used for hashing and comparing passwords.
- `express`: Web server framework.
- `sqlite3`: SQLite database library.

## Dev Dependencies

- `jest`: Testing framework.
- `supertest`: HTTP testing library.
