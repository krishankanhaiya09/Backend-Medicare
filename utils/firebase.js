import admin from "firebase-admin";

const firebaseKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (!firebaseKey) {
  console.log("FIREBASE_SERVICE_ACCOUNT_KEY missing");
} else {
  const serviceAccount = JSON.parse(firebaseKey);
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
}

export default admin;