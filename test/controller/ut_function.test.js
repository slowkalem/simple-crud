const app = require("../../app");
const request = require("supertest");
const { db } = require("../../src/helper/DBUtil");

jest.setTimeout(30000);

describe("Function", () => {
  const newData = {
    name: "test function",
  };
  let funcId;
  let token;
  beforeAll(async () => {

    let user = {
      username: "unit_testy",
      password: "Bsp123!!",
    };
    const response = await request(app).post("/api/v1/auth/login").send(user);
    token = `Bearer ${response.body.data.token}`;
  });
  describe("CREATE /", () => {
    it("should create new function", async () => {
      const res = await request(app)
        .post("/api/v1/functions")
        .set("Authorization", token)
        .send(newData);
      // status code should be 200
      expect(res).toHaveProperty("status", 200);

      // response body object should have correct property
      expect(res.body).toHaveProperty("statusCode", 200);
      expect(res.body).toHaveProperty(
        "message",
        "Function data berhasil dibuat"
      );
    });
    it("should error create function", async () => {
      let invalidData = {
        nama: "invalid",
      };
      const res = await request(app)
        .post("/api/v1/functions")
        .set("Authorization", token)
        .send(invalidData);
      // status code should be 400
      expect(res).toHaveProperty("status", 400);

      // response body object should have correct property
      expect(res.body).toHaveProperty("statusCode", 400);
      expect(res.body).toHaveProperty("message", "Validation failed");
    });
  });
  describe("GET /", () => {
    it("should get all function", async () => {
      const res = await request(app)
        .get("/api/v1/functions")
        .set("authorization", token);
      // status code should be 200
      expect(res).toHaveProperty("status", 200);

      // response body object should have correct property and value
      expect(res.body).toHaveProperty("statusCode", 200);
      expect(res.body).toHaveProperty("message", "Data ditemukan");

      //response body data object should have a array functions and contains one items
      expect(res.body.data.length >= 1).toEqual(true);
      // the functions should have contains only functionId and name property
      Array.from(res.body.data).forEach((functions) => {
        expect(Object.keys(functions)).toHaveLength(2);
        expect(functions).toHaveProperty("functionId");
        expect(functions).toHaveProperty("name");
      });
    });
    it("should get 1 function search", async () => {
      const res = await request(app)
        .get("/api/v1/functions?perPage=1000&page=1")
        .set("authorization", token)
        .query({ name: "test function" });

      funcId = res.body.data[0].functionId;
      // status code should be 200
      expect(res).toHaveProperty("status", 200);

      // response body object should have correct property and value
      expect(res.body).toHaveProperty("statusCode", 200);
      expect(res.body).toHaveProperty("message", "Data ditemukan");

      //response body data object should have a array functions and contains one items
      expect(res.body.data != null).toEqual(true);
      // the functions should have contains only functionId and name property
      Array.from(res.body.data).forEach((functions) => {
        expect(Object.keys(functions)).toHaveLength(2);
        expect(functions).toHaveProperty("functionId");
        expect(functions).toHaveProperty("name");
      });
    });
    it("should not found search function", async () => {
      const res = await request(app)
        .get("/api/v1/functions?perPage=1000&page=1")
        .set("authorization", token)
        .query({ name: "invalid function name" });
      //status code should be 404
      expect(res).toHaveProperty("status", 404);

      // response body object should have correct property
      expect(res.body).toHaveProperty("statusCode", 404);
      expect(res.body).toHaveProperty("message", "Data tidak ditemukan");
    });
    it("should get 1 function by Id", async () => {
      const res = await request(app)
        .get("/api/v1/functions/getById")
        .set("authorization", token)
        .query({ functionId: funcId });
      // status code should be 200
      expect(res).toHaveProperty("status", 200);

      // response body object should have correct property and value
      expect(res.body).toHaveProperty("statusCode", 200);
      expect(res.body).toHaveProperty("message", "Data ditemukan");
      //response body data object should have a array functions and contains one items
      expect(res.body.data != null).toEqual(true);
      // the functions should have contains only functionId and name property
      Array.from(res.body.data).forEach((functions) => {
        expect(Object.keys(functions)).toHaveLength(2);
        expect(functions).toHaveProperty("functionId");
        expect(functions).toHaveProperty("name");
      });
    });
    it("should not found get function by id", async () => {
      const res = await request(app)
        .get("/api/v1/functions/getById")
        .set("authorization", token)
        .query({ functionId: "invalid function Id" });
      // status code should be 404
      expect(res).toHaveProperty("status", 404);

      // response body object should have correct property
      expect(res.body).toHaveProperty("statusCode", 404);
      expect(res.body).toHaveProperty("message", "Data tidak ditemukan");
    });
  });
  describe("UPDATE /", () => {
    it("should update function", async () => {
      const updateData = {
        functionId: funcId,
        name: "test function update",
      };
      const res = await request(app)
        .put("/api/v1/functions")
        .set("Authorization", token)
        .send(updateData);

      expect(res).toHaveProperty("status", 200);

      // response body object should have correct property and value
      expect(res.body).toHaveProperty("statusCode", 200);
      expect(res.body).toHaveProperty(
        "message",
        "Function data berhasil diubah"
      );
    });
    it("should cannot update invalid data", async () => {
      const updateInvalidData = {
        functionId: "invalidData",
        name: "invalidName",
      };
      const res = await request(app)
        .put("/api/v1/functions")
        .set("Authorization", token)
        .send(updateInvalidData);
      // status code should be
      expect(res).toHaveProperty("status", 404);

      // response body object should have correct property
      expect(res.body).toHaveProperty("statusCode", 404);
      expect(res.body).toHaveProperty("message", "Data tidak ditemukan");
    });
  });
  describe("DELETE /", () => {
    it("should delete function", async () => {
      const res = await request(app)
        .delete("/api/v1/functions")
        .set("Authorization", token)
        .send({ functionId: funcId });

      expect(res).toHaveProperty("status", 200);

      // response body object should have correct property and value
      expect(res.body).toHaveProperty("statusCode", 200);
      expect(res.body).toHaveProperty(
        "message",
        "Function data berhasil dihapus"
      );
    });
    it("should cannot delete not found function", async () => {
      const res = await request(app)
        .delete("/api/v1/functions")
        .set("Authorization", token)
        .send({ functionId: "InvalidFunctionId" });
      // status code should be 404
      expect(res).toHaveProperty("status", 404);

      // response body object should have correct property
      expect(res.body).toHaveProperty("statusCode", 404);
      expect(res.body).toHaveProperty("message", "Data tidak ditemukan");
    });
  });
});
