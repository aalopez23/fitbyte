import initDB from "./createTable";

const run = async () => {
  try {
    const db = await initDB();
    console.log("Database tables created successfully!");
    await db.close();
    process.exit(0);
  } catch (error) {
    console.error("Error creating database tables:", error);
    process.exit(1);
  }
};

run();

