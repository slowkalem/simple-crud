const app = require("../../app");
const request = require("supertest");
const { db } = require("../../src/helper/DBUtil");
const moment = require("moment");

const createDummyLog = async (param) => {
  let query =
    " INSERT INTO tb_audit_log " +
    " (log_id, username, action, screen, created_dt, created_by, updated_dt, updated_by)  " +
    " VALUES " +
    " ($1, $2, $3, $4, $5, $6, $7, $8) ";

  let dt = new Date();
  await db.any(query, [
    param.logId,
    "UNIT_TEST",
    param.action,
    param.screen,
    dt,
    "UNIT_TEST",
    dt,
    "UNIT_TEST",
  ]);
};
const deleteLogById = async (logId) => {
  let query = "DELETE FROM tb_audit_log where log_id = $1";
  await db.none(query, [logId]);
};

jest.setTimeout(30000);

describe("Log", () => {
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

    const log = {
      logId: "ut_log1",
      action: "Melihat list data",
      screen: "Group",
    };

    await createDummyLog(log);
  });
  afterAll(async () => {
    await deleteLogById("ut_log1");
  });
  describe("GET /", () => {
    it("should get all log data", async () => {
      const res = await request(app)
        .get("/api/v1/log")
        .set("Content-Type", "application/json")
        .set("Authorization", token);
      // status code should be 200
      expect(res).toHaveProperty("status", 200);

      // response body object should have correct property and value
      expect(res.body).toHaveProperty("statusCode", 200);
      expect(res.body).toHaveProperty("message", "Data ditemukan");

      //response body data object should have a array system and contains one items
      expect(res.body.data.length >= 1).toEqual(true);

      // the log data should have contains only date, action, screen, and username
      Array.from(res.body.data).forEach((log) => {
        expect(Object.keys(log)).toHaveLength(8);
        expect(log).toHaveProperty("logId");
        expect(log).toHaveProperty("username");
        expect(log).toHaveProperty("action");
        expect(log).toHaveProperty("screen");
        expect(log).toHaveProperty("createdDate");
        expect(log).toHaveProperty("createdBy");
        expect(log).toHaveProperty("updatedDate");
        expect(log).toHaveProperty("updatedBy");
      });
    });
    it("should get all log data order by action", async () => {
      const res = await request(app)
        .get("/api/v1/log?orderBy=action")
        .set("Content-Type", "application/json")
        .set("Authorization", token);

      // status code should be 200
      expect(res).toHaveProperty("status", 200);

      // response body object should have correct property and value
      expect(res.body).toHaveProperty("statusCode", 200);
      expect(res.body).toHaveProperty("message", "Data ditemukan");

      //response body data object should have a array system and contains one items
      expect(res.body.data.length >= 1).toEqual(true);

      // the log data should have contains only date, action, screen, and username
      Array.from(res.body.data).forEach((log) => {
        expect(Object.keys(log)).toHaveLength(8);
        expect(log).toHaveProperty("logId");
        expect(log).toHaveProperty("username");
        expect(log).toHaveProperty("action");
        expect(log).toHaveProperty("screen");
        expect(log).toHaveProperty("createdDate");
        expect(log).toHaveProperty("createdBy");
        expect(log).toHaveProperty("updatedDate");
        expect(log).toHaveProperty("updatedBy");
      });
    });
    it("should get all log data order by screen", async () => {
      const res = await request(app)
        .get("/api/v1/log?orderBy=screen")
        .set("Content-Type", "application/json")
        .set("Authorization", token);

      // status code should be 200
      expect(res).toHaveProperty("status", 200);

      // response body object should have correct property and value
      expect(res.body).toHaveProperty("statusCode", 200);
      expect(res.body).toHaveProperty("message", "Data ditemukan");

      //response body data object should have a array system and contains one items
      expect(res.body.data.length >= 1).toEqual(true);

      // the log data should have contains only date, action, screen, and username
      Array.from(res.body.data).forEach((log) => {
        expect(Object.keys(log)).toHaveLength(8);
        expect(log).toHaveProperty("logId");
        expect(log).toHaveProperty("username");
        expect(log).toHaveProperty("action");
        expect(log).toHaveProperty("screen");
        expect(log).toHaveProperty("createdDate");
        expect(log).toHaveProperty("createdBy");
        expect(log).toHaveProperty("updatedDate");
        expect(log).toHaveProperty("updatedBy");
      });
    });
    it("should get all log data order by username", async () => {
      const res = await request(app)
        .get("/api/v1/log?orderBy=username")
        .set("Content-Type", "application/json")
        .set("Authorization", token);

      // status code should be 200
      expect(res).toHaveProperty("status", 200);

      // response body object should have correct property and value
      expect(res.body).toHaveProperty("statusCode", 200);
      expect(res.body).toHaveProperty("message", "Data ditemukan");

      //response body data object should have a array system and contains one items
      expect(res.body.data.length >= 1).toEqual(true);

      // the log data should have contains only date, action, screen, and username
      Array.from(res.body.data).forEach((log) => {
        expect(Object.keys(log)).toHaveLength(8);
        expect(log).toHaveProperty("logId");
        expect(log).toHaveProperty("username");
        expect(log).toHaveProperty("action");
        expect(log).toHaveProperty("screen");
        expect(log).toHaveProperty("createdDate");
        expect(log).toHaveProperty("createdBy");
        expect(log).toHaveProperty("updatedDate");
        expect(log).toHaveProperty("updatedBy");
      });
    });
    it("should get all log data order by createdDate", async () => {
      const res = await request(app)
        .get("/api/v1/log?orderBy=createdDate")
        .set("Content-Type", "application/json")
        .set("Authorization", token);

      // status code should be 200
      expect(res).toHaveProperty("status", 200);

      // response body object should have correct property and value
      expect(res.body).toHaveProperty("statusCode", 200);
      expect(res.body).toHaveProperty("message", "Data ditemukan");

      //response body data object should have a array system and contains one items
      expect(res.body.data.length >= 1).toEqual(true);

      // the log data should have contains only date, action, screen, and username
      Array.from(res.body.data).forEach((log) => {
        expect(Object.keys(log)).toHaveLength(8);
        expect(log).toHaveProperty("logId");
        expect(log).toHaveProperty("username");
        expect(log).toHaveProperty("action");
        expect(log).toHaveProperty("screen");
        expect(log).toHaveProperty("createdDate");
        expect(log).toHaveProperty("createdBy");
        expect(log).toHaveProperty("updatedDate");
        expect(log).toHaveProperty("updatedBy");
      });
    });
    it("should get all log data order by createdBy", async () => {
      const res = await request(app)
        .get("/api/v1/log?orderBy=createdBy")
        .set("Content-Type", "application/json")
        .set("Authorization", token);

      // status code should be 200
      expect(res).toHaveProperty("status", 200);

      // response body object should have correct property and value
      expect(res.body).toHaveProperty("statusCode", 200);
      expect(res.body).toHaveProperty("message", "Data ditemukan");

      //response body data object should have a array system and contains one items
      expect(res.body.data.length >= 1).toEqual(true);

      // the log data should have contains only date, action, screen, and username
      Array.from(res.body.data).forEach((log) => {
        expect(Object.keys(log)).toHaveLength(8);
        expect(log).toHaveProperty("logId");
        expect(log).toHaveProperty("username");
        expect(log).toHaveProperty("action");
        expect(log).toHaveProperty("screen");
        expect(log).toHaveProperty("createdDate");
        expect(log).toHaveProperty("createdBy");
        expect(log).toHaveProperty("updatedDate");
        expect(log).toHaveProperty("updatedBy");
      });
    });
    it("should get all log data order by updatedDate", async () => {
      const res = await request(app)
        .get("/api/v1/log?orderBy=updatedDate")
        .set("Content-Type", "application/json")
        .set("Authorization", token);

      // status code should be 200
      expect(res).toHaveProperty("status", 200);

      // response body object should have correct property and value
      expect(res.body).toHaveProperty("statusCode", 200);
      expect(res.body).toHaveProperty("message", "Data ditemukan");

      //response body data object should have a array system and contains one items
      expect(res.body.data.length >= 1).toEqual(true);

      // the log data should have contains only date, action, screen, and username
      Array.from(res.body.data).forEach((log) => {
        expect(Object.keys(log)).toHaveLength(8);
        expect(log).toHaveProperty("logId");
        expect(log).toHaveProperty("username");
        expect(log).toHaveProperty("action");
        expect(log).toHaveProperty("screen");
        expect(log).toHaveProperty("createdDate");
        expect(log).toHaveProperty("createdBy");
        expect(log).toHaveProperty("updatedDate");
        expect(log).toHaveProperty("updatedBy");
      });
    });
    it("should get all log data order by updatedBy", async () => {
      const res = await request(app)
        .get("/api/v1/log?orderBy=updatedBy")
        .set("Content-Type", "application/json")
        .set("Authorization", token);

      // status code should be 200
      expect(res).toHaveProperty("status", 200);

      // response body object should have correct property and value
      expect(res.body).toHaveProperty("statusCode", 200);
      expect(res.body).toHaveProperty("message", "Data ditemukan");

      //response body data object should have a array system and contains one items
      expect(res.body.data.length >= 1).toEqual(true);

      // the log data should have contains only date, action, screen, and username
      Array.from(res.body.data).forEach((log) => {
        expect(Object.keys(log)).toHaveLength(8);
        expect(log).toHaveProperty("logId");
        expect(log).toHaveProperty("username");
        expect(log).toHaveProperty("action");
        expect(log).toHaveProperty("screen");
        expect(log).toHaveProperty("createdDate");
        expect(log).toHaveProperty("createdBy");
        expect(log).toHaveProperty("updatedDate");
        expect(log).toHaveProperty("updatedBy");
      });
    });
    it("should get all log data order by default", async () => {
      const res = await request(app)
        .get("/api/v1/log?orderBy=default")
        .set("Content-Type", "application/json")
        .set("Authorization", token);

      // status code should be 200
      expect(res).toHaveProperty("status", 200);

      // response body object should have correct property and value
      expect(res.body).toHaveProperty("statusCode", 200);
      expect(res.body).toHaveProperty("message", "Data ditemukan");

      //response body data object should have a array system and contains one items
      expect(res.body.data.length >= 1).toEqual(true);

      // the log data should have contains only date, action, screen, and username
      Array.from(res.body.data).forEach((log) => {
        expect(Object.keys(log)).toHaveLength(8);
        expect(log).toHaveProperty("logId");
        expect(log).toHaveProperty("username");
        expect(log).toHaveProperty("action");
        expect(log).toHaveProperty("screen");
        expect(log).toHaveProperty("createdDate");
        expect(log).toHaveProperty("createdBy");
        expect(log).toHaveProperty("updatedDate");
        expect(log).toHaveProperty("updatedBy");
      });
    });
    it("should get all log data order by direction asc", async () => {
      const res = await request(app)
        .get("/api/v1/log?dir=asc&orderBy=action")
        .set("Content-Type", "application/json")
        .set("Authorization", token);

      // status code should be 200
      expect(res).toHaveProperty("status", 200);

      // response body object should have correct property and value
      expect(res.body).toHaveProperty("statusCode", 200);
      expect(res.body).toHaveProperty("message", "Data ditemukan");

      //response body data object should have a array system and contains one items
      expect(res.body.data.length >= 1).toEqual(true);

      // the log data should have contains only date, action, screen, and username
      Array.from(res.body.data).forEach((log) => {
        expect(Object.keys(log)).toHaveLength(8);
        expect(log).toHaveProperty("logId");
        expect(log).toHaveProperty("username");
        expect(log).toHaveProperty("action");
        expect(log).toHaveProperty("screen");
        expect(log).toHaveProperty("createdDate");
        expect(log).toHaveProperty("createdBy");
        expect(log).toHaveProperty("updatedDate");
        expect(log).toHaveProperty("updatedBy");
      });
    });
    it("should get all log data order by direction desc", async () => {
      const res = await request(app)
        .get("/api/v1/log?dir=desc&orderBy=action")
        .set("Content-Type", "application/json")
        .set("Authorization", token);

      // status code should be 200
      expect(res).toHaveProperty("status", 200);

      // response body object should have correct property and value
      expect(res.body).toHaveProperty("statusCode", 200);
      expect(res.body).toHaveProperty("message", "Data ditemukan");

      //response body data object should have a array system and contains one items
      expect(res.body.data.length >= 1).toEqual(true);

      // the log data should have contains only date, action, screen, and username
      Array.from(res.body.data).forEach((log) => {
        expect(Object.keys(log)).toHaveLength(8);
        expect(log).toHaveProperty("logId");
        expect(log).toHaveProperty("username");
        expect(log).toHaveProperty("action");
        expect(log).toHaveProperty("screen");
        expect(log).toHaveProperty("createdDate");
        expect(log).toHaveProperty("createdBy");
        expect(log).toHaveProperty("updatedDate");
        expect(log).toHaveProperty("updatedBy");
      });
    });
    test("get Log with full parameter", async () => {
      const param = {
        logId: "ut_log1",
        createdBy: "UNIT_TEST",
        updatedBy: "UNIT_TEST",
        createdDateBegin: `${moment(new Date()).format("YYYY-MM-DD")}`,
        createdDateEnd: `${moment(new Date()).format("YYYY-MM-DD")}`,
        updatedDateBegin: `${moment(new Date()).format("YYYY-MM-DD")}`,
        updatedDateEnd: `${moment(new Date()).format("YYYY-MM-DD")}`,
      };
      const res = await request(app)
        .get("/api/v1/log")
        .set("Content-Type", "application/json")
        .set("Authorization", token)
        .query(param);

      // status code should be 200
      expect(res).toHaveProperty("status", 200);

      // response body object should have correct property and value
      expect(res.body).toHaveProperty("statusCode", 200);
      expect(res.body).toHaveProperty("message", "Data ditemukan");

      //response body data object should have a array system and contains one items
      expect(res.body.data.length >= 1).toEqual(true);

      // the log data should have contains only date, action, screen, and username
      Array.from(res.body.data).forEach((log) => {
        expect(Object.keys(log)).toHaveLength(8);
        expect(log).toHaveProperty("logId");
        expect(log).toHaveProperty("username");
        expect(log).toHaveProperty("action");
        expect(log).toHaveProperty("screen");
        expect(log).toHaveProperty("createdDate");
        expect(log).toHaveProperty("createdBy");
        expect(log).toHaveProperty("updatedDate");
        expect(log).toHaveProperty("updatedBy");
      });
    });
    it("should get log data by keys", async () => {
      const res = await request(app)
        .get(`/api/v1/log?username=unit_testz`)
        .set("Content-Type", "application/json")
        .set("Authorization", token);
      // status code should be 200
      expect(res).toHaveProperty("status", 200);

      // response body object should have correct property and value
      expect(res.body).toHaveProperty("statusCode", 200);
      expect(res.body).toHaveProperty("message", "Data ditemukan");

      //response body data object should have a array system and contains one items
      expect(res.body.data.length >= 1).toEqual(true);

      // the log data should have contains only date, action, screen, and username
      Array.from(res.body.data).forEach((log) => {
        expect(Object.keys(log)).toHaveLength(8);
        expect(log).toHaveProperty("logId");
        expect(log).toHaveProperty("username");
        expect(log).toHaveProperty("action");
        expect(log).toHaveProperty("screen");
        expect(log).toHaveProperty("createdDate");
        expect(log).toHaveProperty("createdBy");
        expect(log).toHaveProperty("updatedDate");
        expect(log).toHaveProperty("updatedBy");
      });
    });
    it("should not get log data with invalid keys", async () => {
      const res = await request(app)
        .get(`/api/v1/log?action=testing&screen=testing&username=testing`)
        .set("Content-Type", "application/json")
        .set("Authorization", token);

      // status code should be 200
      expect(res).toHaveProperty("status", 404);

      // response body object should have correct property and value
      expect(res.body).toHaveProperty("statusCode", 404);
      expect(res.body).toHaveProperty("message", "Data tidak ditemukan");
    });
    it("should test async errors", async () => {
      const res = await request(app)
        .get(`/api/v1/log?abcd=null`)
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
  });
});
