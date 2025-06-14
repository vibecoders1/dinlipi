-- Sample data for user vibecoders1@gmail.com (user_id: 5e769d5a-6c15-448c-8146-5dda8bf27dfb)

-- Insert sample diary entries
INSERT INTO public.diary_entries (user_id, title, content, date) VALUES
('5e769d5a-6c15-448c-8146-5dda8bf27dfb', 'A relaxing Sunday. Woke up late, had a nice brunch and spent the afternoon reading a new book.', 'A relaxing Sunday. Woke up late, had a nice brunch and spent the afternoon reading a new book. The book was really engaging and I couldn''t put it down. It was about adventure and discovery, reminding me of the importance of taking time for myself and enjoying simple pleasures.', '2025-06-11'),
('5e769d5a-6c15-448c-8146-5dda8bf27dfb', 'Productive day at work! Finished a major project and got positive feedback. Feeling accomplished.', 'Productive day at work! Finished a major project and got positive feedback. Feeling accomplished. The team meeting went really well and everyone was excited about the results. It feels great when months of hard work finally pay off. Looking forward to the next challenge.', '2025-06-08'),
('5e769d5a-6c15-448c-8146-5dda8bf27dfb', 'Tried a new recipe for dinner today. It was a bit challenging but turned out delicious! Maybe I should cook more often.', 'Tried a new recipe for dinner today. It was a bit challenging but turned out delicious! Maybe I should cook more often. It was a Thai curry with coconut milk and fresh herbs. The kitchen was a mess afterward but the taste was totally worth it. Cooking is therapeutic and I should make time for it more regularly.', '2025-06-06');

-- Insert sample tags
INSERT INTO public.tags (user_id, name) VALUES
('5e769d5a-6c15-448c-8146-5dda8bf27dfb', 'Book'),
('5e769d5a-6c15-448c-8146-5dda8bf27dfb', 'Life'),
('5e769d5a-6c15-448c-8146-5dda8bf27dfb', 'Work'),
('5e769d5a-6c15-448c-8146-5dda8bf27dfb', 'Cooking'),
('5e769d5a-6c15-448c-8146-5dda8bf27dfb', 'Weekend'),
('5e769d5a-6c15-448c-8146-5dda8bf27dfb', 'Food');

-- Link tags to diary entries
INSERT INTO public.diary_entry_tags (diary_entry_id, tag_id)
SELECT 
  (SELECT id FROM public.diary_entries WHERE title LIKE 'A relaxing Sunday%' AND user_id = '5e769d5a-6c15-448c-8146-5dda8bf27dfb'),
  (SELECT id FROM public.tags WHERE name = 'Book' AND user_id = '5e769d5a-6c15-448c-8146-5dda8bf27dfb')
UNION ALL
SELECT 
  (SELECT id FROM public.diary_entries WHERE title LIKE 'A relaxing Sunday%' AND user_id = '5e769d5a-6c15-448c-8146-5dda8bf27dfb'),
  (SELECT id FROM public.tags WHERE name = 'Life' AND user_id = '5e769d5a-6c15-448c-8146-5dda8bf27dfb')
UNION ALL
SELECT 
  (SELECT id FROM public.diary_entries WHERE title LIKE 'A relaxing Sunday%' AND user_id = '5e769d5a-6c15-448c-8146-5dda8bf27dfb'),
  (SELECT id FROM public.tags WHERE name = 'Weekend' AND user_id = '5e769d5a-6c15-448c-8146-5dda8bf27dfb')
UNION ALL
SELECT 
  (SELECT id FROM public.diary_entries WHERE title LIKE 'Productive day at work%' AND user_id = '5e769d5a-6c15-448c-8146-5dda8bf27dfb'),
  (SELECT id FROM public.tags WHERE name = 'Work' AND user_id = '5e769d5a-6c15-448c-8146-5dda8bf27dfb')
UNION ALL
SELECT 
  (SELECT id FROM public.diary_entries WHERE title LIKE 'Tried a new recipe%' AND user_id = '5e769d5a-6c15-448c-8146-5dda8bf27dfb'),
  (SELECT id FROM public.tags WHERE name = 'Cooking' AND user_id = '5e769d5a-6c15-448c-8146-5dda8bf27dfb')
UNION ALL
SELECT 
  (SELECT id FROM public.diary_entries WHERE title LIKE 'Tried a new recipe%' AND user_id = '5e769d5a-6c15-448c-8146-5dda8bf27dfb'),
  (SELECT id FROM public.tags WHERE name = 'Food' AND user_id = '5e769d5a-6c15-448c-8146-5dda8bf27dfb');