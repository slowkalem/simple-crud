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

const deleteUserByUserId = async (userId) => {
  let query = ` DELETE FROM tb_user WHERE user_id = $1 `;
  await db.none(query, [userId]);
};

jest.setTimeout(30000);
describe("Auth", () => {

  describe("Login", () => {
    describe("Login Success", () => {
      test("Login success", async () => {
        const body = {
          username: "unit_testy",
          password: "Bsp123!!",
        };

        let response = await request(app).post("/api/v1/auth/login").send(body);
        expect(response.status).toBe(200);
        expect(response.body.statusCode).toBe(200);
        expect(response.body.message).toEqual("Login sukses");
      });
    });

    describe("Login Failed", () => {
      test("Username is not exist", async () => {
        const body = {
          username: "ngasalbroo32wqedwr",
          password: "Bsp123!!",
        };

        let response = await request(app).post("/api/v1/auth/login").send(body);
        expect(response.status).toBe(401);
        expect(response.body.statusCode).toBe(401);
        expect(response.body.message).toEqual(
          "Username / Password Salah Silahkan Coba Lagi"
        );
      });

      test("Incorrect password", async () => {
        const body = {
          username: "unit_testy",
          password: "ngasalah mas bro",
        };

        let response = await request(app).post("/api/v1/auth/login").send(body);
        expect(response.status).toBe(401);
        expect(response.body.statusCode).toBe(401);
        expect(response.body.message).toEqual(
          "Username / Password Salah Silahkan Coba Lagi"
        );
      });

      test.skip("Username is required", async () => {
        const body = {
          password: "Bsp123!!",
        };

        let response = await request(app).post("/api/v1/auth/login").send(body);
        expect(response.status).toBe(400);
        expect(response.body.statusCode).toBe(400);
        expect(response.body.message).toEqual("Validation failed");
        expect(response.body.validation.body.message).toEqual(
          `Username tidak boleh kosong`
        );
      });

      test("Password is required", async () => {
        const body = {
          username: "unit_testy",
        };

        let response = await request(app).post("/api/v1/auth/login").send(body);
        expect(response.status).toBe(400);
        expect(response.body.statusCode).toBe(400);
        expect(response.body.message).toEqual("Validation failed");
        expect(response.body.validation.body.message).toEqual(
          `Password wajib diisi`
        );
      });

      test("User not active", async () => {
        const body = {
          username: "unit_test_not_active",
          password: "Bsp123!!",
        };

        let response = await request(app).post("/api/v1/auth/login").send(body);
        expect(response.status).toBe(401);
        expect(response.body.statusCode).toBe(401);
        expect(response.body.message).toEqual(
          "Username / Password Salah Silahkan Coba Lagi"
        );
      });
    });
  });

  describe("Logout", () => {
    describe("Logout Success", () => {
      test("Logout success", async () => {
        const body = {
          username: "unit_testy",
          password: "Bsp123!!",
        };

        let response = await request(app).post("/api/v1/auth/login").send(body);
        let token = `Bearer ${response.body.data.token}`;

        response = await request(app)
          .post("/api/v1/auth/logout")
          .set("Authorization", token);
        expect(response.status).toBe(200);
        expect(response.body.statusCode).toBe(200);
        expect(response.body.message).toEqual("Logout sukses");
      });
    });

    describe("Logout Failed", () => {
      test("Token is missing", async () => {
        const body = {
          password: "Bsp123!!",
        };

        let response = await request(app).post("/api/v1/auth/logout");
        expect(response.status).toBe(401);
        expect(response.body.statusCode).toBe(401);
        expect(response.body.message).toEqual("Token tidak ada");
      });

      test("Token is not valid", async () => {
        const body = {
          password: "Bsp123!!",
        };

        let response = await request(app)
          .post("/api/v1/auth/logout")
          .set("Authorization", "token ngasal");
        expect(response.status).toBe(401);
        expect(response.body.statusCode).toBe(401);
        expect(response.body.message).toEqual("Token tidak valid");
      });
    });
  });

  describe("Permission Filter", () => {
    test("No Permission Access", async () => {
      const body = {
        username: "unit_testv",
        password: "Bsp123!!",
      };

      let response = await request(app).post("/api/v1/auth/login").send(body);
      const token = `Bearer ${response.body.data.token}`;

      response = await request(app)
        .get("/api/v1/users")
        .set("Authorization", token);
      expect(response.status).toBe(401);
      expect(response.body.statusCode).toBe(401);
      expect(response.body.message).toEqual("Anda tidak memiliki akses!");
    });
  });

  describe("Forgot Password", () => {
    beforeAll(async () => {
      const uManajer = {
        userId: "ut_manajer_fp1",
        groupId: "Manajer",
      };

      await createDummyUser(uManajer);
    });

    afterAll(async () => {
      await deleteUserByUserId("ut_manajer_fp1");
    });

    describe("Sukses", () => {
      test("Forgot password", async () => {
        const body1 = {
          email: "ut_manajer_fp1@gmail.com",
        };
        let response = await request(app)
          .post("/api/v1/auth/sendOTP")
          .send(body1);

        expect(response.status).toBe(200);
        expect(response.body.statusCode).toBe(200);
        expect(response.body.message).toEqual(
          "Kode OTP telah dikirimkan ke email anda!"
        );

        const body2 = {
          email: body1.email,
          isVerifyOTP: true,
          OTP: "00100",
        };
        response = await request(app)
          .post("/api/v1/auth/resetPassword")
          .send(body2);

        expect(response.status).toBe(200);
        expect(response.body.statusCode).toBe(200);
        expect(response.body.message).toEqual("Kode OTP Telah Diverifikasi");

        const body3 = {
          email: body1.email,
          isVerifyOTP: false,
          password: "Bsp123!!",
          passwordConfirmation: "Bsp123!!",
        };
        response = await request(app)
          .post("/api/v1/auth/resetPassword")
          .send(body3);

        expect(response.status).toBe(200);
        expect(response.body.statusCode).toBe(200);
        expect(response.body.message).toEqual("Reset password sukses");
      });
    });

    describe("Gagal", () => {
      test("Email tidak ditemukan", async () => {
        const body1 = {
          email: "dasidhnaisjndkn32endasdmsa@gmail.com",
        };
        let response = await request(app)
          .post("/api/v1/auth/sendOTP")
          .send(body1);

        expect(response.status).toBe(200);
        expect(response.body.statusCode).toBe(200);
        expect(response.body.message).toEqual(
          "Kode OTP telah dikirimkan ke email anda!"
        );
      });

      test("OTP tidak valid", async () => {
        const body1 = {
          email: "ut_manajer_fp1@gmail.com",
        };
        let response = await request(app)
          .post("/api/v1/auth/sendOTP")
          .send(body1);

        expect(response.status).toBe(200);
        expect(response.body.statusCode).toBe(200);
        expect(response.body.message).toEqual(
          "Kode OTP telah dikirimkan ke email anda!"
        );

        const body2 = {
          email: body1.email,
          isVerifyOTP: true,
          OTP: "00000",
        };
        response = await request(app)
          .post("/api/v1/auth/resetPassword")
          .send(body2);

        expect(response.status).toBe(400);
        expect(response.body.statusCode).toBe(400);
        expect(response.body.message).toEqual("Kode OTP Tidak Valid");
      });

      test("OTP belum diverifikasi", async () => {
        const body1 = {
          email: "ut_manajer_fp1@gmail.com",
        };
        let response = await request(app)
          .post("/api/v1/auth/sendOTP")
          .send(body1);

        expect(response.status).toBe(200);
        expect(response.body.statusCode).toBe(200);
        expect(response.body.message).toEqual(
          "Kode OTP telah dikirimkan ke email anda!"
        );

        const body3 = {
          email: body1.email,
          isVerifyOTP: false,
          password: "Bsp123!!",
          passwordConfirmation: "Bsp123!!",
        };
        response = await request(app)
          .post("/api/v1/auth/resetPassword")
          .send(body3);

        expect(response.status).toBe(400);
        expect(response.body.statusCode).toBe(400);
        expect(response.body.message).toEqual(
          "Tidak Dapat Mengatur Ulang Password, Kode OTP Tidak Terverifikasi!"
        );
      });
    });
  });
});
