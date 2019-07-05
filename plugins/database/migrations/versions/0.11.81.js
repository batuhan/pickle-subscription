module.exports = {


    async up (knex) {
    
        await knex.schema.alterTable("users", table => {
                table.string('google_refresh_token');
        });


        return await knex;
    },

    async down (knex) {
        await knex.schema.alterTable("users", table => {
            table.dropColumns("google_refresh_token");
        });

        return await knex;

    }
}