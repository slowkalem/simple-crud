const app = require("../../app");
const request = require("supertest");
const { db } = require("../../src/helper/DBUtil");
const { Redis } = require("../../src/helper/RedisUtil");
jest.setTimeout(30000);

const deleteNotificationRead = async (userId) => {
  let query = ` DELETE FROM tb_notification_read WHERE user_id = $1 `;
  await db.none(query, [userId]);
};

describe("Notification", () => {
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
  describe("Get Notification", () => {
    beforeAll(async () => {
      const redisClient = await Redis.getClient();
      await redisClient.del(
        `SCM_notification_${process.env.ENV}_9589cbea-7af8-42c8-b742-c956788ed288`
      );
    });
    it("Get All Notification by controller - berhasil", async () => {
      const response = await request(app)
        .get("/api/v1/notification")
        .set("Authorization", token);

      expect(response.status).toBe(200);
      expect(response.body.statusCode).toBe(200);
      expect(response.body.message).toStrictEqual("Data ditemukan");
      expect(response.body.data).not.toBeNull();
    });
    test("Get All Notification by redist - berhasil", async () => {
      const response = await request(app)
        .get("/api/v1/notification")
        .set("Authorization", token);

      expect(response.status).toBe(200);
      expect(response.body.statusCode).toBe(200);
      expect(response.body.message).toStrictEqual("Data ditemukan");
      expect(response.body.data).not.toBeNull();
    });
    test("Get Not Found Notification by redist", async () => {
      const query = {
        page: 5,
        perPage: "",
      };
      const response = await request(app)
        .get("/api/v1/notification")
        .set("Authorization", token)
        .query(query);

      expect(response.status).toBe(404);
      expect(response.body.statusCode).toBe(404);
      expect(response.body.message).toStrictEqual("Data tidak ditemukan");
    });
    test("Get All Notification by orderBy default - berhasil", async () => {
      const redisClient = await Redis.getClient();
      await redisClient.del(
        `SCM_notification_${process.env.ENV}_9589cbea-7af8-42c8-b742-c956788ed288`
      );
      const query = {
        orderBy: "default",
        dir: "asc",
      };
      const response = await request(app)
        .get("/api/v1/notification")
        .set("Authorization", token)
        .query(query);

      expect(response.status).toBe(200);
      expect(response.body.statusCode).toBe(200);
      expect(response.body.message).toStrictEqual("Data ditemukan");
      expect(response.body.data).not.toBeNull();
    });
    test("Get All Notification by orderBy date - berhasil", async () => {
      const redisClient = await Redis.getClient();
      await redisClient.del(
        `SCM_notification_${process.env.ENV}_9589cbea-7af8-42c8-b742-c956788ed288`
      );
      const query = {
        orderBy: "date",
        dir: "desc",
      };
      const response = await request(app)
        .get("/api/v1/notification")
        .set("Authorization", token)
        .query(query);

      expect(response.status).toBe(200);
      expect(response.body.statusCode).toBe(200);
      expect(response.body.message).toStrictEqual("Data ditemukan");
      expect(response.body.data).not.toBeNull();
    });
    test("Get Not Found notification", async () => {
      let user = {
        username: "unit_testx",
        password: "Bsp123!!",
      };
      const res = await request(app)
        .post("/api/v1/auth/login")
        .set("Content-Type", "application/json")
        .send(user);
      const tokenz = `Bearer ${res.body.data.token}`;

      const response = await request(app)
        .get("/api/v1/notification")
        .set("Authorization", tokenz);

      expect(response.status).toBe(404);
      expect(response.body.statusCode).toBe(404);
      expect(response.body.message).toStrictEqual("Data tidak ditemukan");
      expect(response.body.data).not.toBeNull();
    });
    it("Get Unread Notification - berhasil", async () => {
      const response = await request(app)
        .get("/api/v1/notification/count")
        .set("Authorization", token);

      expect(response.status).toBe(200);
      expect(response.body.statusCode).toBe(200);
      expect(response.body.message).toStrictEqual(
        "Menghitung Total Unread Notification berhasil"
      );
    });
    it("Get Notification by Id - berhasil", async () => {
      const response = await request(app)
        .get(
          "/api/v1/notification?notificationId=da010656-1fc3-40cc-925f-dacb912c57b7"
        )
        .set("Authorization", token);

      expect(response.status).toBe(200);
      expect(response.body.statusCode).toBe(200);
      expect(response.body.message).toStrictEqual("Data ditemukan");
      expect(response.body.data).not.toBeNull();
    });
  });

  describe("Read Notification", () => {
    afterAll(async () => {
      let userId = "9589cbea-7af8-42c8-b742-c956788ed288";
      await deleteNotificationRead(userId);
    });
    test("Read One - berhasil", async () => {
      const body = {
        notificationId: "da010656-1fc3-40cc-925f-dacb912c57b7",
      };

      const response = await request(app)
        .post("/api/v1/notification/read")
        .set("Authorization", token)
        .send(body);

      expect(response.status).toBe(200);
      expect(response.body.statusCode).toBe(200);
      expect(response.body.message).toStrictEqual(
        "Notification read data berhasil dibuat!"
      );
      expect(response.body.data).not.toBeNull();
    });

    test("Read One - Data Tidak Ditemukan", async () => {
      const body = {
        notificationId: "ngasal",
      };

      const response = await request(app)
        .post("/api/v1/notification/read")
        .set("Authorization", token)
        .send(body);

      expect(response.status).toBe(404);
      expect(response.body.statusCode).toBe(404);
      expect(response.body.message).toStrictEqual(
        "Data Notifikasi tidak ditemukan"
      );
    });

    test("Read All - berhasil", async () => {
      const response = await request(app)
        .post("/api/v1/notification/read-all")
        .set("Authorization", token);

      expect(response.status).toBe(200);
      expect(response.body.statusCode).toBe(200);
      expect(response.body.message).toStrictEqual(
        "Notification read data berhasil dibuat!"
      );
      expect(response.body.data).not.toBeNull();
    });
  });
});
