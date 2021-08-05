
// float 0.00
const resources = {
    update: (userValue) => {
        let currentResources = 0;
        let usedResources = 0;
        let restResources = 0;
        let totalFilesSize = 0;
        const { fileupload, resources } = userValue;

        if (!fileupload) {
            const resourcesUpdated = {
                current: 15.00,
                used: 0.00,
                rest: 15.00
            }

            return { code: true, resourcesUpdated }
        }

        fileupload.forEach((file) => {
            totalFilesSize += file.bytes;
        })

        // update resources
        usedResources = parseFloat((totalFilesSize / (1024 * 1024)).toFixed(2)); // convert from bytes to MB (mega byte);
        currentResources = resources.current;
        restResources = currentResources - usedResources;


        const resourcesUpdated = {
            current: currentResources,
            used: usedResources,
            rest: restResources
        }

        return { code: true, resourcesUpdated }
    },

    checkRemaining: (userValue, files) => {
        let restResources = 0;
        let totalFilesSize = 0;
        let totalFilesSizeInDatabase = 0;
        const { resources, fileupload } = userValue;

        if (fileupload) {
            fileupload.forEach((file) => {
                totalFilesSizeInDatabase += file.size;
            })
        }
        if (files) {
            files.forEach((file) => {
                totalFilesSize += file.size;
            })
        }

        totalFilesSize = parseFloat((totalFilesSize / (1024 * 1024)).toFixed(2)); // convert from bytes to MB (mega byte);
        totalFilesSizeInDatabase = parseFloat((totalFilesSizeInDatabase / (1024 * 1024)).toFixed(2)); // convert from bytes to MB (mega byte);
        restResources = resources.rest;

        if (totalFilesSize >= restResources || totalFilesSizeInDatabase >= restResources) {
            return { code: false } // limited
        } else {
            return { code: true }
        }
    }
}
module.exports = resources;