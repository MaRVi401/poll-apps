
  create table "public"."options" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "poll_id" uuid,
    "option_text" text not null,
    "votes_count" integer default 0
      );



  create table "public"."polls" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "question" text not null,
    "admin_credential" text not null,
    "created_by" text,
    "created_at" timestamp with time zone default now()
      );



  create table "public"."votes" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "poll_id" uuid,
    "option_id" uuid,
    "voter_name" text not null,
    "created_at" timestamp with time zone default now()
      );


CREATE INDEX idx_options_poll_id ON public.options USING btree (poll_id);

CREATE INDEX idx_votes_poll_id ON public.votes USING btree (poll_id);

CREATE UNIQUE INDEX options_pkey ON public.options USING btree (id);

CREATE UNIQUE INDEX polls_pkey ON public.polls USING btree (id);

CREATE UNIQUE INDEX votes_pkey ON public.votes USING btree (id);

alter table "public"."options" add constraint "options_pkey" PRIMARY KEY using index "options_pkey";

alter table "public"."polls" add constraint "polls_pkey" PRIMARY KEY using index "polls_pkey";

alter table "public"."votes" add constraint "votes_pkey" PRIMARY KEY using index "votes_pkey";

alter table "public"."options" add constraint "options_poll_id_fkey" FOREIGN KEY (poll_id) REFERENCES public.polls(id) ON DELETE CASCADE not valid;

alter table "public"."options" validate constraint "options_poll_id_fkey";

alter table "public"."votes" add constraint "votes_option_id_fkey" FOREIGN KEY (option_id) REFERENCES public.options(id) ON DELETE CASCADE not valid;

alter table "public"."votes" validate constraint "votes_option_id_fkey";

alter table "public"."votes" add constraint "votes_poll_id_fkey" FOREIGN KEY (poll_id) REFERENCES public.polls(id) ON DELETE CASCADE not valid;

alter table "public"."votes" validate constraint "votes_poll_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.decrement_vote()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  UPDATE options SET votes_count = votes_count - 1 WHERE id = OLD.option_id;
  RETURN OLD;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.increment_vote()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  UPDATE options SET votes_count = votes_count + 1 WHERE id = NEW.option_id;
  RETURN NEW;
END;
$function$
;

grant delete on table "public"."options" to "anon";

grant insert on table "public"."options" to "anon";

grant references on table "public"."options" to "anon";

grant select on table "public"."options" to "anon";

grant trigger on table "public"."options" to "anon";

grant truncate on table "public"."options" to "anon";

grant update on table "public"."options" to "anon";

grant delete on table "public"."options" to "authenticated";

grant insert on table "public"."options" to "authenticated";

grant references on table "public"."options" to "authenticated";

grant select on table "public"."options" to "authenticated";

grant trigger on table "public"."options" to "authenticated";

grant truncate on table "public"."options" to "authenticated";

grant update on table "public"."options" to "authenticated";

grant delete on table "public"."options" to "service_role";

grant insert on table "public"."options" to "service_role";

grant references on table "public"."options" to "service_role";

grant select on table "public"."options" to "service_role";

grant trigger on table "public"."options" to "service_role";

grant truncate on table "public"."options" to "service_role";

grant update on table "public"."options" to "service_role";

grant delete on table "public"."polls" to "anon";

grant insert on table "public"."polls" to "anon";

grant references on table "public"."polls" to "anon";

grant select on table "public"."polls" to "anon";

grant trigger on table "public"."polls" to "anon";

grant truncate on table "public"."polls" to "anon";

grant update on table "public"."polls" to "anon";

grant delete on table "public"."polls" to "authenticated";

grant insert on table "public"."polls" to "authenticated";

grant references on table "public"."polls" to "authenticated";

grant select on table "public"."polls" to "authenticated";

grant trigger on table "public"."polls" to "authenticated";

grant truncate on table "public"."polls" to "authenticated";

grant update on table "public"."polls" to "authenticated";

grant delete on table "public"."polls" to "service_role";

grant insert on table "public"."polls" to "service_role";

grant references on table "public"."polls" to "service_role";

grant select on table "public"."polls" to "service_role";

grant trigger on table "public"."polls" to "service_role";

grant truncate on table "public"."polls" to "service_role";

grant update on table "public"."polls" to "service_role";

grant delete on table "public"."votes" to "anon";

grant insert on table "public"."votes" to "anon";

grant references on table "public"."votes" to "anon";

grant select on table "public"."votes" to "anon";

grant trigger on table "public"."votes" to "anon";

grant truncate on table "public"."votes" to "anon";

grant update on table "public"."votes" to "anon";

grant delete on table "public"."votes" to "authenticated";

grant insert on table "public"."votes" to "authenticated";

grant references on table "public"."votes" to "authenticated";

grant select on table "public"."votes" to "authenticated";

grant trigger on table "public"."votes" to "authenticated";

grant truncate on table "public"."votes" to "authenticated";

grant update on table "public"."votes" to "authenticated";

grant delete on table "public"."votes" to "service_role";

grant insert on table "public"."votes" to "service_role";

grant references on table "public"."votes" to "service_role";

grant select on table "public"."votes" to "service_role";

grant trigger on table "public"."votes" to "service_role";

grant truncate on table "public"."votes" to "service_role";

grant update on table "public"."votes" to "service_role";

CREATE TRIGGER tr_decrement_vote AFTER DELETE ON public.votes FOR EACH ROW EXECUTE FUNCTION public.decrement_vote();

CREATE TRIGGER tr_increment_vote AFTER INSERT ON public.votes FOR EACH ROW EXECUTE FUNCTION public.increment_vote();


