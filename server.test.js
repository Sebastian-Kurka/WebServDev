import supertest from "supertest";
import { app } from "./server.js";
import { clearAllTables } from "./database.js";
import { insertUser } from "./users/model.js";

describe("REST API tests", () => {
  let request;

  beforeEach(async () => {
    clearAllTables();
    await insertUser("adminuser", "adminpassword");
    request = supertest(app);
  });

  it("should create a user", async () => {
    const response = await request.post("/v1/users").send({
      username: "testuser",
      password: "testpassword",
    });
    expect(response.status).toBe(200);
    const json = JSON.parse(response.text);
    expect(json.userId).toBe(2);
  });

  it("should not create a user with duplicate username", async () => {
    const response1 = await request.post("/v1/users").send({
      username: "testuser",
      password: "testpassword",
    });
    expect(response1.status).toBe(200);

    const response2 = await request.post("/v1/users").send({
      username: "testuser",
      password: "testpassword",
    });
    expect(response2.status).toBe(409);
  });

  it("should not create a user without username", async () => {
    const response = await request.post("/v1/users").send({
      password: "testpassword",
    });
    expect(response.status).toBe(400);
  });

  it("should not create a user without password", async () => {
    const response = await request.post("/v1/users").send({
      username: "testuser",
    });
    expect(response.status).toBe(400);
  });

  it("should create and get a user", async () => {
    const response = await request.post("/v1/users").send({
      username: "testuser",
      password: "testpassword",
    });
    expect(response.status).toBe(200);
    const userId = JSON.parse(response.text).userId;

    const response2 = await request
      .get(`/v1/users/${userId}`)
      .auth("testuser", "testpassword");

    expect(response2.status).toBe(200);
    const user = JSON.parse(response2.text);
    expect(user.id).toBeDefined();
    expect(user.username).toBe("testuser");
    expect(user.totalPriceEuroCent).toBe(0);
    expect(user.cart).toEqual([]);
  });

  it("should not allow to get a user unauthenticated", async () => {
    const response = await request.post("/v1/users").send({
      username: "testuser",
      password: "testpassword",
    });
    expect(response.status).toBe(200);
    const userId = JSON.parse(response.text).userId;

    const response2 = await request
      .get(`/v1/users/${userId}`)
      .auth("testuser", "WRONG PASSWORD");

    expect(response2.status).toBe(401);
    expect(JSON.parse(response2.text).error).toBe("invalid credentials");
  });

  it("should delete a user", async () => {
    const response = await request.post("/v1/users").send({
      username: "testuser",
      password: "testpassword",
    });
    expect(response.status).toBe(200);
    const userId = JSON.parse(response.text).userId;
    const response2 = await request
      .delete(`/v1/users/${userId}`)
      .auth("testuser", "testpassword");
    expect(response2.status).toBe(200);
    expect(JSON.parse(response2.text).userId).toBeDefined();
  });

  it("should not delete a user unauthenticated", async () => {
    const response = await request.post("/v1/users").send({
      username: "testuser",
      password: "testpassword",
    });
    expect(response.status).toBe(200);
    const userId = JSON.parse(response.text).userId;
    const response2 = await request
      .delete(`/v1/users/${userId}`)
      .auth("testuser", "WRONG PASSWORD");
    expect(response2.status).toBe(401);
    expect(JSON.parse(response2.text).error).toBe("invalid credentials");
  });

  // item tests

  it("should not create an item without authentication", async () => {
    const response = await request.post("/v1/items").send({
      name: "unauthItem",
      priceEuroCent: 100,
    });
    expect(response.status).toBe(401);
  });

  it("should not get all items without authentication", async () => {
    const response = await request.get("/v1/items");
    expect(response.status).toBe(401);
  });

  it("should not get an item by id without authentication", async () => {
    const response = await request.get("/v1/items/1");
    expect(response.status).toBe(401);
  });

  it("should not update an item without authentication", async () => {
    const response = await request.patch("/v1/items/1").send({
      name: "updatedItem",
      priceEuroCent: 150,
    });
    expect(response.status).toBe(401);
  });

  it("should not delete an item without authentication", async () => {
    const response = await request.delete("/v1/items/1");
    expect(response.status).toBe(401);
  });

  it("should not create an item with incorrect authentication", async () => {
    const response = await request
      .post("/v1/items")
      .auth("wronguser", "wrongpassword")
      .send({
        name: "unauthItem",
        priceEuroCent: 100,
      });
    expect(response.status).toBe(401);
  });

  it("should not get all items with incorrect authentication", async () => {
    const response = await request
      .get("/v1/items")
      .auth("wronguser", "wrongpassword");
    expect(response.status).toBe(401);
  });

  it("should not get an item by id with incorrect authentication", async () => {
    const response = await request
      .get("/v1/items/1")
      .auth("wronguser", "wrongpassword");
    expect(response.status).toBe(401);
  });

  it("should not update an item with incorrect authentication", async () => {
    const response = await request
      .patch("/v1/items/1")
      .auth("wronguser", "wrongpassword")
      .send({
        name: "updatedItem",
        priceEuroCent: 150,
      });
    expect(response.status).toBe(401);
  });

  it("should not delete an item with incorrect authentication", async () => {
    const response = await request
      .delete("/v1/items/1")
      .auth("wronguser", "wrongpassword");
    expect(response.status).toBe(401);
  });

  it("should create an item", async () => {
    const response = await request
      .post("/v1/items")
      .auth("adminuser", "adminpassword")
      .send({
        name: "testItem",
        priceEuroCent: 100,
      });
    expect(response.status).toBe(200);
    const json = JSON.parse(response.text);
    expect(json.itemId).toBe(1);
  });

  it("should not create an item with duplicate name", async () => {
    await request.post("/v1/items").auth("adminuser", "adminpassword").send({
      name: "testItem",
      priceEuroCent: 100,
    });

    const response = await request
      .post("/v1/items")
      .auth("adminuser", "adminpassword")
      .send({
        name: "testItem",
        priceEuroCent: 150,
      });
    expect(response.status).toBe(409);
  });

  it("should get all items", async () => {
    await request.post("/v1/items").auth("adminuser", "adminpassword").send({
      name: "item1",
      priceEuroCent: 100,
    });
    await request.post("/v1/items").auth("adminuser", "adminpassword").send({
      name: "item2",
      priceEuroCent: 150,
    });

    const response = await request
      .get("/v1/items")
      .auth("adminuser", "adminpassword");

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
  });

  it("should get an item by id", async () => {
    const createResponse = await request
      .post("/v1/items")
      .auth("adminuser", "adminpassword")
      .send({
        name: "item1",
        priceEuroCent: 100,
      });
    const createdId = JSON.parse(createResponse.text).itemId;

    const response = await request
      .get(`/v1/items/${createdId}`)
      .auth("adminuser", "adminpassword");

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("item1");
    expect(response.body.priceEuroCent).toBe(100);
  });

  it("should update an item", async () => {
    const createResponse = await request
      .post("/v1/items")
      .auth("adminuser", "adminpassword")
      .send({
        name: "item1",
        priceEuroCent: 100,
      });
    const createdId = JSON.parse(createResponse.text).itemId;

    const updateResponse = await request
      .patch(`/v1/items/${createdId}`)
      .auth("adminuser", "adminpassword")
      .send({
        name: "updatedItem",
        priceEuroCent: 150,
      });

    expect(updateResponse.status).toBe(200);
    expect(JSON.parse(updateResponse.text).itemId).toBe(createdId.toString());

    const getResponse = await request
      .get(`/v1/items/${createdId}`)
      .auth("adminuser", "adminpassword");

    expect(getResponse.body.name).toBe("updatedItem");
    expect(getResponse.body.priceEuroCent).toBe(150);
  });

  it("should delete an item", async () => {
    const createResponse = await request
      .post("/v1/items")
      .auth("adminuser", "adminpassword")
      .send({
        name: "item1",
        priceEuroCent: 100,
      });
    const createdId = JSON.parse(createResponse.text).itemId;

    const deleteResponse = await request
      .delete(`/v1/items/${createdId}`)
      .auth("adminuser", "adminpassword");

    expect(deleteResponse.status).toBe(200);
    expect(JSON.parse(deleteResponse.text).itemId).toBe(createdId.toString());

    const getResponse = await request
      .get(`/v1/items/${createdId}`)
      .auth("adminuser", "adminpassword");

    expect(getResponse.status).toBe(404);
  });

  // cart entries tests

  it("should create a cart entry", async () => {
    await request.post("/v1/items").auth("adminuser", "adminpassword").send({
      name: "item1",
      priceEuroCent: 100,
    });

    const response = await request
      .post("/v1/cartEntries")
      .auth("adminuser", "adminpassword")
      .send({
        userId: 1,
        itemId: 1,
        quantity: 2,
      });
    expect(response.status).toBe(200);
    const json = JSON.parse(response.text);
    expect(json.cartEntryId).toBeDefined();
  });

  it("should update a cart entry", async () => {
    await request.post("/v1/items").auth("adminuser", "adminpassword").send({
      name: "item1",
      priceEuroCent: 100,
    });

    const createResponse = await request
      .post("/v1/cartEntries")
      .auth("adminuser", "adminpassword")
      .send({
        userId: 1,
        itemId: 1,
        quantity: 2,
      });
    const cartEntryId = JSON.parse(createResponse.text).cartEntryId;

    const updateResponse = await request
      .patch(`/v1/cartEntries/${cartEntryId}`)
      .auth("adminuser", "adminpassword")
      .send({
        quantity: 3,
      });
    expect(updateResponse.status).toBe(200);
    expect(JSON.parse(updateResponse.text).cartEntryId).toBe(
      cartEntryId.toString()
    );
  });

  it("should not add a cart entry with an invalid itemId", async () => {
    const response = await request
      .post("/v1/cartEntries")
      .auth("adminuser", "adminpassword")
      .send({
        userId: 1,
        itemId: 9999,
        quantity: 2,
      });
    expect(response.status).toBe(409);
  });

  it("should not allow a quantity of 0 in cart entry", async () => {
    const response = await request
      .post("/v1/cartEntries")
      .auth("adminuser", "adminpassword")
      .send({
        userId: 1,
        itemId: 1,
        quantity: 0,
      });
    expect(response.status).toBe(409);
  });

  it("should not allow a negative quantity in cart entry", async () => {
    const response = await request
      .post("/v1/cartEntries")
      .auth("testuser", "testpassword")
      .send({
        userId: 1,
        itemId: 1,
        quantity: -1,
      });
    expect(response.status).toBe(401);
  });

  it("should delete a cart entry", async () => {
    await request.post("/v1/items").auth("adminuser", "adminpassword").send({
      name: "item1",
      priceEuroCent: 100,
    });

    const createResponse = await request
      .post("/v1/cartEntries")
      .auth("adminuser", "adminpassword")
      .send({
        userId: 1,
        itemId: 1,
        quantity: 2,
      });
    const cartEntryId = JSON.parse(createResponse.text).cartEntryId;

    const deleteResponse = await request
      .delete(`/v1/cartEntries/${cartEntryId}`)
      .auth("adminuser", "adminpassword");
    expect(deleteResponse.status).toBe(200);
    expect(JSON.parse(deleteResponse.text).cartEntryId).toBe(
      cartEntryId.toString()
    );
  });

  // Testing Authentication

  it("should not create a cart entry without authentication", async () => {
    const response = await request.post("/v1/cartEntries").send({
      userId: 1,
      itemId: 1,
      quantity: 2,
    });
    expect(response.status).toBe(401);
  });

  it("should not update a cart entry without authentication", async () => {
    const response = await request.patch("/v1/cartEntries/1").send({
      quantity: 3,
    });
    expect(response.status).toBe(401);
  });

  it("should not delete a cart entry without authentication", async () => {
    const response = await request.delete("/v1/cartEntries/1");
    expect(response.status).toBe(401);
  });

  // Incorrect credentials tests

  it("should not create a cart entry with incorrect authentication", async () => {
    const response = await request
      .post("/v1/cartEntries")
      .auth("wronguser", "wrongpassword")
      .send({
        userId: 1,
        itemId: 1,
        quantity: 2,
      });
    expect(response.status).toBe(401);
  });

  it("should not update a cart entry with incorrect authentication", async () => {
    const response = await request
      .patch("/v1/cartEntries/1")
      .auth("wronguser", "wrongpassword")
      .send({
        quantity: 3,
      });
    expect(response.status).toBe(401);
  });

  it("should not delete a cart entry with incorrect authentication", async () => {
    const response = await request
      .delete("/v1/cartEntries/1")
      .auth("wronguser", "wrongpassword");
    expect(response.status).toBe(401);
  });
});
