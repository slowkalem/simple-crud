const request = require("supertest");
const app = require("../../app");
const { db } = require("../../src/helper/DBUtil");

const createDummyFunction = async (param) => {
  let query =
    ' INSERT INTO tb_function ' +
    ' (function_id, ' +
    ' function_name) ' +
    ' VALUES ' +
    ' ($1,$2) '

  await db.none(query, [
    param.functionId,
    param.name,
  ])
}

const createDummyPermissionAPI = async (param) => {
  let query =
    ' INSERT INTO tb_permission_api ' +
    ' (permission_api_id, ' +
    ' function_id, ' +
    ' action, ' +
    ' http_method, ' +
    ' api_url_name, ' +
    ' status) ' +
    ' VALUES ' +
    ' ($1,$2,$3,$4,$5,$6) '

  await db.none(query, [
    param.permissionAPIId,
    param.functionId,
    param.action,
    param.HTTPMethod,
    param.APIURLName,
    param.status,
  ])
}

const deleteFunctionByFunctionId = async (functionId) => {
  let query = ` DELETE FROM tb_function WHERE function_id = $1 `;
  await db.none(query, [functionId]);
}

const deletePermissionAPIByPermissionAPIId = async (permissionAPIId) => {
  let query = ` DELETE FROM tb_permission_api WHERE permission_api_id = $1 `;
  await db.none(query, [permissionAPIId]);
}

const deletePermissionAPIByAction = async (action) => {
  let query = ` DELETE FROM tb_permission_api WHERE action = $1 `;
  await db.none(query, [action]);
}

jest.setTimeout(30000);

describe("Permission API", () => {
  beforeAll(async () => {

    const func = {
      functionId: 'Test Function UT',
      name: 'Test Function UT Name',
    }

    const permissionAPI = {
      permissionAPIId: 'Test Permission API UT',
      functionId: func.functionId,
      action: 'TEST',
      HTTPMethod: 'TEST',
      APIURLName: '/tests',
      status: 'Active'
    }

    await createDummyFunction(func);
    await createDummyPermissionAPI(permissionAPI);
  });

  afterAll(async () => {
    await deleteFunctionByFunctionId('Test Function UT');
    await deletePermissionAPIByPermissionAPIId('Test Permission API UT');
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
          .get("/api/v1/apis/getById")
          .set("Authorization", token)
          .query({ permissionAPIId: 'Test Permission API UT' });

        expect(response.status).toBe(200);
        expect(response.body.statusCode).toBe(200);
        expect(response.body.message).toEqual("Data ditemukan");
      });
    });

    describe("Get By Id Failed", () => {
      test("User not found", async () => {
        let response = await request(app)
          .get("/api/v1/apis/getById")
          .set("Authorization", token)
          .query({ permissionAPIId: "user-id-ngasal" });

        expect(response.status).toBe(404);
        expect(response.body.statusCode).toBe(404);
        expect(response.body.message).toEqual("Data tidak ditemukan");
      });
    });
  });

  describe("Create Permission API", () => {
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
          functionId: 'Test Function UT',
          action: 'TEST2',
          HTTPMethod: 'TEST2',
          APIURLName: '/tests',
          status: 'Active'
        };

        let response = await request(app)
          .post("/api/v1/apis")
          .set("Authorization", token)
          .send(body);
        expect(response.status).toBe(200);
        expect(response.body.statusCode).toBe(200);
        expect(response.body.message).toEqual("Permission API data berhasil dibuat");

        await deletePermissionAPIByAction(body.action);
      });
    });

    describe("Create User Failed", () => {
      test("Function ID doesn't exist", async () => {
        const body = {
          functionId: 'ngasallllllllll',
          action: 'TEST2',
          HTTPMethod: 'TEST2',
          APIURLName: '/tests',
          status: 'Active'
        };

        let response = await request(app)
          .post("/api/v1/apis")
          .set("Authorization", token)
          .send(body);

        expect(response.status).toBe(400);
        expect(response.body.statusCode).toBe(400);
        expect(response.body.message).toEqual(
          "Function ID tidak terdaftar"
        );
      });
    });
  });

  describe("Update Permission API", () => {
    let token;
    beforeAll(async () => {
      const user = {
        username: "unit_testy",
        password: "Bsp123!!",
      };

      const response = await request(app).post("/api/v1/auth/login").send(user);

      token = `Bearer ${response.body.data.token}`;
    });

    describe("Update Permission API Success", () => {
      test("Full update", async () => {
        const body = {
          permissionAPIId: 'Test Permission API UT 2',
          functionId: 'Test Function UT',
          action: 'TEST3',
          HTTPMethod: 'TEST3',
          APIURLName: '/tests',
          status: 'Active'
        }

        await createDummyPermissionAPI(body);

        let response = await request(app)
          .put("/api/v1/apis")
          .set("Authorization", token)
          .send(body);

        expect(response.status).toBe(200);
        expect(response.body.statusCode).toBe(200);
        expect(response.body.message).toEqual("Permission API data berhasil diubah");

        await deletePermissionAPIByAction(body.action);
      });
    });

    describe("Update User Failed", () => {
      test("Permission API id doesn't exist", async () => {
        const body = {
          permissionAPIId: 'Test Permission API UT 3',
          functionId: 'Test Function UT',
          action: 'TEST4',
          HTTPMethod: 'TEST4',
          APIURLName: '/tests',
          status: 'Active'
        }

        await createDummyPermissionAPI(body);

        body.permissionAPIId = "ngasal ngasl ey"
        let response = await request(app)
          .put("/api/v1/apis")
          .set("Authorization", token)
          .send(body);

        expect(response.status).toBe(404);
        expect(response.body.statusCode).toBe(404);
        expect(response.body.message).toEqual(
          "Data tidak ditemukan"
        );

        await deletePermissionAPIByAction(body.action);
      });

      test("Function id doesn't exist", async () => {
        const body = {
          permissionAPIId: 'Test Permission API UT 4',
          functionId: 'Test Function UT',
          action: 'TEST5',
          HTTPMethod: 'TEST5',
          APIURLName: '/tests',
          status: 'Active'
        }

        await createDummyPermissionAPI(body);

        body.functionId = "ngasal ngasl ey"
        let response = await request(app)
          .put("/api/v1/apis")
          .set("Authorization", token)
          .send(body);

        expect(response.status).toBe(400);
        expect(response.body.statusCode).toBe(400);
        expect(response.body.message).toEqual(
          "Function ID tidak terdaftar"
        );

        await deletePermissionAPIByAction(body.action);
      });
    });
  });

  describe("Delete Permission API", () => {
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
        const body = {
          permissionAPIId: 'Test Permission API UT 5',
          functionId: 'Test Function UT',
          action: 'TEST3',
          HTTPMethod: 'TEST3',
          APIURLName: '/tests',
          status: 'Active'
        }

        await createDummyPermissionAPI(body);

        response = await request(app)
          .delete("/api/v1/apis")
          .set("Authorization", token)
          .send(body);

        expect(response.status).toBe(200);
        expect(response.body.statusCode).toBe(200);
        expect(response.body.message).toEqual("Permission API data berhasil dihapus");
      });
    });

    describe("Delete Permission API Failed", () => {
      test("Permission API doesn't exist", async () => {
        const body = {
          permissionAPIId: "ngasal browwww"
        }
        response = await request(app)
          .delete("/api/v1/apis")
          .set("Authorization", token)
          .send(body);

        expect(response.status).toBe(404);
        expect(response.body.statusCode).toBe(404);
        expect(response.body.message).toEqual("Data tidak ditemukan");
      });
    });
  });

  describe("Search Permission API", () => {
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
          permissionAPIId: 'Test',
          functionId: 'test',
          functionName: 'test',
          action: 'TEST',
          HTTPMethod: 'TEST',
          APIURLName: 'tests',
          status: 'Active',
          perPage: 10,
          page: 1,
          orderBy: "function_name",
          dir: "asc"
        };

        let response = await request(app)
          .get("/api/v1/apis")
          .set("Authorization", token)
          .query(query);

        expect(response.status).toBe(200);
        expect(response.body.statusCode).toBe(200);
        expect(response.body.message).toEqual("Data ditemukan");
      });

      test("Without parameter", async () => {
        let response = await request(app)
          .get("/api/v1/apis")
          .set("Authorization", token)

        expect(response.status).toBe(200);
        expect(response.body.statusCode).toBe(200);
        expect(response.body.message).toEqual("Data ditemukan");
      });
    });

    describe("Search Failed", () => {
      test("Group not found", async () => {
        const query = {
          permissionAPIId: 'dsada',
          functionId: 'testasdsa',
          functionId: 'testdas',
          action: 'TESdsaT',
          HTTPMethod: 'TESdsT',
          APIURLName: 'testdss',
          dir: "adasdassc"
        }

        let response = await request(app)
          .get("/api/v1/apis")
          .set("Authorization", token)
          .query(query);

        expect(response.status).toBe(404);
        expect(response.body.statusCode).toBe(404);
        expect(response.body.message).toEqual("Data tidak ditemukan");
      });
    });
  });


});
