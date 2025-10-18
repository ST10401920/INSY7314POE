import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const client = new MongoClient(process.env.ATLAS_URI);
const salt = 10; 

export const users = [
  {
    name: "Pratik",
    surname: "Venna",
    username: "PratikVennaEmp1",
    employeeNumber: uuidv4(),
    password:  process.env.SEED_EMPLOYEE_PASSWORD,
    role: "employee",
  },

  {
    name: "Paul",
    surname: "Blart",
    username: "PaulBlart1",
    employeeNumber: uuidv4(),
    password:  process.env.SEED_EMPLOYEE_PASSWORD,
    role: "employee",
  },
];

// https://medium.com/@prateektiwari378/creating-seeders-in-nodejs-with-mongodb-the-correct-way-503c1ca38536
const seedUsers = async () => {
  try {
    console.log("****** SEEDING USERS *******");
    await client.connect();
    console.log("MongoDB connected successfully");

    const db = client.db("INSY7314-Task2-DB");
    const collection = db.collection("EmployeeData");

    const bulk = collection.initializeOrderedBulkOp();

    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, salt);
      const userToInsert = { ...user, password: hashedPassword };

      bulk
        .find({ username: user.username }) 
        .upsert()
        .updateOne({ $set: userToInsert });
    }

    await bulk.execute();
    console.log("****** USERS SEEDED SUCCESSFULLY *******");
  } catch (err) {
    console.error("Seeding error:", err);
  } finally {
    await client.close();
  }
};

// Run the seed script
await seedUsers();
