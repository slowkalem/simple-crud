const app = require("../../app");
const request = require("supertest");

jest.setTimeout(30000);

describe("System", () => {
  const newData = {
    sysCat: "common",
    sysSubCat: "jenis_kelamin",
    sysCode: "3",
    value: "Laki - laki",
    remark: "Laki - laki",
  };
  let token;
  beforeAll(async () => {
    let user = {
      username: "unit_testz",
      password: "Bsp123!!",
    };
    const response = await request(app)
      .post("/api/v1/auth/login")
      .set("Content-Type", "application/json")
      .send(user);

    token = `Bearer ${response.body.data.token}`;
  });
  describe("GET /", () => {
    test("should get all system", async () => {
      const res = await request(app)
        .get("/api/v1/systems")
        .set("Content-Type", "application/json")
        .set("Authorization", token);
      // status code should be 200
      expect(res).toHaveProperty("status", 200);

      // response body object should have correct property and value
      expect(res.body).toHaveProperty("statusCode", 200);
      expect(res.body).toHaveProperty("message", "Data ditemukan");

      //response body data object should have a array system and contains one items
      expect(res.body.data.length >= 1).toEqual(true);

      // the system should have contains only sysCat, sysSubCat, sysCode, value, remark, and status property
      Array.from(res.body.data).forEach((system) => {
        expect(Object.keys(system)).toHaveLength(6);
        expect(system).toHaveProperty("sysCat");
        expect(system).toHaveProperty("sysSubCat");
        expect(system).toHaveProperty("sysCode");
        expect(system).toHaveProperty("value");
        expect(system).toHaveProperty("remark");
        expect(system).toHaveProperty("status");
      });
    });
    test("should get all systems order by sysCat", async () => {
      const res = await request(app)
        .get("/api/v1/systems?orderBy=sysCat")
        .set("Content-Type", "application/json")
        .set("Authorization", token);

      // status code should be 200
      expect(res).toHaveProperty("status", 200);

      // response body object should have correct property and value
      expect(res.body).toHaveProperty("statusCode", 200);
      expect(res.body).toHaveProperty("message", "Data ditemukan");

      //response body data object should have a array system and contains one items
      expect(res.body.data.length >= 1).toEqual(true);

      // the system should have contains only sysCat, sysSubCat, sysCode, value, remark, and status property
      Array.from(res.body.data).forEach((system) => {
        expect(Object.keys(system)).toHaveLength(6);
        expect(system).toHaveProperty("sysCat");
        expect(system).toHaveProperty("sysSubCat");
        expect(system).toHaveProperty("sysCode");
        expect(system).toHaveProperty("value");
        expect(system).toHaveProperty("remark");
        expect(system).toHaveProperty("status");
      });
    });
    test("should get all systems order by sysSubCat", async () => {
      const res = await request(app)
        .get("/api/v1/systems?orderBy=sysSubCat")
        .set("Content-Type", "application/json")
        .set("Authorization", token);

      // status code should be 200
      expect(res).toHaveProperty("status", 200);

      // response body object should have correct property and value
      expect(res.body).toHaveProperty("statusCode", 200);
      expect(res.body).toHaveProperty("message", "Data ditemukan");

      //response body data object should have a array system and contains one items
      expect(res.body.data.length >= 1).toEqual(true);

      // the system should have contains only sysCat, sysSubCat, sysCode, value, remark, and status property
      Array.from(res.body.data).forEach((system) => {
        expect(Object.keys(system)).toHaveLength(6);
        expect(system).toHaveProperty("sysCat");
        expect(system).toHaveProperty("sysSubCat");
        expect(system).toHaveProperty("sysCode");
        expect(system).toHaveProperty("value");
        expect(system).toHaveProperty("remark");
        expect(system).toHaveProperty("status");
      });
    });
    test("should get all systems order by sysCode", async () => {
      const res = await request(app)
        .get("/api/v1/systems?orderBy=sysCode")
        .set("Content-Type", "application/json")
        .set("Authorization", token);

      // status code should be 200
      expect(res).toHaveProperty("status", 200);

      // response body object should have correct property and value
      expect(res.body).toHaveProperty("statusCode", 200);
      expect(res.body).toHaveProperty("message", "Data ditemukan");

      //response body data object should have a array system and contains one items
      expect(res.body.data.length >= 1).toEqual(true);

      // the system should have contains only sysCat, sysSubCat, sysCode, value, remark, and status property
      Array.from(res.body.data).forEach((system) => {
        expect(Object.keys(system)).toHaveLength(6);
        expect(system).toHaveProperty("sysCat");
        expect(system).toHaveProperty("sysSubCat");
        expect(system).toHaveProperty("sysCode");
        expect(system).toHaveProperty("value");
        expect(system).toHaveProperty("remark");
        expect(system).toHaveProperty("status");
      });
    });
    test("should get all systems order by invalid column", async () => {
      const res = await request(app)
        .get("/api/v1/systems?orderBy=random")
        .set("Content-Type", "application/json")
        .set("Authorization", token);

      // status code should be 200
      expect(res).toHaveProperty("status", 200);

      // response body object should have correct property and value
      expect(res.body).toHaveProperty("statusCode", 200);
      expect(res.body).toHaveProperty("message", "Data ditemukan");

      //response body data object should have a array system and contains one items
      expect(res.body.data.length >= 1).toEqual(true);

      // the system should have contains only sysCat, sysSubCat, sysCode, value, remark, and status property
      Array.from(res.body.data).forEach((system) => {
        expect(Object.keys(system)).toHaveLength(6);
        expect(system).toHaveProperty("sysCat");
        expect(system).toHaveProperty("sysSubCat");
        expect(system).toHaveProperty("sysCode");
        expect(system).toHaveProperty("value");
        expect(system).toHaveProperty("remark");
        expect(system).toHaveProperty("status");
      });
    });
    test("should get all systems order by direction", async () => {
      const res = await request(app)
        .get("/api/v1/systems?dir=asc")
        .set("Content-Type", "application/json")
        .set("Authorization", token);

      // status code should be 200
      expect(res).toHaveProperty("status", 200);

      // response body object should have correct property and value
      expect(res.body).toHaveProperty("statusCode", 200);
      expect(res.body).toHaveProperty("message", "Data ditemukan");

      //response body data object should have a array system and contains one items
      expect(res.body.data.length >= 1).toEqual(true);

      // the system should have contains only sysCat, sysSubCat, sysCode, value, remark, and status property
      Array.from(res.body.data).forEach((system) => {
        expect(Object.keys(system)).toHaveLength(6);
        expect(system).toHaveProperty("sysCat");
        expect(system).toHaveProperty("sysSubCat");
        expect(system).toHaveProperty("sysCode");
        expect(system).toHaveProperty("value");
        expect(system).toHaveProperty("remark");
        expect(system).toHaveProperty("status");
      });
    });
    test("should get a single system by keys", async () => {
      const res = await request(app)
        .get(`/api/v1/systems?sysCat=common&sysSubCat=jenis_kelamin&sysCode=1`)
        .set("Content-Type", "application/json")
        .set("Authorization", token);
      // status code should be 200
      expect(res).toHaveProperty("status", 200);

      // response body object should have correct property and value
      expect(res.body).toHaveProperty("statusCode", 200);
      expect(res.body).toHaveProperty("message", "Data ditemukan");

      //response body data object should have a array system and contains one items
      expect(res.body.data.length >= 1).toEqual(true);

      // the system should have contains onlysysCat, sysSubCat, sysCode, value, remark, and status property
      Array.from(res.body.data).forEach((system) => {
        expect(Object.keys(system)).toHaveLength(6);
        expect(system).toHaveProperty("sysCat");
        expect(system).toHaveProperty("sysSubCat");
        expect(system).toHaveProperty("sysCode");
        expect(system).toHaveProperty("value");
        expect(system).toHaveProperty("remark");
        expect(system).toHaveProperty("status");
      });
    });
    test("should get a system by all parameter", async () => {
      const res = await request(app)
        .get(`/api/v1/systems?all=common`)
        .set("Content-Type", "application/json")
        .set("Authorization", token);
      // status code should be 200
      expect(res).toHaveProperty("status", 200);

      // response body object should have correct property and value
      expect(res.body).toHaveProperty("statusCode", 200);
      expect(res.body).toHaveProperty("message", "Data ditemukan");

      //response body data object should have a array system and contains one items
      expect(res.body.data.length >= 1).toEqual(true);

      // the system should have contains onlysysCat, sysSubCat, sysCode, value, remark, and status property
      Array.from(res.body.data).forEach((system) => {
        expect(Object.keys(system)).toHaveLength(6);
        expect(system).toHaveProperty("sysCat");
        expect(system).toHaveProperty("sysSubCat");
        expect(system).toHaveProperty("sysCode");
        expect(system).toHaveProperty("value");
        expect(system).toHaveProperty("remark");
        expect(system).toHaveProperty("status");
      });
    });
    test("should not get a single system by invalid keys", async () => {
      const keySystem = {
        sysCat: "common",
        sysSubCat: "flag",
        sysCode: "4",
      };
      const res = await request(app)
        .get(
          `/api/v1/systems?sysCat=common&sysSubCat=jenis_kelamin&sysCode=999`
        )
        .set("Content-Type", "application/json")
        .set("Authorization", token);

      // status code should be 200
      expect(res).toHaveProperty("status", 404);

      // response body object should have correct property and value
      expect(res.body).toHaveProperty("statusCode", 404);
      expect(res.body).toHaveProperty("message", "Data tidak ditemukan");
    });
    test("should test async errors", async () => {
      const res = await request(app)
        .get(`/api/v1/systems?page=null`)
        .set("Content-Type", "application/json")
        .set("Authorization", token);

      // status code should be 400
      expect(res).toHaveProperty("status", 400);

      // response body object should have correct property and value
      expect(res.body).toHaveProperty("error", "Bad Request");
      expect(res.body).toHaveProperty("message", "Validation failed");
      expect(res.body).toHaveProperty("validation");

      expect(res.body.validation).toHaveProperty("query");

      expect(res.body.validation.query).toHaveProperty("source");
      expect(res.body.validation.query).toHaveProperty("keys");
      expect(res.body.validation.query).toHaveProperty("message");
    });
    test("Sukses GetById", async () => {
      const param = {
        sysCat: "common",
        sysSubCat: "jenis_kelamin",
        sysCode: "0",
      };
      const res = await request(app)
        .get(`/api/v1/systems/getById`)
        .set("Content-Type", "application/json")
        .set("Authorization", token)
        .query(param);
      // status code should be 200
      expect(res).toHaveProperty("status", 200);

      // response body object should have correct property and value
      expect(res.body).toHaveProperty("statusCode", 200);
      expect(res.body).toHaveProperty("message", "Data ditemukan");
    });
    test("Not Found GetById", async () => {
      const param = {
        sysCat: "ngasal",
        sysSubCat: "ngasal",
        sysCode: "ngasal",
      };
      const res = await request(app)
        .get(`/api/v1/systems/getById`)
        .set("Content-Type", "application/json")
        .set("Authorization", token)
        .query(param);
      // status code should be 404
      expect(res).toHaveProperty("status", 404);

      // response body object should have correct property and value
      expect(res.body).toHaveProperty("statusCode", 404);
      expect(res.body).toHaveProperty("message", "Data tidak ditemukan");
    });
  });

  describe("POST /", () => {
    test("should add system with complete data", async () => {
      const res = await request(app)
        .post("/api/v1/systems")
        .set("Content-Type", "application/json")
        .set("Authorization", token)
        .send(newData);

      // status code should be 200
      expect(res).toHaveProperty("status", 200);

      // response body object should have correct property and value
      expect(res.body).toHaveProperty("statusCode", 200);
      expect(res.body).toHaveProperty(
        "message",
        "Data berhasil disimpan"
      );
    });
    test("should not add system without value", async () => {
      const invalidData = {
        sysCat: "common",
        sysSubCat: "jenis_kelamin",
        sysCode: "1",
        remark: "Laki - laki",
      };
      const res = await request(app)
        .post(`/api/v1/systems`)
        .set("Content-Type", "application/json")
        .set("Authorization", token)
        .send(invalidData);

      // status code should be 400
      expect(res).toHaveProperty("status", 400);

      // response body object should have correct property and value
      expect(res.body).toHaveProperty("statusCode", 400);
      expect(res.body).toHaveProperty("error", "Bad Request");
      expect(res.body).toHaveProperty("message", "Validation failed");
      expect(res.body).toHaveProperty("validation");

      expect(res.body.validation).toHaveProperty("body");

      expect(res.body.validation.body).toHaveProperty("source");
      expect(res.body.validation.body).toHaveProperty("keys");
      expect(res.body.validation.body).toHaveProperty("message");
    });
    test("should not add system with duplicate keys", async () => {
      const invalidData = {
        sysCat: "common",
        sysSubCat: "jenis_kelamin",
        sysCode: "3",
        value: "Laki - laki",
        remark: "Laki - laki",
      };
      const res = await request(app)
        .post(`/api/v1/systems`)
        .set("Content-Type", "application/json")
        .set("Authorization", token)
        .send(invalidData);
      // status code should be 400
      expect(res).toHaveProperty("status", 400);

      // response body object should have correct property and value
      expect(res.body).toHaveProperty("statusCode", 400);
      expect(res.body).toHaveProperty(
        "message",
        `Tidak bisa menambahkan system data, data yang dimasukkan telah terdaftar`
      );
    });
  });

  describe("PUT /", () => {
    const dataUpdate = {
      sysCat: "common",
      sysSubCat: "jenis_kelamin",
      sysCode: "3",
      value: "Perempuan",
      remark: "Perempuan",
    };
    test("should update system with complete data", async () => {
      const res = await request(app)
        .put("/api/v1/systems")
        .set("Content-Type", "application/json")
        .set("Authorization", token)
        .send(dataUpdate);
      // status code should be 200
      expect(res).toHaveProperty("status", 200);

      // response body object should have correct property and value
      expect(res.body).toHaveProperty("statusCode", 200);
      expect(res.body).toHaveProperty(
        "message",
        "Data berhasil diubah"
      );
    });
    test("should not update system with invalid keys", async () => {
      const falseData = {
        sysCat: "test",
        sysSubCat: "test_update",
        sysCode: "1",
        value: "unit test update",
        remark: "unit test update",
      };
      const res = await request(app)
        .put(`/api/v1/systems`)
        .set("Content-Type", "application/json")
        .set("Authorization", token)
        .send(falseData);

      // status code should be 200
      expect(res).toHaveProperty("status", 404);

      // response body object should have correct property and value
      expect(res.body).toHaveProperty("statusCode", 404);
      expect(res.body).toHaveProperty("message", `Data tidak ditemukan`);
    });
  });

  describe("DELETE /", () => {
    beforeAll(async () => {
      // set up the todo
      const res = await request(app)
        .post("/api/v1/systems")
        .set("Content-Type", "application/json")
        .set("Authorization", token)
        .send(newData);
    });
    test("should delete system with correct keys", async () => {
      const validKeys = [
        {
          sysCat: "COMMON",
          sysSubCat: "JENIS_KELAMIN",
          sysCode: "3",
        },
      ];
      const res = await request(app)
        .del("/api/v1/systems")
        .set("Content-Type", "application/json")
        .set("Authorization", token)
        .send(validKeys);
      // status code should be 200
      expect(res).toHaveProperty("status", 200);

      // response body object should have correct property and value
      expect(res.body).toHaveProperty("statusCode", 200);
      expect(res.body).toHaveProperty(
        "message",
        "Data berhasil dihapus"
      );
    });
    test("should not delete system with invalid keys", async () => {
      const invalidKeys = [
        {
          sysCat: "common",
          sysSubCat: "jenis_kelamin",
          sysCode: "4",
        },
      ];
      const res = await request(app)
        .del(`/api/v1/systems`)
        .set("Content-Type", "application/json")
        .set("Authorization", token)
        .send(invalidKeys);

      // status code should be 200
      expect(res).toHaveProperty("status", 404);

      // response body object should have correct property and value
      expect(res.body).toHaveProperty("statusCode", 404);
      expect(res.body).toHaveProperty("message", `Data tidak ditemukan`);
    });
  });
});
