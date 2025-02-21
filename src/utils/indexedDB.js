import { openDB } from "idb";

const DB_NAME = "QuizDB";
const STORE_NAME = "quizHistory";

const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    },
  });
};

// Ensure database is initialized before performing operations
const getDB = async () => {
  const db = await initDB();
  return db;
};

// Save quiz attempt
export const saveQuizAttempt = async (quizData) => {
  const db = await getDB();
  const tx = db.transaction(STORE_NAME, "readonly");
  const store = tx.objectStore(STORE_NAME);
  const allAttempts = await store.getAll(); // Get existing attempts

  // Check if this attempt already exists
  const isDuplicate = allAttempts.some(
    (attempt) =>
      attempt.score === quizData.score && attempt.date === quizData.date
  );

  if (!isDuplicate) {
    const txWrite = db.transaction(STORE_NAME, "readwrite");
    const storeWrite = txWrite.objectStore(STORE_NAME);
    await storeWrite.add(quizData);
    await txWrite.done;
  }
};

// Get all quiz attempts
export const getQuizHistory = async () => {
  const db = await getDB();
  if (!db) return []; // If DB is not available, return empty array

  try {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    return store.getAll();
  } catch (error) {
    console.error("Error retrieving quiz history:", error);
    return [];
  }
};
