module.exports = {
  async up(knex) {
    await knex.schema.raw(`
    ALTER TABLE "service_instances"
    DROP CONSTRAINT "service_instances_status_check",
    ADD CONSTRAINT "service_instances_status_check" 
    CHECK (status IN ('running', 'requested', 'in_progress', 'waiting_cancellation', 'missing_payment', 'cancelled', 'completed', 'cancellation_pending'))`);

    return await knex;
  },

  async down(knex) {},
};
