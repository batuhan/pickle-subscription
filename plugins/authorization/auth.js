const consume = require("pluginbot/effects/consume");

module.exports = {

    *run(config, provide, services){
        const database = yield consume(services.database);
        // todo: move Role and Permissions to be managed by this plugin
        const Role = require("../../models/role.js");
        const authService = {
            /**
             *
             * @param roles - array of role ids
             * @param permissionNames - array of permission names to check
             * @returns {Promise.<boolean>} if the roles passed contain all the permissions return true
             */
            async hasPermissions(roles, permissionNames){
                const roleInstances = await Role.find({
                    id : { "in" : roles}
                });

                const permissionSet = new Set();
                for(const roleInstance of roleInstances){
                    const rolePermissions = await roleInstance.getPermissions();
                    rolePermissions.forEach(perm => permissionNames.find(name => perm.data.permission_name === name) && permissionSet.add(perm.data.permission_name))

                }

                return (permissionSet.size === new Set(permissionNames).size);
            }
        }
        yield provide({authService});
    }

}