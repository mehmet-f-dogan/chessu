--Admin user id = user_2QX8na6kl0c3tIetJTl4RkGvFww

--Course 1 -> Not owned Course
insert into public.course ( title, subtitle, description ) values ( 'Test Course 1 Title', 'Test Course 1 Subtitle', 'Test Course 1 Description' );

--Course 2 -> Owned Course 
insert into public.course ( title, subtitle, description ) values ( 'Test Course 2 Title', 'Test Course 2 Subtitle', 'Test Course 2 Description' );
insert into public.course_purchase ( course_id, user_id, amount ) values ( 2, 'user_2QX8na6kl0c3tIetJTl4RkGvFww', 10 );

--Course 3 -> Completed Course
insert into public.course ( title, subtitle, description ) values ( 'Test Course 3 Title', 'Test Course 3 Subtitle', 'Test Course 3 Description' );
insert into public.course_purchase ( course_id, user_id, amount ) values ( 3, 'user_2QX8na6kl0c3tIetJTl4RkGvFww', 10 );
insert into public.chapter ( title ) values ( 'Test Course 3 Chapter 1 Title' );
insert into public.chapter ( title ) values ( 'Test Course 3 Chapter 2 Title' );
insert into public.chapter ( title ) values ( 'Test Course 3 Chapter 3 Title' );
insert into public.content ( title, type ) values ( 'Test Course 3 Chapter 1 Content 1 Title', 'video' );
insert into public.content ( title, type ) values ( 'Test Course 3 Chapter 2 Content 2 Title', 'video' );
insert into public.content ( title, type ) values ( 'Test Course 3 Chapter 3 Content 3 Title', 'video' );
insert into public.course_chapter_content_mapping ( course_id, chapter_id, content_id ) values ( 3, 1, 1 );
insert into public.course_chapter_content_mapping ( course_id, chapter_id, content_id ) values ( 3, 2, 2 );
insert into public.course_chapter_content_mapping ( course_id, chapter_id, content_id ) values ( 3, 3, 3 );
--insert into public.completions ( user_id, mapping_ids ) values ( 'user_2QX8na6kl0c3tIetJTl4RkGvFww', ARRAY[1,2,3]);

--Course 4 -> Not-completed Course
insert into public.course ( title, subtitle, description ) values ( 'Test Course 4 Title', 'Test Course 4 Subtitle', 'Test Course 4 Description' );
insert into public.course_purchase ( course_id, user_id, amount ) values ( 4, 'user_2QX8na6kl0c3tIetJTl4RkGvFww', 10 );
insert into public.chapter ( title ) values ( 'Test Course 4 Chapter 4 Title' );
insert into public.chapter ( title ) values ( 'Test Course 4 Chapter 5 Title' );
insert into public.chapter ( title ) values ( 'Test Course 4 Chapter 6 Title' );
insert into public.content ( title, type ) values ( 'Test Course 4 Chapter 4 Content 4 Title', 'video' );
insert into public.content ( title, type ) values ( 'Test Course 4 Chapter 5 Content 5 Title', 'video' );
insert into public.content ( title, type ) values ( 'Test Course 4 Chapter 6 Content 6 Title', 'video' );
insert into public.content ( title, type ) values ( 'Test Course 4 Chapter 6 Content 7 Title', 'video' );
insert into public.course_chapter_content_mapping ( course_id, chapter_id, content_id ) values ( 4, 4, 4 );
insert into public.course_chapter_content_mapping ( course_id, chapter_id, content_id ) values ( 4, 5, 5 );
insert into public.course_chapter_content_mapping ( course_id, chapter_id, content_id ) values ( 4, 6, 6 );
insert into public.course_chapter_content_mapping ( course_id, chapter_id, content_id ) values ( 4, 6, 7 );
--insert into public.completions ( user_id, mapping_ids ) values ( 'user_2QX8na6kl0c3tIetJTl4RkGvFww', ARRAY[1,2,3,4,6]);

--Course 5 -> Content types
insert into public.course ( title, subtitle, description ) values ( 'Test Course 5 Title', 'Test Course 5 Subtitle', 'Test Course 5 Description' );
insert into public.course_purchase ( course_id, user_id, amount ) values ( 5, 'user_2QX8na6kl0c3tIetJTl4RkGvFww', 10 );
insert into public.chapter ( title ) values ( 'Test Course 5 Chapter 7 Title' );
insert into public.chapter ( title ) values ( 'Test Course 5 Chapter 8 Title' );
insert into public.chapter ( title ) values ( 'Test Course 5 Chapter 9 Title' );
insert into public.content ( title, type, data ) values ( 'Test Course 5 Chapter 7 Content 8 Title', 'video', '{"videoUrl": "example.com/url"}' );
insert into public.content ( title, type ) values ( 'Test Course 5 Chapter 8 Content 9 Title', 'video' );
insert into public.content ( title, type ) values ( 'Test Course 5 Chapter 9 Content 10 Title', 'video' );
insert into public.course_chapter_content_mapping ( course_id, chapter_id, content_id ) values ( 5, 7, 8 );
insert into public.course_chapter_content_mapping ( course_id, chapter_id, content_id ) values ( 5, 8, 9 );
insert into public.course_chapter_content_mapping ( course_id, chapter_id, content_id ) values ( 5, 9, 10 );
insert into public.completions ( user_id, mapping_ids ) values ( 'user_2QX8na6kl0c3tIetJTl4RkGvFww', ARRAY[1,2,3,4,6,8,9,10]);