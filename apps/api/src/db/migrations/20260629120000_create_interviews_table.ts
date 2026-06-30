import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("interviews", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.uuid("user_id").nullable();
    table.text("title").notNullable();
    table.text("company_name").nullable();
    table.text("job_description").notNullable();
    table.jsonb("questions_json").notNullable();
    table.jsonb("final_report_json").nullable();
    table.integer("overall_score").nullable();
    table.text("status").notNullable().defaultTo("draft");
    table
      .timestamp("created_at", { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());
    table
      .timestamp("updated_at", { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("interviews");
}
