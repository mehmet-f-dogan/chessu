alter table "public"."course" drop constraint "course_name_key";

alter table "public"."course_chapter_content_mapping" drop constraint "course_chapter_content_mapping_pkey";

drop index if exists "public"."course_chapter_content_mapping_pkey";

drop index if exists "public"."course_name_key";

alter table "public"."chapter" drop column "description";

alter table "public"."chapter" drop column "name";

alter table "public"."content" add column "type" text not null default ''::text;

alter table "public"."course" drop column "name";

alter table "public"."course" add column "subtitle" text not null default ''::text;

alter table "public"."course" add column "tags" text[] not null default '{}'::text[];

alter table "public"."course_chapter_content_mapping" drop column "id";

CREATE UNIQUE INDEX course_chapter_content_mapping_pkey ON public.course_chapter_content_mapping USING btree (course_id, chapter_id, content_id);

CREATE UNIQUE INDEX course_name_key ON public.course USING btree (title);

alter table "public"."course_chapter_content_mapping" add constraint "course_chapter_content_mapping_pkey" PRIMARY KEY using index "course_chapter_content_mapping_pkey";

alter table "public"."course" add constraint "course_name_key" UNIQUE using index "course_name_key";


