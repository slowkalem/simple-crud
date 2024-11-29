const app = require("../../app");
const request = require("supertest");
const { db } = require("../../src/helper/DBUtil");

jest.setTimeout(30000);

describe("Combo", () => {
  let token;
  beforeAll(async () => {
    let user = {
      username: "unit_testy",
      password: "Bsp123!!",
    };
    const response = await request(app).post("/api/v1/auth/login").send(user);
    token = `Bearer ${response.body.data.token}`;
  });
  describe("Get /", () => {
    it("should get all group combo", async () => {
      const res = await request(app)
        .get("/api/v1/combos/group")
        .set("Authorization", token);
      // status code should be 200
      expect(res).toHaveProperty("status", 200);

      // response body object should have correct property and value
      expect(res.body).toHaveProperty("statusCode", 200);
      expect(res.body).toHaveProperty("message", "Data ditemukan");

      //response body data object should have a array combo and contains one items
      expect(res.body.data.length >= 1).toEqual(true);
      // the combo should have contains only value and label property
      Array.from(res.body.data).forEach((combo) => {
        expect(Object.keys(combo)).toHaveLength(2);
        expect(combo).toHaveProperty("value");
        expect(combo).toHaveProperty("label");
      });
    });
    it("should get all group combo with full param", async () => {
      const param = {
        id: "test",
        label: "test3",
      };
      const res = await request(app)
        .get("/api/v1/combos/group")
        .set("Authorization", token)
        .query(param);
      // status code should be 200
      expect(res).toHaveProperty("status", 200);

      // response body object should have correct property and value
      expect(res.body).toHaveProperty("statusCode", 200);
      expect(res.body).toHaveProperty("message", "Data ditemukan");

      // the combo should have contains only value and label property
      Array.from(res.body.data).forEach((combo) => {
        expect(Object.keys(combo)).toHaveLength(2);
        expect(combo).toHaveProperty("value");
        expect(combo).toHaveProperty("label");
      });
    });
    it("should get not found group combo", async () => {
      const param = {
        id: "ngasal",
        label: "ngasal",
      };
      const res = await request(app)
        .get("/api/v1/combos/group")
        .set("Authorization", token)
        .query(param);
      // status code should be 404
      expect(res).toHaveProperty("status", 404);

      // response body object should have correct property and value
      expect(res.body).toHaveProperty("statusCode", 404);
      expect(res.body).toHaveProperty("message", "Data tidak ditemukan");
    });
    it("should get all function combo", async () => {
      const res = await request(app)
        .get("/api/v1/combos/function")
        .set("Authorization", token);
      // status code should be 200
      expect(res).toHaveProperty("status", 200);

      // response body object should have correct property and value
      expect(res.body).toHaveProperty("statusCode", 200);
      expect(res.body).toHaveProperty("message", "Data ditemukan");

      //response body data object should have a array combo and contains one items
      expect(res.body.data.length >= 1).toEqual(true);
      // the combo should have contains only sysCat, sysSubCat, sysCode, value, remark, and status property
      Array.from(res.body.data).forEach((combo) => {
        expect(Object.keys(combo)).toHaveLength(2);
        expect(combo).toHaveProperty("value");
        expect(combo).toHaveProperty("label");
      });
    });
    it("should get all function combo with full param", async () => {
      const param = {
        id: "12a2ddf5-79e6-4616-b774-265a09df96cf",
        label: "Log",
      };
      const res = await request(app)
        .get("/api/v1/combos/function")
        .set("Authorization", token)
        .query(param);
      // status code should be 200
      expect(res).toHaveProperty("status", 200);

      // response body object should have correct property and value
      expect(res.body).toHaveProperty("statusCode", 200);
      expect(res.body).toHaveProperty("message", "Data ditemukan");

      // the combo should have contains only sysCat, sysSubCat, sysCode, value, remark, and status property
      Array.from(res.body.data).forEach((combo) => {
        expect(Object.keys(combo)).toHaveLength(2);
        expect(combo).toHaveProperty("value");
        expect(combo).toHaveProperty("label");
      });
    });
    it("should get not found function combo", async () => {
      const param = {
        id: "ngasal",
        label: "ngasal",
      };
      const res = await request(app)
        .get("/api/v1/combos/function")
        .set("Authorization", token)
        .query(param);
      // status code should be 404
      expect(res).toHaveProperty("status", 404);

      // response body object should have correct property and value
      expect(res.body).toHaveProperty("statusCode", 404);
      expect(res.body).toHaveProperty("message", "Data tidak ditemukan");
    });
    it("should get all status combo", async () => {
      const res = await request(app)
        .get("/api/v1/combos/status")
        .set("Authorization", token);
      // status code should be 200
      expect(res).toHaveProperty("status", 200);

      // response body object should have correct property and value
      expect(res.body).toHaveProperty("statusCode", 200);
      expect(res.body).toHaveProperty("message", "Data ditemukan");

      //response body data object should have a array combo and contains one items
      expect(res.body.data.length >= 1).toEqual(true);
      // the combo should have contains only sysCat, sysSubCat, sysCode, value, remark, and status property
      Array.from(res.body.data).forEach((combo) => {
        expect(Object.keys(combo)).toHaveLength(2);
        expect(combo).toHaveProperty("value");
        expect(combo).toHaveProperty("label");
      });
    });
    it("should get all status combo orderby desc", async () => {
      const res = await request(app)
        .get("/api/v1/combos/status?dir=desc")
        .set("Authorization", token);
      // status code should be 200
      expect(res).toHaveProperty("status", 200);

      // response body object should have correct property and value
      expect(res.body).toHaveProperty("statusCode", 200);
      expect(res.body).toHaveProperty("message", "Data ditemukan");

      //response body data object should have a array combo and contains one items
      expect(res.body.data.length >= 1).toEqual(true);
      // the combo should have contains only sysCat, sysSubCat, sysCode, value, remark, and status property
      Array.from(res.body.data).forEach((combo) => {
        expect(Object.keys(combo)).toHaveLength(2);
        expect(combo).toHaveProperty("value");
        expect(combo).toHaveProperty("label");
      });
    });
    it("should get file max size value", async () => {
      const res = await request(app)
        .get("/api/v1/combos/fileSize")
        .set("Authorization", token);
      // status code should be 200
      expect(res).toHaveProperty("status", 200);

      // response body object should have correct property and value
      expect(res.body).toHaveProperty("statusCode", 200);
      expect(res.body).toHaveProperty("message", "Data ditemukan");

      // the combo should have contains only value and label property
      Array.from(res.body.data).forEach((combo) => {
        expect(Object.keys(combo)).toHaveLength(2);
        expect(combo).toHaveProperty("value");
        expect(combo).toHaveProperty("label");
      });
    });
  });
});
