import { initializeDatabase } from "../database";
import { startDataCollection } from "../services/bitcoinPriceService";

export default defineNitroPlugin(async () => {
  console.log("Initializing server...");

  await initializeDatabase();

  startDataCollection();

  console.log("Server initialization complete");
});
