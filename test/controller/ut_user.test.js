const request = require("supertest");
const app = require("../../app");
const { db } = require("../../src/helper/DBUtil");
const bcrypt = require("bcrypt");
const saltRounds = parseInt(process.env.SALT_ROUND);

const createDummyUser = async (param) => {
  let query =
    " INSERT INTO tb_user " +
    " (user_id, " +
    " username, " + // param.userId
    " password, " + // 'Bsp123!!'
    " full_name, " + // `UT-${param.userId}`
    " email, " + // ${param.userId}@gmail.com
    " group_id, " +
    " status, " + // Active
    " created_by, created_dt, updated_by, updated_dt) " + // 'UNIT_TEST', dt, 'UNIT_TEST', dt
    " VALUES " +
    " ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) ";

  const dt = new Date();
  let salt = bcrypt.genSaltSync(saltRounds);
  let newPassword = bcrypt.hashSync("Bsp123!!", salt);
  await db.none(query, [
    param.userId,
    param.userId,
    newPassword,
    `UT-${param.userId}`,
    `${param.userId}@gmail.com`,
    param.groupId,
    "Active",
    "UNIT_TEST",
    dt,
    "UNIT_TEST",
    dt,
  ]);
};

const updatePassword = async (username) => {
  let salt = bcrypt.genSaltSync(saltRounds);
  let newPassword = bcrypt.hashSync("Bsp123!!", salt);
  let query = `UPDATE tb_user SET password = $1 WHERE username = $2`;
  await db.none(query, [newPassword, username]);
};

const getUserIdByUsername = async (username) => {
  let query = `SELECT user_id AS "userId" FROM tb_user WHERE username = $1 `;
  const data = await db.oneOrNone(query, [username]);
  return data.userId;
};

const deleteUserByUsername = async (username) => {
  let query = ` DELETE FROM tb_user WHERE username = $1 `;
  await db.none(query, [username]);
};

jest.setTimeout(30000);

describe("User", () => {
  afterAll(async () => {
  });

  describe("Get By Id", () => {
    let token;
    beforeAll(async () => {
      const user = {
        username: "unit_testx",
        password: "Bsp123!!",
      };

      const response = await request(app).post("/api/v1/auth/login").send(user);

      token = `Bearer ${response.body.data.token}`;
    });

    describe("Get By Id Success", () => {
      test("Using token", async () => {
        let response = await request(app)
          .get("/api/v1/users/getById")
          .set("Authorization", token);

        expect(response.status).toBe(200);
        expect(response.body.statusCode).toBe(200);
        expect(response.body.message).toEqual("Data ditemukan");
      });

      test("Using userId query param ", async () => {
        const userId = await getUserIdByUsername("unit_testx");

        let response = await request(app)
          .get("/api/v1/users/getById")
          .set("Authorization", token)
          .query({ userId: userId });

        expect(response.status).toBe(200);
        expect(response.body.statusCode).toBe(200);
        expect(response.body.message).toEqual("Data ditemukan");
      });
    });

    describe("Get By Id Failed", () => {
      test("User not found", async () => {
        let response = await request(app)
          .get("/api/v1/users/getById")
          .set("Authorization", token)
          .query({ userId: "user-id-ngasal" });

        expect(response.status).toBe(404);
        expect(response.body.statusCode).toBe(404);
        expect(response.body.message).toEqual("Data tidak ditemukan");
      });
    });
  });

  describe("Change Password", () => {
    let token;
    beforeAll(async () => {
      const user = {
        username: "unit_testx",
        password: "Bsp123!!",
      };

      const response = await request(app).post("/api/v1/auth/login").send(user);

      token = `Bearer ${response.body.data.token}`;
    });

    afterAll(async () => {
    });

    describe("Change Password Success", () => {
      test("Change password success", async () => {
        const body = {
          currentPassword: "Bsp123!!",
          newPassword: "Bsp1234!!",
          newPasswordConfirmation: "Bsp1234!!",
        };

        let response = await request(app)
          .put("/api/v1/users/changePassword")
          .set("Authorization", token)
          .send(body);

        expect(response.status).toBe(200);
        expect(response.body.statusCode).toBe(200);
        expect(response.body.message).toEqual("Password berhasil diubah");

        await updatePassword("unit_testx");
      });
    });

    describe("Change Password Failed", () => {
      test("Incorrect old password", async () => {
        const body = {
          currentPassword: "Ng4salAjaBr0!",
          newPassword: "Bsp1234!!",
          newPasswordConfirmation: "Bsp1234!!",
        };

        let response = await request(app)
          .put("/api/v1/users/changePassword")
          .set("Authorization", token)
          .send(body);

        expect(response.status).toBe(400);
        expect(response.body.statusCode).toBe(400);
        expect(response.body.message).toEqual("Password tidak sama");
      });

      test("New password and confirm password is mismatch", async () => {
        const body = {
          currentPassword: "Bsp123!!",
          newPassword: "Bsp123456!!",
          newPasswordConfirmation: "Bsp12345678!!",
        };

        let response = await request(app)
          .put("/api/v1/users/changePassword")
          .set("Authorization", token)
          .send(body);

        expect(response.status).toBe(400);
        expect(response.body.statusCode).toBe(400);
        expect(response.body.message).toEqual("Validation failed");
        expect(response.body.validation.body.message).toEqual(
          `Confirm Password harus sama dengan New Password`
        );
      });
    });
  });

  describe("Create User", () => {
    let token;
    beforeAll(async () => {
      const user = {
        username: "unit_testx",
        password: "Bsp123!!",
      };

      const response = await request(app).post("/api/v1/auth/login").send(user);

      token = `Bearer ${response.body.data.token}`;
    });

    afterAll(async () => {
    });

    describe("Create User Success", () => {
      test("Full create", async () => {
        const body = {
          fullName: "Unit Test 100",
          username: "unit_test100",
          email: "unit.test.100@gmail.com",
          phone: "080000000000",
          groupId: "Admin",
          password: "Bsp123!!",
          passwordConfirmation: "Bsp123!!",
          status: "Active"
        };

        let response = await request(app)
          .post("/api/v1/users")
          .set("Authorization", token)
          .field("fullName", body.fullName)
          .field("username", body.username)
          .field("email", body.email)
          .field("phone", body.phone)
          .field("groupId", body.groupId)
          .field("password", body.password)
          .field("passwordConfirmation", body.passwordConfirmation)
          .field("status", body.status)
          .attach("file", __dirname + "/file_input/youtube.png");

        expect(response.status).toBe(200);
        expect(response.body.statusCode).toBe(200);
        expect(response.body.message).toEqual("Data berhasil disimpan");

        await deleteUserByUsername(body.username);
      });

      test("Full create; wo/ image", async () => {
        const body = {
          fullName: "Unit Test 101",
          username: "unit_test101",
          email: "unit.test.101@gmail.com",
          phone: "080000000000",
          groupId: "Admin",
          password: "Bsp123!!",
          passwordConfirmation: "Bsp123!!",
          status: "Active",
        };

        let response = await request(app)
          .post("/api/v1/users")
          .set("Authorization", token)
          .send(body);
        expect(response.status).toBe(200);
        expect(response.body.statusCode).toBe(200);
        expect(response.body.message).toEqual("Data berhasil disimpan");

        await deleteUserByUsername(body.username);
      });
    });

    describe("Create User Failed", () => {
      test("Username is already exist", async () => {
        const body = {
          fullName: "Unit Test 101",
          username: "unit_testx",
          email: "unit.test.d@gmail.com",
          phone: "080000000000",
          groupId: "Admin",
          password: "Bsp123!!",
          passwordConfirmation: "Bsp123!!",
          status: "Active"
        };

        let response = await request(app)
          .post("/api/v1/users")
          .set("Authorization", token)
          .send(body);

        expect(response.status).toBe(400);
        expect(response.body.statusCode).toBe(400);
        expect(response.body.message).toEqual("Username telah terdaftar");
      });

      test("Email is already exist", async () => {
        const body = {
          fullName: "Unit Test 101",
          username: "unit_test101",
          email: "unit.test.x@gmail.com",
          phone: "080000000000",
          groupId: "Admin",
          password: "Bsp123!!",
          passwordConfirmation: "Bsp123!!",
          status: "Active",
        };

        let response = await request(app)
          .post("/api/v1/users")
          .set("Authorization", token)
          .send(body);

        expect(response.status).toBe(400);
        expect(response.body.statusCode).toBe(400);
        expect(response.body.message).toEqual("Email telah terdaftar");
      });
      test("Foto > 10mb", async () => {
        const body = {
          fullName: "Unit Test 100",
          username: "unit_testd",
          email: "unit.test.d@gmail.com",
          phone: "080000000000",
          groupId: "Admin",
          password: "Bsp123!!",
          passwordConfirmation: "Bsp123!!",
          status: "Active"
        };

        let response = await request(app)
          .post("/api/v1/users")
          .set("Authorization", token)
          .field("fullName", body.fullName)
          .field("username", body.username)
          .field("email", body.email)
          .field("phone", body.phone)
          .field("groupId", body.groupId)
          .field("password", body.password)
          .field("passwordConfirmation", body.passwordConfirmation)
          .field("status", body.status)
          .attach("file", __dirname + "/file_input/photo_10mb.png");

        expect(response.status).toBe(400);
        expect(response.body.statusCode).toBe(400);
        expect(response.body.message).toEqual(
          "Maksimal Ukuran File Foto Profil adalah 10 MB"
        );
      });
      test("foto tidak berekstensi png, jpeg atau jpg", async () => {
        const body = {
          fullName: "Unit Test 100",
          username: "unit_test100",
          email: "unit.test.100@gmail.com",
          phone: "080000000000",
          groupId: "Admin",
          password: "Bsp123!!",
          passwordConfirmation: "Bsp123!!",
          status: "Active",
        };

        let response = await request(app)
          .post("/api/v1/users")
          .set("Authorization", token)
          .field("fullName", body.fullName)
          .field("username", body.username)
          .field("email", body.email)
          .field("phone", body.phone)
          .field("groupId", body.groupId)
          .field("password", body.password)
          .field("passwordConfirmation", body.passwordConfirmation)
          .field("status", body.status)
          .attach("file", __dirname + "/file_input/Lampiran 1.pdf");

        expect(response.status).toBe(400);
        expect(response.body.statusCode).toBe(400);
        expect(response.body.message).toEqual(
          "File Foto Profil harus berekstensi png, jpeg atau jpg"
        );
      });
    });
  });

  describe("Update User", () => {
    let token;
    beforeAll(async () => {
      const user = {
        username: "unit_testx",
        password: "Bsp123!!",
      };

      const response = await request(app).post("/api/v1/auth/login").send(user);

      token = `Bearer ${response.body.data.token}`;
    });

    afterAll(async () => {

    });

    describe("Update User Success", () => {
      test("Full update", async () => {
        const userId = await getUserIdByUsername("unit_testx");
        const body = {
          userId: userId,
          fullName: "Unit Test X",
          username: "unit_testx",
          email: "unit.test.x@gmail.com",
          phone: "080000000000",
          groupId: "Admin",
          status: "Active",
        };

        let response = await request(app)
          .put("/api/v1/users")
          .set("Authorization", token)
          .field("userId", body.userId)
          .field("fullName", body.fullName)
          .field("username", body.username)
          .field("email", body.email)
          .field("phone", body.phone)
          .field("groupId", body.groupId)
          .field("status", body.status)
          .attach("file", __dirname + "/file_input/youtube.png");

        expect(response.status).toBe(200);
        expect(response.body.statusCode).toBe(200);
        expect(response.body.message).toEqual("Data berhasil diubah");
      });

      test("Full update; wo/ image", async () => {
        const userId = await getUserIdByUsername("unit_testx");
        const body = {
          userId: userId,
          fullName: "Unit Test X",
          username: "unit_testx",
          email: "unit.test.x@gmail.com",
          phone: "080000000000",
          groupId: "Admin",
          status: "Active",
        };

        let response = await request(app)
          .put("/api/v1/users")
          .set("Authorization", token)
          .send(body);
        expect(response.status).toBe(200);
        expect(response.body.statusCode).toBe(200);
        expect(response.body.message).toEqual("Data berhasil diubah");
      });
    });

    describe("Update User Failed", () => {
      test("User ID doesn't exist", async () => {
        const body = {
          userId: "ngasal yoyoyoyoyoyoyooy",
          fullName: "Unit Test X",
          username: "unit_testy",
          email: "unit.test.x@gmail.com",
          phone: "080000000000",
          groupId: "Admin",
          status: "Active",
        };

        let response = await request(app)
          .put("/api/v1/users")
          .set("Authorization", token)
          .send(body);

        expect(response.status).toBe(404);
        expect(response.body.statusCode).toBe(404);
        expect(response.body.message).toEqual("Data tidak ditemukan");
      });

      test("Username is already exist", async () => {
        const userId = await getUserIdByUsername("unit_testx");
        const body = {
          userId: userId,
          fullName: "Unit Test X",
          username: "unit_testy",
          email: "unit.test.x@gmail.com",
          phone: "080000000000",
          groupId: "Admin",
          status: "Active",
        };

        let response = await request(app)
          .put("/api/v1/users")
          .set("Authorization", token)
          .send(body);

        expect(response.status).toBe(400);
        expect(response.body.statusCode).toBe(400);
        expect(response.body.message).toEqual("Username telah terdaftar");
      });

      test("Email is already exist", async () => {
        const userId = await getUserIdByUsername("unit_testx");
        const body = {
          userId: userId,
          fullName: "Unit Test X",
          username: "unit_testx",
          email: "unit.test.y@gmail.com",
          phone: "080000000000",
          groupId: "Admin",
          status: "Active",
        };

        let response = await request(app)
          .put("/api/v1/users")
          .set("Authorization", token)
          .send(body);

        expect(response.status).toBe(400);
        expect(response.body.statusCode).toBe(400);
        expect(response.body.message).toEqual("Email telah terdaftar");
      });
      test("Foto > 10mb", async () => {
        const userId = await getUserIdByUsername("unit_testx");
        const body = {
          userId: userId,
          fullName: "Unit Test X",
          username: "unit_testx",
          email: "unit.test.x@gmail.com",
          phone: "080000000000",
          groupId: "Admin",
          status: "Active",
        };

        let response = await request(app)
          .put("/api/v1/users")
          .set("Authorization", token)
          .field("userId", body.userId)
          .field("fullName", body.fullName)
          .field("username", body.username)
          .field("email", body.email)
          .field("phone", body.phone)
          .field("groupId", body.groupId)
          .field("status", body.status)
          .attach("file", __dirname + "/file_input/photo_10mb.png");

        expect(response.status).toBe(400);
        expect(response.body.statusCode).toBe(400);
        expect(response.body.message).toEqual(
          "Maksimal Ukuran File Foto Profil adalah 10 MB"
        );
      });
    });
  });

  describe("Delete User", () => {
    let token;
    beforeAll(async () => {
      const user = {
        username: "unit_testx",
        password: "Bsp123!!",
      };

      const response = await request(app).post("/api/v1/auth/login").send(user);

      token = `Bearer ${response.body.data.token}`;
    });

    describe("Delete User Success", () => {
      test("Delete by id", async () => {
        const user = {
          userId: "unit_test103",
          groupId: "Admin",
        };

        await createDummyUser(user);
        const body = {
          userId: user.userId,
        };
        const response = await request(app)
          .delete("/api/v1/users")
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
          userId: "ngasal browwww",
        };
        response = await request(app)
          .delete("/api/v1/users")
          .set("Authorization", token)
          .send(body);

        expect(response.status).toBe(404);
        expect(response.body.statusCode).toBe(404);
        expect(response.body.message).toEqual("Data tidak ditemukan");
      });
    });
  });

  describe("Search User", () => {
    let token;
    beforeAll(async () => {
      const user = {
        username: "unit_testx",
        password: "Bsp123!!",
      };

      const response = await request(app).post("/api/v1/auth/login").send(user);

      token = `Bearer ${response.body.data.token}`;
    });

    describe("Search Success", () => {
      test("Full parameter", async () => {
        const query = {
          fullName: "Unit",
          username: "unit",
          phone: "0",
          groupId: "Admin",
          email: "unit",
          status: "Active",
          orderBy: "full_name",
          dir: "asc",
        };

        let response = await request(app)
          .get("/api/v1/users")
          .set("Authorization", token)
          .query(query);

        expect(response.status).toBe(200);
        expect(response.body.statusCode).toBe(200);
        expect(response.body.message).toEqual("Data ditemukan");
      });

      test("Without parameter", async () => {
        let response = await request(app)
          .get("/api/v1/users")
          .set("Authorization", token);

        expect(response.status).toBe(200);
        expect(response.body.statusCode).toBe(200);
        expect(response.body.message).toEqual("Data ditemukan");
      });
    });

    describe("Search Failed", () => {
      test("User not found", async () => {
        const query = {
          fullName: "asdasdasdas",
          username: "undsadasdsadit",
          phone: "0sadasdas",
          groupId: "Admidasdasdsn",
          email: "unidasdast",
          orderBy: "full_name",
          dir: "desc",
        };

        let response = await request(app)
          .get("/api/v1/users")
          .set("Authorization", token)
          .query(query);

        expect(response.status).toBe(404);
        expect(response.body.statusCode).toBe(404);
        expect(response.body.message).toEqual("Data tidak ditemukan");
      });
    });
  });

  describe("Update User Profile", () => {
    let token;
    beforeAll(async () => {
      const user = {
        username: "unit_testx",
        password: "Bsp123!!",
      };

      const response = await request(app).post("/api/v1/auth/login").send(user);

      token = `Bearer ${response.body.data.token}`;
    });

    afterAll(async () => {

    });

    describe("Update User Success", () => {
      test("Full update", async () => {
        const body = {
          fullName: "Unit Test X",
          username: "unit_testx",
          email: "unit.test.x@gmail.com",
          phone: "080000000000",
        };

        let response = await request(app)
          .put("/api/v1/users/updateProfile")
          .set("Authorization", token)
          .field("fullName", body.fullName)
          .field("username", body.username)
          .field("email", body.email)
          .field("phone", body.phone)
          .attach("file", __dirname + "/file_input/youtube.png");

        expect(response.status).toBe(200);
        expect(response.body.statusCode).toBe(200);
        expect(response.body.message).toEqual("Data berhasil diubah");
      });

      test("Full update; wo/ image", async () => {
        const body = {
          fullName: "Unit Test X",
          username: "unit_testx",
          email: "unit.test.x@gmail.com",
          phone: "080000000000",
        };

        let response = await request(app)
          .put("/api/v1/users/updateProfile")
          .set("Authorization", token)
          .send(body);
        expect(response.status).toBe(200);
        expect(response.body.statusCode).toBe(200);
        expect(response.body.message).toEqual("Data berhasil diubah");
      });
    });

    describe("Update User Failed", () => {
      test("Username is already exist", async () => {
        const body = {
          fullName: "Unit Test X",
          username: "unit_testy",
          email: "unit.test.x@gmail.com",
          phone: "080000000000",
        };

        let response = await request(app)
          .put("/api/v1/users/updateProfile")
          .set("Authorization", token)
          .send(body);

        expect(response.status).toBe(400);
        expect(response.body.statusCode).toBe(400);
        expect(response.body.message).toEqual("Username telah terdaftar");
      });

      test("Email is already exist", async () => {
        const body = {
          fullName: "Unit Test X",
          username: "unit_testx",
          email: "unit.test.y@gmail.com",
          phone: "080000000000",
        };

        let response = await request(app)
          .put("/api/v1/users/updateProfile")
          .set("Authorization", token)
          .send(body);

        expect(response.status).toBe(400);
        expect(response.body.statusCode).toBe(400);
        expect(response.body.message).toEqual("Email telah terdaftar");
      });

      test("Foto > 10mb", async () => {
        const body = {
          fullName: "Unit Test X",
          username: "unit_testx",
          email: "unit.test.x@gmail.com",
          phone: "080000000000",
        };

        let response = await request(app)
          .put("/api/v1/users/updateProfile")
          .set("Authorization", token)
          .field("fullName", body.fullName)
          .field("username", body.username)
          .field("email", body.email)
          .field("phone", body.phone)
          .attach("file", __dirname + "/file_input/photo_10mb.png");

        expect(response.status).toBe(400);
        expect(response.body.statusCode).toBe(400);
        expect(response.body.message).toEqual(
          "Maksimal Ukuran File Foto Profil adalah 10 MB"
        );
      });
    });
  });
});
