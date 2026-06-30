import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("answers", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table
      .uuid("interview_id")
      .notNullable()
      .references("id")
      .inTable("interviews")
      .onDelete("CASCADE");
    table.integer("question_index").notNullable();
    table.text("question_text").notNullable();
    table.text("question_type").notNullable();
    table.text("answer_text").notNullable();
    table.integer("score").nullable();
    table.jsonb("feedback_json").nullable();
    table
      .timestamp("created_at", { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());
    table
      .timestamp("updated_at", { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());

    table.unique(["interview_id", "question_index"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("answers");
}
