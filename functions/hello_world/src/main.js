import { Client, Databases } from "node-appwrite";

export default async ({ req, res, log, error }) => {
  try {
    // Allow only POST
    if (req.method !== "POST") {
      return res.json({ message: "Only POST requests are allowed" }, 405);
    }

    // Parse request body
    const body = JSON.parse(req.body || "{}");
    const { opdates } = body;

    if (!Array.isArray(opdates)) {
      return res.json({ error: "opdates must be an array" }, 400);
    }

    // Init Appwrite Client
    const client = new Client()
      .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
      .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
      // .setKey(process.env.APPWRITE_API_KEY);

    const databases = new Databases(client);

    const databaseId = process.env.DATABASE_ID;
    const collectionId = process.env.COLLECTION_ID;

    const results = [];

    // Loop through array
    for (const item of opdates) {
      const { id, tap, is_valid } = item;

// 1️⃣ Get existing document
const existingData = await databases.getDocument(
  databaseId,
  collectionId,
  String(id)
);

const remainingBalace = existingData.balance; // Assuming 'balance' field exists

const newBalance = remainingBalace - (tap*5);



const updatedDoc = await databases.updateDocument(
  databaseId,
  collectionId,
  String(id),
  {
    balance:newBalance, // or directly newTap
    is_valid: remainingBalace>0
  }
);


      results.push(updatedDoc);
    }

    return res.json({
      success: true,
      updated: results.length,
      data: results
    });

  } catch (err) {
    error(err.message);
    return res.json({ error: "Something went wrong", details: err.message }, 500);
  }
};
