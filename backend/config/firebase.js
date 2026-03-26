const admin = require('firebase-admin');

// Note: You need to add your firebase-service-account.json file here
// For now, we'll initialize without it - you'll need to add the file for full functionality
let db;
try {
  const serviceAccount = require('./firebase-service-account.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
  });
  db = admin.firestore();
} catch (error) {
  console.warn('Firebase service account not found. Please add firebase-service-account.json');
  // For development, you can use a mock or skip Firebase operations
  db = null;
}

module.exports = { admin, db };