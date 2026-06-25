const crypto = require("crypto");

const password = process.argv[2];
if (!password || password.length < 12) {
  console.error("Usage: npm run hash-admin-password -- \"a-password-with-12+-characters\"");
  process.exitCode = 1;
} else {
  const salt = crypto.randomBytes(16);
  crypto.scrypt(password, salt, 64, (error, key) => {
    if (error) throw error;
    console.log(`${salt.toString("hex")}:${key.toString("hex")}`);
  });
}
