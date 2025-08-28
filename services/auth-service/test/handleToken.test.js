import { generateTokens, verifyToken } from "../utils/handleToken.js";
import dotenv from "dotenv";

dotenv.config();

test("Generate Token", () => {
  expect(
    generateTokens({
      id: 1,
      username: "testuser",
      email: "exemple@exmple.com",
      password: "testpassword",
    })
  ).toBe(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0dXNlciIsImVtYWlsIjoiZXhlbXBsZUBleG1wbGUuY29tIiwicGFzc3dvcmQiOiJ0ZXN0cGFzc3dvcmQifQ.yKFdh2fl20OsHiETLkhudgVzOUFGW_n2YC9RwxLSP64"
  );
});
