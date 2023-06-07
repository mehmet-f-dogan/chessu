drop policy "Enable read access for all users" on "public"."completions";

alter table "public"."completions" drop constraint "completions_pkey";

drop index if exists "public"."completions_pkey";

drop table "public"."completions";

create table "public"."completion" (
    "user_id" text not null default ''::text,
    "mapping_ids" bigint[] not null
);


alter table "public"."completion" enable row level security;

alter table "public"."course_purchase" drop column "amount";

CREATE UNIQUE INDEX completions_pkey ON public.completion USING btree (user_id);

alter table "public"."completion" add constraint "completions_pkey" PRIMARY KEY using index "completions_pkey";

create policy "Enable read access for all users"
on "public"."completion"
as permissive
for select
to public
using (true);



