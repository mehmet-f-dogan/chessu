create table "public"."course_purchase" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone default now(),
    "course_id" bigint not null,
    "user_id" text not null,
    "amount" double precision not null
);


alter table "public"."course_purchase" enable row level security;

CREATE UNIQUE INDEX course_purchase_pkey ON public.course_purchase USING btree (id);

alter table "public"."course_purchase" add constraint "course_purchase_pkey" PRIMARY KEY using index "course_purchase_pkey";

alter table "public"."course_purchase" add constraint "course_purchase_course_id_fkey" FOREIGN KEY (course_id) REFERENCES course(id) not valid;

alter table "public"."course_purchase" validate constraint "course_purchase_course_id_fkey";

create policy "Users can view course purchases"
on "public"."course_purchase"
as permissive
for select
to public
using (true);



