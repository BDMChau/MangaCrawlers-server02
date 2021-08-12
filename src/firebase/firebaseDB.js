const firebaseDatabase = require("./firebaseConfig");

const firebaseDB = {
    toPush: (collection, data) => {
        const snapshot = firebaseDatabase.ref(collection).push(data);
        return snapshot
    },
    toGetKeyOfPush: (collection, data) => {
        const snapshot = firebaseDatabase.ref(collection).push().getKey();
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
            console.log(error);
        }
    },

    isExisted: async (collection, key, value) => {
        try {
            const snapshot = await firebaseDatabase.ref(collection).orderByChild(key).equalTo(value).once("value");
            return snapshot.val();

        } catch (err) {
            console.log(err)
        }
    },
    paginate: async (collection, key, offset, limit) => {
        try {
            const snapshot = await firebaseDatabase.ref(collection)
                .child(key)
                .orderByKey()
                .endAt(offset.toString())
                .limitToLast(limit)
                .once("value");

            return snapshot;
        } catch (err) {
            console.log(err)
        }
    },
    paginateInFirstTime: async (collection, key, limit) => {
        try {
            const snapshot = await firebaseDatabase.ref(collection)
                .child(key)
                .limitToLast(limit)
                .once("value");

            return snapshot;
        } catch (err) {
            console.log(err)
        }
    },
}

module.exports = firebaseDB;