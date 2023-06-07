create table "public"."completions" (
    "user_id" text not null default ''::text,
    "mapping_ids" bigint[] not null
);


alter table "public"."completions" enable row level security;

alter table "public"."course_chapter_content_mapping" add column "id" bigint generated by default as identity not null;

CREATE UNIQUE INDEX completions_pkey ON public.completions USING btree (user_id);

alter table "public"."completions" add constraint "completions_pkey" PRIMARY KEY using index "completions_pkey";

create policy "Enable read access for all users"
on "public"."completions"
as permissive
for select
to public
using (true);


