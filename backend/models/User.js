const { db } = require('../config/firebase');

class User {
  constructor(data) {
    this.email = data.email;
    this.password = data.password;
    this.name = data.name;
    this.createdAt = new Date();
  }

  static async create(userData) {
    if (!db) throw new Error('Database not initialized');
    const userRef = db.collection('users').doc();
    await userRef.set({
      ...userData,
      createdAt: new Date()
    });
    return { id: userRef.id, ...userData };
  }

  static async findByEmail(email) {
    if (!db) throw new Error('Database not initialized');
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).get();
    if (snapshot.empty) {
      return null;
    }
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  }

  static async findById(id) {
    if (!db) throw new Error('Database not initialized');
    const userRef = db.collection('users').doc(id);
    const doc = await userRef.get();
    if (!doc.exists) {
      return null;
    }
    return { id: doc.id, ...doc.data() };
  }
}

module.exports = User;