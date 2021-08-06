const firebaseDatabase = require("./firebaseConfig");

const firebaseDB = {
    toPush: (collection, data) => {
        const snapshot = firebaseDatabase.ref(collection).push(data);
        return snapshot
    },

    toSet: (collection, data) => {
        const snapshot = firebaseDatabase.ref(collection).set(data);
        return snapshot
    },

    toUpdate: (collection, data) => {
        firebaseDatabase.ref(collection).update(data);
    },

    toRemove: (collection) => {
        firebaseDatabase.ref(collection).remove();
    },

    toRemoveAll: () => {
        firebaseDatabase.ref().remove();
    },

    toReadByAKey: async (collection, key) => {
        try {
            const snapshot = await firebaseDatabase.ref(collection).child(key).once("value");
            return snapshot.val();

        } catch (error) {
            throw error;
        }
    },

    toRead: (collection) => {
        const snapshot = firebaseDatabase.ref(collection);
        return snapshot;
    },

    isExist: (collection, key, value) => {
        const snapshot = firebaseDatabase.ref(collection).orderByChild(key).equalTo(value).once("value");
        return snapshot;
    }
}

module.exports = firebaseDB;