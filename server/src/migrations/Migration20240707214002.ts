import { Migration } from '@mikro-orm/migrations';

export class Migration20240707214002 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "post" ("id" serial primary key, "title" varchar(255) not null, "created_at" date not null default now(), "updated_at" date not null default now());');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "post" cascade;');
  }

}
