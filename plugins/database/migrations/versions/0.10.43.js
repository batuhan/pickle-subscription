module.exports = {


    async up (knex) {
        const permission = await knex("user_permissions").where("permission_name", "post_service_instances_id_change_properties");
        if(permission.length === 0){
            const permission_id = (await knex("user_permissions").returning("id").insert({"permission_name" : "post_service_instances_id_change_properties"}))[0];
            const rolesToPermission = [
                {role_id : 1, permission_id},
                {role_id : 2, permission_id},
                {role_id : 3, permission_id}
            ]
            const r2p = await knex("roles_to_permissions").insert(rolesToPermission);
        }else{
            console.log("permission already present!");
        }
        return await knex;
    },

    async down (knex) {
        return await knex;

    }
}