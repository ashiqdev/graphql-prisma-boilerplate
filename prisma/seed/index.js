const { createUser } = require("./user");

async function seedDB() {
  await createUser();
  return "Seed Complete";
}

seedDB().then(console.log);
