const request = require("supertest");
const app = require("../../app");
const { db } = require("../../src/helper/DBUtil");

const deleteGroupByGroupId = async (groupId) => {
  let query = ` DELETE FROM tb_group WHERE group_id = $1 `;
  await db.none(query, [groupId]);
}

jest.setTimeout(30000);

describe("Group", () => {
  beforeAll(async () => {
  });

  describe("Get By Id", () => {
    let token;
    beforeAll(async () => {
      const user = {
        username: "unit_testy",
        password: "Bsp123!!",
      };

      const response = await request(app).post("/api/v1/auth/login").send(user);

      token = `Bearer ${response.body.data.token}`;
    });

    describe("Get By Id Success", () => {

      test("Using userId query param ", async () => {
        let response = await request(app)
          .get("/api/v1/groups/getById")
          .set("Authorization", token)
          .query({ groupId: 'User' });

        expect(response.status).toBe(200);
        expect(response.body.statusCode).toBe(200);
        expect(response.body.message).toEqual("Data ditemukan");
      });
    });

    describe("Get By Id Failed", () => {
      test("User not found", async () => {
        let response = await request(app)
          .get("/api/v1/groups/getById")
          .set("Authorization", token)
          .query({ groupId: "user-id-ngasal" });

        expect(response.status).toBe(404);
        expect(response.body.statusCode).toBe(404);
        expect(response.body.message).toEqual("Data tidak ditemukan");
      });
    });
  });

  describe("Create Group", () => {
    let token;
    beforeAll(async () => {
      const user = {
        username: "unit_testy",
        password: "Bsp123!!",
      };

      const response = await request(app).post("/api/v1/auth/login").send(user);

      token = `Bearer ${response.body.data.token}`;
    });

    describe("Create Group Success", () => {
      test("Create one", async () => {
        const body = {
          groupId: "Group Z",
          name: "Group Z",
          description: "-",
        };

        let response = await request(app)
          .post("/api/v1/groups")
          .set("Authorization", token)
          .send(body);
        expect(response.status).toBe(200);
        expect(response.body.statusCode).toBe(200);
        expect(response.body.message).toEqual("Data berhasil disimpan");

        await deleteGroupByGroupId(body.groupId);
      });
    });

    describe("Create User Failed", () => {
      test("Group ID is already exist", async () => {
        const body = {
          groupId: "User",
          name: "User",
          description: "-",
        };

        let response = await request(app)
          .post("/api/v1/groups")
          .set("Authorization", token)
          .send(body);

        expect(response.status).toBe(400);
        expect(response.body.statusCode).toBe(400);
        expect(response.body.message).toEqual(
          "Group ID telah terdaftar"
        );
      });
    });
  });

  describe("Update Group", () => {
    let token;
    beforeAll(async () => {
      const user = {
        username: "unit_testy",
        password: "Bsp123!!",
      };

      const response = await request(app).post("/api/v1/auth/login").send(user);

      token = `Bearer ${response.body.data.token}`;
    });

    describe("Update Group Success", () => {
      test("Full update", async () => {
        const body = {
          groupId: "Group X",
          name: "Group X",
          description: "-",
        };

        let response = await request(app)
          .post("/api/v1/groups")
          .set("Authorization", token)
          .send(body);

        response = await request(app)
          .put("/api/v1/groups")
          .set("Authorization", token)
          .send(body);
        expect(response.status).toBe(200);
        expect(response.body.statusCode).toBe(200);
        expect(response.body.message).toEqual("Data berhasil diubah");

        await deleteGroupByGroupId(body.groupId);
      });
    });

    describe("Update User Failed", () => {
      test("Group id doesn't exist", async () => {
        const body = {
          groupId: "Group C",
          name: "Group C",
          description: "-",
        };

        let response = await request(app)
          .put("/api/v1/groups")
          .set("Authorization", token)
          .send(body);

        expect(response.status).toBe(404);
        expect(response.body.statusCode).toBe(404);
        expect(response.body.message).toEqual(
          "Data tidak ditemukan"
        );
      });
    });
  });

  describe("Delete Group", () => {
    let token;
    beforeAll(async () => {
      const user = {
        username: "unit_testy",
        password: "Bsp123!!",
      };

      const response = await request(app).post("/api/v1/auth/login").send(user);

      token = `Bearer ${response.body.data.token}`;
    });

    describe("Delete User Success", () => {
      test("Delete by id", async () => {
        const group = {
          groupId: "Group Z",
          name: "Group Z",
          description: "-",
        };

        let response = await request(app)
          .post("/api/v1/groups")
          .set("Authorization", token)
          .send(group);

        const body = {
          groupId: group.groupId
        }
        response = await request(app)
          .delete("/api/v1/groups")
          .set("Authorization", token)
          .send(body);

        expect(response.status).toBe(200);
        expect(response.body.statusCode).toBe(200);
        expect(response.body.message).toEqual("Data berhasil dihapus");
      });
    });

    describe("Delete User Failed", () => {
      test("User doesn't exist", async () => {
        const body = {
          groupId: "ngasal browwww"
        }
        response = await request(app)
          .delete("/api/v1/groups")
          .set("Authorization", token)
          .send(body);

        expect(response.status).toBe(404);
        expect(response.body.statusCode).toBe(404);
        expect(response.body.message).toEqual("Data tidak ditemukan");
      });
    });
  });

  describe("Search Group", () => {
    let token;
    beforeAll(async () => {
      const user = {
        username: "unit_testy",
        password: "Bsp123!!",
      };

      const response = await request(app).post("/api/v1/auth/login").send(user);

      token = `Bearer ${response.body.data.token}`;
    });

    describe("Search Success", () => {
      test("Full parameter", async () => {
        const query = {
          groupId: "Group U",
          name: "Group U",
          description: "-",
          perPage: 10,
          page: 1,
          orderBy: "group_name",
          dir: "asc"
        };

        let response = await request(app)
          .post("/api/v1/groups")
          .set("Authorization", token)
          .send(query);

        response = await request(app)
          .get("/api/v1/groups")
          .set("Authorization", token)
          .query(query);

        expect(response.status).toBe(200);
        expect(response.body.statusCode).toBe(200);
        expect(response.body.message).toEqual("Data ditemukan");

        await deleteGroupByGroupId(query.groupId);
      });

      test("Without parameter", async () => {
        let response = await request(app)
          .get("/api/v1/groups")
          .set("Authorization", token)

        expect(response.status).toBe(200);
        expect(response.body.statusCode).toBe(200);
        expect(response.body.message).toEqual("Data ditemukan");
      });
    });

    describe("Search Failed", () => {
      test("Group not found", async () => {
        const query = {
          groupId: "Group Uasdasdsa",
          name: "Group Udsads",
          description: "-",
        }

        let response = await request(app)
          .get("/api/v1/groups")
          .set("Authorization", token)
          .query(query);

        expect(response.status).toBe(404);
        expect(response.body.statusCode).toBe(404);
        expect(response.body.message).toEqual("Data tidak ditemukan");
      });
    });
  });


});
