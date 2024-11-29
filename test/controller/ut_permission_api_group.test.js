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

const createDummyGroup = async (param) => {
  let query =
    ' INSERT INTO tb_group ' +
    ' (group_id, ' +
    ' group_name, ' +
    ' group_desc) ' +
    ' VALUES ' +
    ' ($1,$2,$3) '

  await db.none(query, [
    param.groupId,
    param.name,
    param.description,
  ])
}

const createDummyPermissionAPIGroup = async (param) => {
  let query =
    ' INSERT INTO tb_permission_api_group ' +
    ' (permission_api_group_id, ' +
    ' group_id, ' +
    ' permission_api_id) ' +
    ' VALUES ' +
    ' ($1,$2,$3) '

  await db.none(query, [
    param.permissionAPIGroupId,
    param.groupId,
    param.permissionAPIId,
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

const deleteGroupByGroupId = async (groupId) => {
  let query = ` DELETE FROM tb_group WHERE group_id = $1 `;
  await db.none(query, [groupId]);
}

const deletePermissionAPIGroupByPermissionAPIGroupId = async (permissionAPIGroupId) => {
  let query = ` DELETE FROM tb_permission_api_group WHERE permission_api_group_id = $1 `;
  await db.none(query, [permissionAPIGroupId]);
}

jest.setTimeout(30000);

describe("Permission API Group", () => {
  beforeAll(async () => {

    const func = {
      functionId: 'Test Function UT PAG',
      name: 'Test Function UT Name PAG',
    }

    const permissionAPI = {
      permissionAPIId: 'Test Permission API UT PAG',
      functionId: func.functionId,
      action: 'TEST PAG',
      HTTPMethod: 'TEST PAG',
      APIURLName: '/tests',
      status: 'Active'
    }

    const group = {
      groupId: 'TEST PAG',
      name: 'TEST PAG',
      description: 'TEST PAG',
    }

    const permissionAPIGroup = {
      permissionAPIGroupId: 'Test UT PAG',
      permissionAPIId: permissionAPI.permissionAPIId,
      groupId: group.groupId,
    }

    await createDummyFunction(func);
    await createDummyPermissionAPI(permissionAPI);
    await createDummyGroup(group);
    await createDummyPermissionAPIGroup(permissionAPIGroup);
  });

  afterAll(async () => {
    await deleteFunctionByFunctionId('Test Function UT PAG');
    await deletePermissionAPIByPermissionAPIId('Test Permission API UT PAG');
    await deleteGroupByGroupId('TEST PAG');
    await deletePermissionAPIGroupByPermissionAPIGroupId('Test UT PAG');
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
          .get("/api/v1/apiGroups/getById")
          .set("Authorization", token)
          .query({ permissionAPIGroupId: 'Test UT PAG' });

        expect(response.status).toBe(200);
        expect(response.body.statusCode).toBe(200);
        expect(response.body.message).toEqual("Data ditemukan");
      });
    });

    describe("Get By Id Failed", () => {
      test("User not found", async () => {
        let response = await request(app)
          .get("/api/v1/apiGroups/getById")
          .set("Authorization", token)
          .query({ permissionAPIGroupId: "user-id-ngasal" });

        expect(response.status).toBe(404);
        expect(response.body.statusCode).toBe(404);
        expect(response.body.message).toEqual("Data tidak ditemukan");
      });
    });
  });

  describe("Create Permission API Group", () => {
    let token;
    beforeAll(async () => {
      const user = {
        username: "unit_testy",
        password: "Bsp123!!",
      };

      const response = await request(app).post("/api/v1/auth/login").send(user);

      token = `Bearer ${response.body.data.token}`;
    });

    describe("Create Permission API Group Success", () => {
      test("Create one", async () => {
        const body = {
          permissionAPIGroupId: 'Test UT PAG 7',
          permissionAPIId: 'Test Permission API UT PAG',
          groupId: 'TEST PAG',
        }

        let response = await request(app)
          .post("/api/v1/apiGroups")
          .set("Authorization", token)
          .send(body);

        expect(response.status).toBe(200);
        expect(response.body.statusCode).toBe(200);
        expect(response.body.message).toEqual("Permission API Group data berhasil dibuat");

        await deletePermissionAPIGroupByPermissionAPIGroupId(body.permissionAPIGroupId);
      });
    });

    describe("Create Permission API Group Failed", () => {
      test("Permission API id doesn't exist", async () => {
        const body = {
          permissionAPIGroupId: 'Test UT PAG 1x',
          permissionAPIId: 'ngasallllllllll',
          groupId: 'TEST PAG',
        }

        let response = await request(app)
          .post("/api/v1/apiGroups")
          .set("Authorization", token)
          .send(body);

        expect(response.status).toBe(400);
        expect(response.body.statusCode).toBe(400);
        expect(response.body.message).toEqual(
          "Permission API ID tidak terdaftar"
        );
      });

      test("Group id doesn't exist", async () => {
        const body = {
          permissionAPIGroupId: 'Test UT PAG 1x',
          permissionAPIId: 'Test Permission API UT PAG',
          groupId: 'ngasalalallala',
        }

        let response = await request(app)
          .post("/api/v1/apiGroups")
          .set("Authorization", token)
          .send(body);

        expect(response.status).toBe(400);
        expect(response.body.statusCode).toBe(400);
        expect(response.body.message).toEqual(
          "Group ID tidak terdaftar"
        );
      });
    });
  });

  describe("Update Permission API Group", () => {
    let token;
    beforeAll(async () => {
      const user = {
        username: "unit_testy",
        password: "Bsp123!!",
      };

      const response = await request(app).post("/api/v1/auth/login").send(user);

      token = `Bearer ${response.body.data.token}`;
    });

    describe("Update Permission API Group Success", () => {
      test("Full update", async () => {
        const body = {
          permissionAPIGroupId: 'Test UT PAG 2',
          permissionAPIId: 'Test Permission API UT PAG',
          groupId: 'TEST PAG',
        }

        await createDummyPermissionAPIGroup(body);

        let response = await request(app)
          .put("/api/v1/apiGroups")
          .set("Authorization", token)
          .send(body);

        expect(response.status).toBe(200);
        expect(response.body.statusCode).toBe(200);
        expect(response.body.message).toEqual("Permission API Group data berhasil diubah");

        await deletePermissionAPIGroupByPermissionAPIGroupId(body.permissionAPIGroupId);
      });
    });

    describe("Update Permission API Group Failed", () => {
      test("Permission API id doesn't exist", async () => {
        const body = {
          permissionAPIGroupId: 'Test UT PAG 3',
          permissionAPIId: 'Test Permission API UT PAG',
          groupId: 'TEST PAG',
        }

        await createDummyPermissionAPIGroup(body);

        body.permissionAPIGroupId = "ngasal ngasl ey"
        let response = await request(app)
          .put("/api/v1/apiGroups")
          .set("Authorization", token)
          .send(body);

        expect(response.status).toBe(404);
        expect(response.body.statusCode).toBe(404);
        expect(response.body.message).toEqual(
          "Data tidak ditemukan"
        );

        await deletePermissionAPIGroupByPermissionAPIGroupId(body.permissionAPIGroupId);
      });

      test("Permission API id doesn't exist", async () => {
        const body = {
          permissionAPIGroupId: 'Test UT PAG 4',
          permissionAPIId: 'Test Permission API UT PAG',
          groupId: 'TEST PAG',
        }

        await createDummyPermissionAPIGroup(body);

        body.permissionAPIId = "ngasal ngasl ey"
        let response = await request(app)
          .put("/api/v1/apiGroups")
          .set("Authorization", token)
          .send(body);

        expect(response.status).toBe(400);
        expect(response.body.statusCode).toBe(400);
        expect(response.body.message).toEqual(
          "Permission API ID tidak terdaftar"
        );

        await deletePermissionAPIGroupByPermissionAPIGroupId(body.permissionAPIGroupId);
      });

      test("Function id doesn't exist", async () => {
        const body = {
          permissionAPIGroupId: 'Test UT PAG 5',
          permissionAPIId: 'Test Permission API UT PAG',
          groupId: 'TEST PAG',
        }

        await createDummyPermissionAPIGroup(body);

        body.groupId = "ngasal ngasl ey"
        let response = await request(app)
          .put("/api/v1/apiGroups")
          .set("Authorization", token)
          .send(body);

        expect(response.status).toBe(400);
        expect(response.body.statusCode).toBe(400);
        expect(response.body.message).toEqual(
          "Group ID tidak terdaftar"
        );

        await deletePermissionAPIGroupByPermissionAPIGroupId(body.permissionAPIGroupId);
      });
    });
  });

  describe("Delete Permission API Group", () => {
    let token;
    beforeAll(async () => {
      const user = {
        username: "unit_testy",
        password: "Bsp123!!",
      };

      const response = await request(app).post("/api/v1/auth/login").send(user);

      token = `Bearer ${response.body.data.token}`;
    });

    describe("Delete Permission API Group Success", () => {
      test("Delete by id", async () => {
        const body = {
          permissionAPIGroupId: 'Test UT PAG 6',
          permissionAPIId: 'Test Permission API UT PAG',
          groupId: 'TEST PAG',
        }

        await createDummyPermissionAPIGroup(body);

        response = await request(app)
          .delete("/api/v1/apiGroups")
          .set("Authorization", token)
          .send(body);

        expect(response.status).toBe(200);
        expect(response.body.statusCode).toBe(200);
        expect(response.body.message).toEqual("Permission API Group data berhasil dihapus");
      });
    });

    describe("Delete Permission API Group Failed", () => {
      test("Permission API doesn't exist", async () => {
        const body = {
          permissionAPIGroupId: "ngasal browwww"
        }
        response = await request(app)
          .delete("/api/v1/apiGroups")
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
          groupId: 'test',
          groupName: 'test',
          perPage: 10,
          page: 1,
          orderBy: "api_url_name",
          dir: "asc"
        };

        let response = await request(app)
          .get("/api/v1/apiGroups")
          .set("Authorization", token)
          .query(query);

        expect(response.status).toBe(200);
        expect(response.body.statusCode).toBe(200);
        expect(response.body.message).toEqual("Data ditemukan");
      });

      test("Without parameter", async () => {
        const query = {
          groupId: 'test',
        };

        let response = await request(app)
          .get("/api/v1/apiGroups")
          .set("Authorization", token)
          .query(query);

        expect(response.status).toBe(200);
        expect(response.body.statusCode).toBe(200);
        expect(response.body.message).toEqual("Data ditemukan");
      });
    });

    describe("Search Failed", () => {
      test("Group not found", async () => {
        const query = {
          permissionAPIId: 'Tesfsdfsdt',
          functionId: 'tedsfdsst',
          functionName: 'tesfdsft',
          action: 'TEfsdfsdST',
          HTTPMethod: 'TEfsdfsdST',
          APIURLName: 'tesfdsfsdts',
          groupId: 'tfsdfsdest',
          groupName: 'tefdsfsdst',
          perPage: 10,
          page: 1,
          dir: "asc"
        };

        let response = await request(app)
          .get("/api/v1/apiGroups")
          .set("Authorization", token)
          .query(query);

        expect(response.status).toBe(404);
        expect(response.body.statusCode).toBe(404);
        expect(response.body.message).toEqual("Data tidak ditemukan");
      });
    });
  });

  describe("Bulk Create Permission API Group", () => {
    let token;
    beforeAll(async () => {
      const user = {
        username: "unit_testy",
        password: "Bsp123!!",
      };

      const response = await request(app).post("/api/v1/auth/login").send(user);

      token = `Bearer ${response.body.data.token}`;
    });

    describe("Bulk Create Permission API Group Success", () => {
      test("Create one", async () => {
        const body = [
          {
            permissionAPIGroupId: 'Test UT PAG 7',
            permissionAPIId: 'Test Permission API UT PAG',
            groupId: 'TEST PAG',
          },
        ]


        let response = await request(app)
          .post("/api/v1/apiGroups/bulkCreate")
          .set("Authorization", token)
          .send(body);
        expect(response.status).toBe(200);
        expect(response.body.statusCode).toBe(200);
        expect(response.body.message).toEqual("Permission API Group data berhasil dibuat");

        await deletePermissionAPIGroupByPermissionAPIGroupId(body[0].permissionAPIGroupId);
      });
    });

    describe("Bulk Create Permission API Group Failed", () => {
      test("Permission API id doesn't exist", async () => {
        const body = [
          {
            permissionAPIGroupId: 'Test UT PAG 1x',
            permissionAPIId: 'ngasallllllllll',
            groupId: 'TEST PAG',
          },
        ]

        let response = await request(app)
          .post("/api/v1/apiGroups/bulkCreate")
          .set("Authorization", token)
          .send(body);

        expect(response.status).toBe(400);
        expect(response.body.statusCode).toBe(400);
        expect(response.body.message).toEqual(
          "Permission API ID tidak terdaftar"
        );
      });

      test("Group id doesn't exist", async () => {
        const body = [
          {
            permissionAPIGroupId: 'Test UT PAG 1x',
            permissionAPIId: 'Test Permission API UT PAG',
            groupId: 'ngasalalallala',
          },
        ]

        let response = await request(app)
          .post("/api/v1/apiGroups/bulkCreate")
          .set("Authorization", token)
          .send(body);

        expect(response.status).toBe(400);
        expect(response.body.statusCode).toBe(400);
        expect(response.body.message).toEqual(
          "Group ID tidak terdaftar"
        );
      });
    });
  });

  describe("Delete Permission API Group", () => {
    let token;
    beforeAll(async () => {
      const user = {
        username: "unit_testy",
        password: "Bsp123!!",
      };

      const response = await request(app).post("/api/v1/auth/login").send(user);

      token = `Bearer ${response.body.data.token}`;
    });

    describe("Bulk Delete Permission API Group Success", () => {
      test("Delete by id", async () => {
        const permissionAPIGroup = {
          permissionAPIGroupId: 'Test UT PAG 8',
          permissionAPIId: 'Test Permission API UT PAG',
          groupId: 'TEST PAG',
        }

        await createDummyPermissionAPIGroup(permissionAPIGroup);

        const body = [
          {
            permissionAPIGroupId: permissionAPIGroup.permissionAPIGroupId
          }
        ]

        response = await request(app)
          .delete("/api/v1/apiGroups/bulkDelete")
          .set("Authorization", token)
          .send(body);

        expect(response.status).toBe(200);
        expect(response.body.statusCode).toBe(200);
        expect(response.body.message).toEqual("Permission API Group data berhasil dihapus");
      });
    });

    describe("Delete Permission API Group Failed", () => {
      test("Permission API doesn't exist", async () => {
        const body = [
          {
            permissionAPIGroupId: "ngasal browwww"
          }
        ]
        response = await request(app)
          .delete("/api/v1/apiGroups/bulkDelete")
          .set("Authorization", token)
          .send(body);

        expect(response.status).toBe(404);
        expect(response.body.statusCode).toBe(404);
        expect(response.body.message).toEqual("Data tidak ditemukan");
      });
    });
  });

});
