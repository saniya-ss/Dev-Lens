const { db } = require('../config/firebase');

class Project {
  constructor(data) {
    this.name = data.name;
    this.description = data.description;
    this.userId = data.userId;
    this.aiInsights = data.aiInsights || {};
    this.createdAt = new Date();
  }

  static async create(projectData) {
    if (!db) throw new Error('Database not initialized');
    const projectRef = db.collection('projects').doc();
    await projectRef.set({
      ...projectData,
      createdAt: new Date()
    });
    return { id: projectRef.id, ...projectData };
  }

  static async findByUserId(userId) {
    if (!db) throw new Error('Database not initialized');
    const projectsRef = db.collection('projects');
    const snapshot = await projectsRef.where('userId', '==', userId).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async findById(id) {
    if (!db) throw new Error('Database not initialized');
    const projectRef = db.collection('projects').doc(id);
    const doc = await projectRef.get();
    if (!doc.exists) {
      return null;
    }
    return { id: doc.id, ...doc.data() };
  }

  static async update(id, updateData) {
    if (!db) throw new Error('Database not initialized');
    const projectRef = db.collection('projects').doc(id);
    await projectRef.update(updateData);
    return { id, ...updateData };
  }
}

module.exports = Project;