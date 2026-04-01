--
-- PostgreSQL database dump
--

\restrict lYDkZxQj7r52Fk2IWatO7h51snclX7hBmHRXFdoZSfRZUWmsbSPyqEVm8udu7aX

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: exercises; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.exercises (
    id integer NOT NULL,
    lesson_id integer,
    type character varying(50) NOT NULL,
    question text NOT NULL,
    question_sub text,
    correct_answer character varying(255) NOT NULL,
    options jsonb,
    order_num integer
);


--
-- Name: exercises_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.exercises_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: exercises_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.exercises_id_seq OWNED BY public.exercises.id;


--
-- Name: lessons; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lessons (
    id integer NOT NULL,
    title character varying(100) NOT NULL,
    description text,
    category character varying(50),
    level character varying(10) DEFAULT 'A1'::character varying,
    icon character varying(10),
    order_num integer,
    total_exercises integer DEFAULT 0
);


--
-- Name: lessons_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.lessons_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: lessons_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.lessons_id_seq OWNED BY public.lessons.id;


--
-- Name: user_lesson_progress; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_lesson_progress (
    id integer NOT NULL,
    user_id integer,
    lesson_id integer,
    completed boolean DEFAULT false,
    score integer DEFAULT 0,
    attempts integer DEFAULT 0,
    completed_at timestamp without time zone
);


--
-- Name: user_lesson_progress_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_lesson_progress_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_lesson_progress_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_lesson_progress_id_seq OWNED BY public.user_lesson_progress.id;


--
-- Name: user_words; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_words (
    id integer NOT NULL,
    user_id integer,
    word_id integer,
    learned_at timestamp without time zone DEFAULT now(),
    times_reviewed integer DEFAULT 1
);


--
-- Name: user_words_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_words_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_words_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_words_id_seq OWNED BY public.user_words.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    password_hash character varying(255) NOT NULL,
    level character varying(10) DEFAULT 'A1'::character varying,
    xp integer DEFAULT 0,
    streak integer DEFAULT 0,
    last_activity date,
    avatar character varying(255) DEFAULT '🦜'::character varying,
    created_at timestamp without time zone DEFAULT now(),
    role character varying(20) DEFAULT 'student'::character varying
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: words; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.words (
    id integer NOT NULL,
    english character varying(100) NOT NULL,
    kazakh character varying(100),
    russian character varying(100),
    level character varying(10) DEFAULT 'A1'::character varying,
    icon character varying(10),
    category character varying(50)
);


--
-- Name: words_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.words_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: words_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.words_id_seq OWNED BY public.words.id;


--
-- Name: exercises id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exercises ALTER COLUMN id SET DEFAULT nextval('public.exercises_id_seq'::regclass);


--
-- Name: lessons id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lessons ALTER COLUMN id SET DEFAULT nextval('public.lessons_id_seq'::regclass);


--
-- Name: user_lesson_progress id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_lesson_progress ALTER COLUMN id SET DEFAULT nextval('public.user_lesson_progress_id_seq'::regclass);


--
-- Name: user_words id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_words ALTER COLUMN id SET DEFAULT nextval('public.user_words_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: words id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.words ALTER COLUMN id SET DEFAULT nextval('public.words_id_seq'::regclass);


--
-- Data for Name: exercises; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.exercises (id, lesson_id, type, question, question_sub, correct_answer, options, order_num) FROM stdin;
1	1	translate	Сәлем	Kazakh → English	Hello	["Hello", "Goodbye", "Thank you", "Please"]	1
2	1	translate	Сау болыңыз	Kazakh → English	Goodbye	["Hello", "Goodbye", "Sorry", "Thanks"]	2
3	1	translate	Рахмет	Kazakh → English	Thank you	["Sorry", "Please", "Thank you", "Yes"]	3
4	1	translate	Кешіріңіз	Kazakh → English	Excuse me	["Excuse me", "Help me", "Follow me", "See me"]	4
5	1	multiple_choice	How do you say "Yes" in English?	Choose correct	Yes	["Yes", "No", "Maybe", "Always"]	5
6	2	multiple_choice	What number is this? 7	Choose correct	Seven	["Five", "Six", "Seven", "Eight"]	1
7	2	translate	Он	Kazakh → English	Ten	["Nine", "Ten", "Eleven", "Twelve"]	2
8	2	multiple_choice	What number is this? 3	Choose correct	Three	["One", "Two", "Three", "Four"]	3
9	2	translate	Жиырма	Kazakh → English	Twenty	["Fifteen", "Twenty", "Thirty", "Forty"]	4
10	2	multiple_choice	5 + 5 = ?	Math in English	Ten	["Eight", "Nine", "Ten", "Eleven"]	5
11	3	translate	Қызыл	Kazakh → English	Red	["Red", "Blue", "Green", "Yellow"]	1
12	3	translate	Көк	Kazakh → English	Blue	["Red", "Blue", "Green", "Black"]	2
13	3	multiple_choice	The sky is ___	Fill in the blank	Blue	["Red", "Green", "Blue", "Pink"]	3
14	3	translate	Жасыл	Kazakh → English	Green	["White", "Green", "Orange", "Purple"]	4
15	3	translate	Сары	Kazakh → English	Yellow	["Yellow", "White", "Grey", "Brown"]	5
16	4	translate	Алма	Kazakh → English	Apple	["Apple", "Bread", "Water", "Milk"]	1
17	4	translate	Нан	Kazakh → English	Bread	["Rice", "Bread", "Soup", "Meat"]	2
18	4	multiple_choice	What do you drink in the morning?	Choose one	Coffee	["Coffee", "Pizza", "Burger", "Salad"]	3
19	4	translate	Су	Kazakh → English	Water	["Juice", "Tea", "Water", "Milk"]	4
20	4	translate	Ет	Kazakh → English	Meat	["Fish", "Meat", "Egg", "Cheese"]	5
21	5	multiple_choice	What day comes after Monday?	Days of the week	Tuesday	["Tuesday", "Wednesday", "Sunday", "Friday"]	1
22	5	translate	Дүйсенбі	Kazakh → English	Monday	["Monday", "Tuesday", "Wednesday", "Thursday"]	2
23	5	multiple_choice	How many days are in a week?	Count!	Seven	["Five", "Six", "Seven", "Eight"]	3
24	5	translate	Жексенбі	Kazakh → English	Sunday	["Saturday", "Sunday", "Monday", "Friday"]	4
25	5	multiple_choice	What is the first month of the year?	Months	January	["January", "February", "March", "April"]	5
26	6	translate	Дүкен	Kazakh → English	Shop	["Shop", "Bank", "Park", "Hotel"]	1
27	6	translate	Аурухана	Kazakh → English	Hospital	["School", "Hospital", "Museum", "Library"]	2
28	6	multiple_choice	Where do you catch a plane?	Choose	Airport	["Station", "Airport", "Port", "Terminal"]	3
29	6	translate	Кітапхана	Kazakh → English	Library	["Library", "Stadium", "Cinema", "Market"]	4
30	6	multiple_choice	What do you use to pay?	Choose	Money	["Key", "Money", "Ticket", "Map"]	5
196	32	multiple_choice	What do we call the layer of gases surrounding Earth?	Choose correct	Atmosphere	["Atmosphere", "Hydrosphere", "Lithosphere", "Biosphere"]	1
197	32	translate	Табиғат	Kazakh → English	Nature	["Nature", "Culture", "Science", "Weather"]	2
198	32	multiple_choice	Which of these is a renewable energy source?	Choose correct	Solar energy	["Coal", "Solar energy", "Oil", "Gas"]	3
199	32	translate	Қоршаған орта	Kazakh → English	Environment	["Environment", "Government", "Development", "Achievement"]	4
200	32	multiple_choice	What does "pollution" mean?	Choose correct	Contamination of nature	["Contamination of nature", "Protection of nature", "Study of nature", "Love of nature"]	5
201	33	multiple_choice	What does "AI" stand for?	Choose correct	Artificial Intelligence	["Artificial Intelligence", "Automatic Internet", "Advanced Industry", "Active Information"]	1
202	33	translate	Болашақ	Kazakh → English	Future	["Future", "Present", "Past", "History"]	2
203	33	multiple_choice	Which device do you use to make calls?	Choose correct	Smartphone	["Smartphone", "Telescope", "Microscope", "Calculator"]	3
204	33	translate	Ғылым	Kazakh → English	Science	["Science", "Music", "Art", "Sport"]	4
205	33	multiple_choice	What is the Internet?	Choose correct	A global network of computers	["A global network of computers", "A type of television", "A radio station", "A newspaper"]	5
206	34	multiple_choice	Guide: "The Silk Road was an ancient ___ route connecting East and West."	Fill in the blank	trade	["trade", "water", "air", "space"]	1
207	34	multiple_choice	Tourist: "Did the road pass ___ Kazakhstan?"	Choose correct preposition	through	["through", "above", "under", "beside"]	2
208	34	multiple_choice	Guide: "Yes! Cities like Turkestan were important ___ on the route."	Fill in the blank	stops	["stops", "mountains", "rivers", "deserts"]	3
209	34	multiple_choice	Tourist: "What did merchants ___ along the Silk Road?"	Fill in the blank	trade	["trade", "sleep", "study", "build"]	4
210	34	multiple_choice	Guide: "They traded silk, spices and ___. Kazakhstan was the heart of this exchange."	Fill in the blank	gold	["gold", "ice", "sand", "wood"]	5
194	31	multiple_choice	Zara: "Will you visit the Baiterek ___?" (Famous monument in Astana)	Fill in the blank	tower	["tower", "market", "school", "hospital"]	4
181	29	multiple_choice	Amir: "Assalawmagaleykum! How much are these ___?" (He points at apples)	Fill in the blank	apples	["apples", "books", "cars", "houses"]	1
182	29	multiple_choice	Seller: "They are ___ tenge for five pieces."	Choose the number word	five	["two", "five", "ten", "twenty"]	2
183	29	multiple_choice	Amir: "I will take ___. Thank you!" (He buys 10)	Fill in the blank	ten	["three", "seven", "ten", "one"]	3
184	29	multiple_choice	Seller: "You are ___! Come again!"	Choose correct word	welcome	["welcome", "sorry", "wrong", "late"]	4
185	29	multiple_choice	Amir: "___ bolynyz!" (Kazakh farewell)	Fill in the blank	Sau	["Sau", "Hello", "Yes", "No"]	5
186	30	multiple_choice	Dana: "Happy Nauryz! The decorations are ___!" (Warm sunny color)	Fill in the blank	yellow	["yellow", "black", "white", "grey"]	1
187	30	multiple_choice	Marat: "The traditional cloth is ___." (Kazakh national color)	Choose correct color	blue	["blue", "pink", "brown", "purple"]	2
188	30	multiple_choice	Dana: "I cooked beshbarmaq and ___." (Another Kazakh dish)	Fill in the blank	samsa	["samsa", "pizza", "sushi", "pasta"]	3
189	30	multiple_choice	Marat: "What time does the celebration ___?"	Fill in the blank	start	["start", "stop", "sleep", "swim"]	4
190	30	multiple_choice	Dana: "It starts ___ the morning, at nine o clock."	Choose correct preposition	in	["in", "on", "at", "by"]	5
191	31	multiple_choice	Ali: "I am going ___ Astana next Monday."	Choose correct preposition	to	["to", "in", "at", "on"]	1
192	31	multiple_choice	Zara: "How will you travel? By plane or by ___?"	Fill in the blank	train	["train", "ship", "camel", "bicycle"]	2
193	31	multiple_choice	Ali: "By plane! The flight is ___ two hours."	Choose correct preposition	for	["for", "in", "at", "since"]	3
195	31	multiple_choice	Ali: "Yes! And the new ___ of Kazakhstan is beautiful!"	Fill in the blank	capital	["capital", "village", "island", "desert"]	5
\.


--
-- Data for Name: lessons; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.lessons (id, title, description, category, level, icon, order_num, total_exercises) FROM stdin;
1	Greetings	Learn basic greetings and farewells	basics	A1	👋	1	5
2	Numbers	Count from 1 to 100	basics	A1	🔢	2	5
3	Colors	Learn colors in English	basics	A1	🎨	4	5
4	Food & Drinks	Vocabulary for food and beverages	daily	A1	🍎	5	5
5	Time & Days	Days of the week and telling time	daily	A2	⏰	7	5
6	City & Travel	Navigate a city and travel	travel	A2	🏙️	8	5
29	📖 Story: At the Market	Dialogue at a Kazakh market using greetings and numbers	story	A1	🏪	3	5
30	📖 Story: Nauryz Party	Nauryz celebration using colors and food words	story	A1	🌸	6	5
31	📖 Story: Trip to Astana	Travel dialogue using time, days and city vocabulary	story	A2	✈️	9	5
32	Environment	Nature and environment vocabulary	basics	B1	🌿	10	5
33	Technology & Future	Tech and future vocabulary	basics	B1	💻	11	5
34	📖 Story: The Silk Road	A historical dialogue about the Great Silk Road through Kazakhstan	story	B1	🐪	12	5
\.


--
-- Data for Name: user_lesson_progress; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_lesson_progress (id, user_id, lesson_id, completed, score, attempts, completed_at) FROM stdin;
1	1	1	t	100	1	2026-03-16 20:43:43.568573
2	1	2	t	80	2	2026-03-17 20:43:43.568573
3	1	3	f	0	0	\N
6	3	1	f	0	0	\N
7	5	1	t	100	4	2026-03-23 00:24:06.087393
11	5	2	t	100	1	2026-03-23 00:24:20.234275
30	8	3	t	80	1	2026-03-29 23:05:19.185859
31	8	4	t	100	1	2026-03-29 23:05:38.557604
32	8	5	t	80	1	2026-03-29 23:06:13.890786
33	8	6	t	80	1	2026-03-29 23:06:30.745984
34	8	29	t	80	1	2026-03-29 23:26:02.193812
36	8	31	t	80	1	2026-03-29 23:29:16.001549
35	8	30	t	60	3	2026-03-29 23:27:03.668431
25	8	1	t	100	4	2026-03-29 22:57:20.501771
26	8	2	t	100	3	2026-03-29 22:57:36.727132
41	5	29	t	80	1	2026-03-30 10:51:40.934479
42	5	3	t	100	1	2026-03-30 10:51:59.190967
43	5	4	t	100	1	2026-03-30 10:52:11.246196
44	5	30	t	80	1	2026-03-30 10:52:30.295671
45	5	5	t	80	1	2026-03-30 10:52:47.814765
46	10	1	t	100	1	2026-03-31 23:22:53.034444
47	10	2	f	20	1	2026-03-31 23:42:55.129365
\.


--
-- Data for Name: user_words; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_words (id, user_id, word_id, learned_at, times_reviewed) FROM stdin;
1	1	1	2026-03-22 20:43:43.568573	5
2	1	2	2026-03-22 20:43:43.568573	4
3	1	3	2026-03-22 20:43:43.568573	6
4	1	4	2026-03-22 20:43:43.568573	3
5	1	5	2026-03-22 20:43:43.568573	2
6	1	6	2026-03-22 20:43:43.568573	2
7	1	7	2026-03-22 20:43:43.568573	4
8	1	8	2026-03-22 20:43:43.568573	3
12	3	1	2026-03-22 20:43:43.568573	1
13	5	4	2026-03-23 00:23:18.629365	1
14	5	7	2026-03-23 00:23:19.949876	1
15	5	6	2026-03-23 00:23:22.228279	1
16	5	2	2026-03-23 00:23:23.702391	1
31	8	4	2026-03-29 23:50:58.820722	1
32	8	7	2026-03-29 23:51:00.924094	1
33	8	6	2026-03-29 23:51:02.227763	1
34	8	2	2026-03-29 23:51:14.104261	1
35	8	1	2026-03-29 23:58:59.765621	1
36	8	11	2026-03-29 23:59:01.116171	1
37	10	4	2026-04-01 00:03:11.320797	1
38	10	7	2026-04-01 00:03:43.53201	1
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, name, email, password_hash, level, xp, streak, last_activity, avatar, created_at, role) FROM stdin;
3	Дамир Ахметов	damir@linguaflow.kz	$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uVk1/YxJC	A1	120	1	2026-03-19	🦅	2026-03-22 20:43:43.568573	student
8	Lola	lola@mail.ru	$2b$10$60g8IVz4dKssW4MsmAu5XuzS9gVL4aidJBtkqIUP24JFaNqnyeC/W	A2	550	2	2026-03-30	/uploads/avatar_8_1774848206931.jpg	2026-03-29 20:37:20.906898	student
5	Lanana	Lana@mail.ru	$2b$10$0YjIifywmXkIn/x0oCtvTupZrtMiNLrHqlXGVXuJlIqJl1TWlIUwu	A2	340	2	2026-03-31	/uploads/avatar_5_1774850603559.png	2026-03-22 21:12:42.305178	student
10	Aman	adam@mail.ru	$2b$10$OfQvjaHRDVvkEX5c9wz0Y.e8GIpuWVfG6lNbet1O.ugkm3mygadpq	A1	60	0	\N	/uploads/avatar_10_1774983177638.jpg	2026-03-31 11:11:10.603552	student
1	Admin	admin@linguaflow.kz	$2b$10$CPI7CdmhLgOECOX/4IOxtO3L0lv3mML/6pHH/SOxtZmRkpNiuBF7a	B1	1240	1	2026-04-01	🦜	2026-03-22 20:43:43.568573	admin
\.


--
-- Data for Name: words; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.words (id, english, kazakh, russian, level, icon, category) FROM stdin;
1	Hello	Салем	Привет	A1	👋	greetings
2	Goodbye	Сау болынызы	До свидания	A1	👋	greetings
3	Thank you	Рахмет	Спасибо	A1	🙏	greetings
4	Apple	Алма	Яблоко	A1	🍎	food
5	Water	Су	Вода	A1	💧	food
6	Bread	Нан	Хлеб	A1	🍞	food
7	Book	Кітап	Книга	A1	📚	objects
8	House	Уй	Дом	A1	🏠	objects
9	Car	Машина	Машина	A2	🚗	transport
10	Airplane	Ұшак	Самолет	A2	✈️	transport
11	Hospital	Аурухана	Больница	A2	🏥	city
12	Library	Кітапхана	Библиотека	A2	📖	city
13	World	Алем	Мир	B1	🌍	abstract
14	Freedom	Бостандык	Свобода	B1	🕊️	abstract
\.


--
-- Name: exercises_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.exercises_id_seq', 210, true);


--
-- Name: lessons_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.lessons_id_seq', 34, true);


--
-- Name: user_lesson_progress_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.user_lesson_progress_id_seq', 47, true);


--
-- Name: user_words_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.user_words_id_seq', 38, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 10, true);


--
-- Name: words_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.words_id_seq', 14, true);


--
-- Name: exercises exercises_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exercises
    ADD CONSTRAINT exercises_pkey PRIMARY KEY (id);


--
-- Name: lessons lessons_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_pkey PRIMARY KEY (id);


--
-- Name: user_lesson_progress user_lesson_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_lesson_progress
    ADD CONSTRAINT user_lesson_progress_pkey PRIMARY KEY (id);


--
-- Name: user_lesson_progress user_lesson_progress_user_id_lesson_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_lesson_progress
    ADD CONSTRAINT user_lesson_progress_user_id_lesson_id_key UNIQUE (user_id, lesson_id);


--
-- Name: user_words user_words_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_words
    ADD CONSTRAINT user_words_pkey PRIMARY KEY (id);


--
-- Name: user_words user_words_user_id_word_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_words
    ADD CONSTRAINT user_words_user_id_word_id_key UNIQUE (user_id, word_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: words words_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.words
    ADD CONSTRAINT words_pkey PRIMARY KEY (id);


--
-- Name: exercises exercises_lesson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exercises
    ADD CONSTRAINT exercises_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE;


--
-- Name: user_lesson_progress user_lesson_progress_lesson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_lesson_progress
    ADD CONSTRAINT user_lesson_progress_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE;


--
-- Name: user_lesson_progress user_lesson_progress_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_lesson_progress
    ADD CONSTRAINT user_lesson_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_words user_words_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_words
    ADD CONSTRAINT user_words_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_words user_words_word_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_words
    ADD CONSTRAINT user_words_word_id_fkey FOREIGN KEY (word_id) REFERENCES public.words(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict lYDkZxQj7r52Fk2IWatO7h51snclX7hBmHRXFdoZSfRZUWmsbSPyqEVm8udu7aX

