--
-- PostgreSQL database dump
--

-- Dumped from database version 16.8
-- Dumped by pg_dump version 16.9

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
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
-- Name: addresses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.addresses (
    id integer NOT NULL,
    user_id integer NOT NULL,
    type character varying(255) NOT NULL,
    line_1 character varying(255) NOT NULL,
    line_2 character varying(255),
    city character varying(255) NOT NULL,
    zip_code character varying(20) NOT NULL,
    country character varying(56) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: addresses_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.addresses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: addresses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.addresses_id_seq OWNED BY public.addresses.id;


--
-- Name: alembic_version; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.alembic_version (
    version_num character varying(32) NOT NULL
);


--
-- Name: cart_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cart_items (
    id integer NOT NULL,
    cart_id integer NOT NULL,
    product_id integer NOT NULL,
    variant_id integer,
    quantity integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: cart_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cart_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cart_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cart_items_id_seq OWNED BY public.cart_items.id;


--
-- Name: carts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.carts (
    id integer NOT NULL,
    user_id integer,
    session_id character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: carts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.carts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: carts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.carts_id_seq OWNED BY public.carts.id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    parent_category_id integer,
    name character varying(255) NOT NULL,
    description text,
    slug character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: category_images; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.category_images (
    id integer NOT NULL,
    category_id integer NOT NULL,
    url character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: category_images_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.category_images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: category_images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.category_images_id_seq OWNED BY public.category_images.id;


--
-- Name: order_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_items (
    id integer NOT NULL,
    order_id integer NOT NULL,
    product_id integer NOT NULL,
    variant_id integer,
    quantity integer NOT NULL,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.order_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.order_items_id_seq OWNED BY public.order_items.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    user_id integer,
    shipping_address_id integer NOT NULL,
    billing_address_id integer,
    payment_id integer,
    session_id character varying(255),
    email character varying(255),
    first_name character varying(255),
    last_name character varying(255),
    country_code character varying(5),
    phone_number character varying(20),
    status character varying(20) NOT NULL,
    shipping_method character varying(20) NOT NULL,
    total numeric(10,2) NOT NULL,
    subtotal numeric(10,2) NOT NULL,
    tax numeric(10,2) NOT NULL,
    shipping_cost numeric(10,2) NOT NULL,
    discount numeric(10,2),
    tracking_number character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: payments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payments (
    id integer NOT NULL,
    user_id integer,
    amount numeric(10,2) NOT NULL,
    currency character varying(3) NOT NULL,
    status character varying(255) NOT NULL,
    payment_method character varying(255) NOT NULL,
    payment_date timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    reference_id character varying(255),
    xendit_id character varying(255)
);


--
-- Name: payments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payments_id_seq OWNED BY public.payments.id;


--
-- Name: product_images; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_images (
    id integer NOT NULL,
    product_id integer NOT NULL,
    variant_id integer,
    url character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: product_images_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.product_images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: product_images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.product_images_id_seq OWNED BY public.product_images.id;


--
-- Name: product_variants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_variants (
    id integer NOT NULL,
    product_id integer NOT NULL,
    name character varying(255) NOT NULL,
    base_price numeric(10,2) NOT NULL,
    sale_price numeric(10,2),
    stock integer NOT NULL,
    option1_value character varying(255),
    option2_value character varying(255),
    option3_value character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: product_variants_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.product_variants_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: product_variants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.product_variants_id_seq OWNED BY public.product_variants.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.products (
    id integer NOT NULL,
    category_id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    slug character varying(255) NOT NULL,
    is_active boolean NOT NULL,
    is_featured boolean NOT NULL,
    meta_title character varying(255),
    meta_description text,
    weight numeric(10,2),
    width numeric(10,2),
    height numeric(10,2),
    option1_name character varying(255),
    option2_name character varying(255),
    option3_name character varying(255),
    base_price numeric(10,2),
    sale_price numeric(10,2),
    stock integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    length numeric(10,2),
    benefits text,
    ingredients text,
    instructions text
);


--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reviews (
    id integer NOT NULL,
    user_id integer NOT NULL,
    product_id integer NOT NULL,
    rating integer NOT NULL,
    title character varying(255),
    content text,
    is_verified boolean NOT NULL,
    is_approved boolean NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.reviews_id_seq OWNED BY public.reviews.id;


--
-- Name: subscriptions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.subscriptions (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    is_active boolean NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: subscriptions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.subscriptions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: subscriptions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.subscriptions_id_seq OWNED BY public.subscriptions.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    first_name character varying(255),
    last_name character varying(255),
    country_code character varying(5),
    phone_number character varying(20),
    is_admin boolean NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
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
-- Name: addresses id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.addresses ALTER COLUMN id SET DEFAULT nextval('public.addresses_id_seq'::regclass);


--
-- Name: cart_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items ALTER COLUMN id SET DEFAULT nextval('public.cart_items_id_seq'::regclass);


--
-- Name: carts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carts ALTER COLUMN id SET DEFAULT nextval('public.carts_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: category_images id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.category_images ALTER COLUMN id SET DEFAULT nextval('public.category_images_id_seq'::regclass);


--
-- Name: order_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items ALTER COLUMN id SET DEFAULT nextval('public.order_items_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: payments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments ALTER COLUMN id SET DEFAULT nextval('public.payments_id_seq'::regclass);


--
-- Name: product_images id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_images ALTER COLUMN id SET DEFAULT nextval('public.product_images_id_seq'::regclass);


--
-- Name: product_variants id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_variants ALTER COLUMN id SET DEFAULT nextval('public.product_variants_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: reviews id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews ALTER COLUMN id SET DEFAULT nextval('public.reviews_id_seq'::regclass);


--
-- Name: subscriptions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscriptions ALTER COLUMN id SET DEFAULT nextval('public.subscriptions_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: addresses; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.addresses (id, user_id, type, line_1, line_2, city, zip_code, country, created_at, updated_at) FROM stdin;
1	1	shipping	L3B2 Francisca Compound	Road 23 Project 8	Quezon City	1106	Philippines	2025-08-22 09:58:25.701597+00	2025-08-22 09:58:25.701597+00
\.


--
-- Data for Name: alembic_version; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.alembic_version (version_num) FROM stdin;
\.


--
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cart_items (id, cart_id, product_id, variant_id, quantity, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: carts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.carts (id, user_id, session_id, created_at, updated_at) FROM stdin;
1	\N	d1484d94-31f8-45ab-bd08-181eae49f3d9	2025-08-12 20:29:52.767089+00	2025-08-12 20:29:52.767089+00
2	\N	53f22c18-958c-4fb2-8340-241b54da2b2d	2025-08-17 14:44:44.302628+00	2025-08-17 14:44:44.302628+00
3	\N	0d830601-f05e-4268-9843-5cc6f275f8dd	2025-08-21 16:02:07.98054+00	2025-08-21 16:02:07.98054+00
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.categories (id, parent_category_id, name, description, slug, created_at, updated_at) FROM stdin;
1	\N	Coffee	Revitalize your day with our premium coffee blends, inspired by traditional wellness and refined with modern expertise for sustained energy and focus.	coffee	2025-08-21 20:20:27.273504+00	2025-08-21 20:20:27.273504+00
2	\N	Soap	Elevate your skincare with our luxurious soaps, blending nature’s timeless secrets with advanced science to cleanse, brighten, and nourish your skin.	soap	2025-08-21 21:00:45.713875+00	2025-08-21 21:01:01.408875+00
\.


--
-- Data for Name: category_images; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.category_images (id, category_id, url, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.order_items (id, order_id, product_id, variant_id, quantity, price, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.orders (id, user_id, shipping_address_id, billing_address_id, payment_id, session_id, email, first_name, last_name, country_code, phone_number, status, shipping_method, total, subtotal, tax, shipping_cost, discount, tracking_number, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payments (id, user_id, amount, currency, status, payment_method, payment_date, created_at, updated_at, reference_id, xendit_id) FROM stdin;
\.


--
-- Data for Name: product_images; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_images (id, product_id, variant_id, url, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: product_variants; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_variants (id, product_id, name, base_price, sale_price, stock, option1_value, option2_value, option3_value, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.products (id, category_id, name, description, slug, is_active, is_featured, meta_title, meta_description, weight, width, height, option1_name, option2_name, option3_name, base_price, sale_price, stock, created_at, updated_at, length, benefits, ingredients, instructions) FROM stdin;
4	1	Tongkat Ali & Ginseng Coffee	<p><strong>Boost your energy, enhance your stamina, and improve your vitality naturally.</strong></p><p>JM Premium Tongkat Ali &amp; Ginseng Coffee is a powerful fusion of traditional herbal wisdom and modern science, crafted to fuel your body and mind. Enjoy the rich, bold taste of premium coffee enhanced with <strong>Tongkat Ali (Longjack)</strong> and<strong> Ginseng</strong>, two of nature’s most trusted herbal tonics for energy, stamina, and wellness.</p><p>Whether you need a morning boost, extra stamina for workouts, or simply want to feel revitalized throughout the day, this coffee is your go-to wellness drink.</p><p><em>Each pouch contains 10 sachets.</em></p>	tongkat-ali-ginseng-coffee	t	t	JM Tongkat Ali & Ginseng Coffee Natural Energy and Vitality Booster 10 Sachets	Energize your day with JM Premium Tongkat Ali & Ginseng Coffee. Boost stamina, vitality, and overall wellness with every bold, rich cup. Only ₱300 for 10 sachets!	0.21	0.00	0.00	\N	\N	\N	300.00	0.00	10	2025-08-21 21:12:08.388323+00	2025-08-22 15:42:24.871691+00	0.00	<ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong>Boosts Energy &amp; Stamina</strong> – Stay active, productive, and energized throughout the day.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong>Enhances Vitality &amp; Libido</strong> – Supports healthy testosterone levels and sperm production for male reproductive health and promotes overall vitality.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong>Elevates Physical Performance &amp; Endurance</strong> – Power through workouts or daily activities with ease.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong>Supports Blood Sugar &amp; Weight Management</strong> – Promotes balanced metabolism naturally.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong>Rich in Antioxidants</strong> – Fights free radicals and supports long-term wellness.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong>Improves Mood &amp; Mental Clarity</strong> – Helps you stay focused, alert, and mentally balanced.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong>Rich, Bold Coffee Taste</strong> – Enjoy premium-quality coffee with natural herbal goodness in every sip.</li></ol>	<p>Tongkat Ali (Eurycoma Longifolia) Extract, Panax Ginseng Extract, Macaroot (Lepidium Meyenii) Extract, Moringa (Moringa Oleifera) Powder, Mangosteen (Garcinia Mangostana) Extract, Instant Coffee Powder, Creamer, Glucose Syrup, Refined Vegetable Oil, Milk Powder, Sodium Caseinate, Emulsifiers, Anti-Caking Agent, Stevia</p>	<ol><li data-list="ordered"><span class="ql-ui" contenteditable="false"></span>Empty 1 sachet into a cup.</li><li data-list="ordered"><span class="ql-ui" contenteditable="false"></span>Add 150ml hot water.</li><li data-list="ordered"><span class="ql-ui" contenteditable="false"></span>Stir well and enjoy your energizing coffee.</li></ol><p>Store in cool, dry place away from direct heat and moisture. Keep at room temperature for optimal freshness.</p>
2	1	Slim & White Coffee Mix	<p><strong>Glow. Slim. Sip. </strong></p><p>JM Premium Slim &amp; White Coffee Mix combines indulgence, beauty, and wellness in a luxurious 3-in-1 coffee experience. Crafted with<strong> natural Stevia </strong>and enriched with <strong>Glutathione, Collagen, Garcinia Cambogia, L-Carnitine, and Moringa</strong>, this premium coffee helps you look and feel your best every day.</p>	slim-white-coffee-mix	t	t	JM Slim & White Coffee Mix Beauty & Wellness 3-in-1 Coffee with Stevia	Glow, slim & sip with JM Premium Slim & White Coffee. Boost beauty, wellness & antioxidant intake in every sugar-free, 3-in-1 cup. ₱300 for 10 sachets!	0.21	0.00	0.00	\N	\N	\N	300.00	0.00	10	2025-08-21 21:09:22.781783+00	2025-08-22 15:43:38.144484+00	0.00	<ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong>Radiant, Even-Toned Skin</strong> – Glutathione and Collagen improve skin brightness and elasticity.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong>Slimmer Figure &amp; Weight Management</strong> – Garcinia Cambogia and L-Carnitine help support metabolism and fat burning.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong>Antioxidant-Rich Formula</strong> – Protects cells from free radicals for youthful skin.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong>Digestive &amp; Gut Support</strong> – Moringa and natural fibers promote healthy digestion.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong>Bone &amp; Joint Health</strong> – Provides nutrients to strengthen bones and support mobility.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong>Sugar-Free Indulgence</strong> – Naturally sweetened with Stevia for guilt-free enjoyment.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong>Rich, Creamy Taste</strong> – Premium 3-in-1 coffee blend for daily enjoyment.</li></ol>	<p>Garcinia Cambogia, Glutathione, Collagen Alkaline, L-Carnitine, Grapeseed, Spirulina, Moringa, Green Coffee Beans, Insulin, Creamer, Stevia</p>	<ol><li data-list="ordered"><span class="ql-ui" contenteditable="false"></span>Empty 1 sachet into a cup.</li><li data-list="ordered"><span class="ql-ui" contenteditable="false"></span>Add 150ml hot water.</li><li data-list="ordered"><span class="ql-ui" contenteditable="false"></span>Stir well and enjoy your rejuvenating coffee.</li></ol><p>Store in cool, dry place away from direct heat and moisture. Keep at room temperature for optimal freshness.</p>
1	2	Vitamin C Soap	<p>Elevate your skincare routine with the JM Premium Vitamin C Soap, a luxurious brightening bar formulated to <strong>nourish, hydrate, and even skin tone</strong>. Enriched with calamansi extract, pure vitamin C, and aloe vera, it visibly fades dark spots while keeping your skin soft, healthy, and radiant.</p><p>Gentle yet effective, this soap is free from harsh chemicals, leaving your skin refreshed and glowing, perfect for <strong>daily use</strong>.</p>	vitamin-c-soap	t	t	JM Premium Vitamin C Soap Luxury Brightening & Hydrating Bar for Even Skin Tone	Discover JM Premium Vitamin C Soap, enriched with Calamansi and Aloe Vera. Brighten, hydrate, and even your skin tone with this gentle, luxurious soap for radiant, healthy-looking skin. Only ₱250!	0.10	0.00	0.00	\N	\N	\N	250.00	0.00	10	2025-08-21 21:08:15.190891+00	2025-08-22 15:44:14.295569+00	0.00	<ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong>Brightens &amp; Fades Dark Spots </strong> – Calamansi extract and vitamin C work together to visibly reduce dark spots and uneven skin tone.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong>Hydrates &amp; Soothes </strong>– Aloe vera and glycerin deeply moisturize and calm the skin.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong>Gentle &amp; Non-Drying </strong>–Translucent glycerin base ensures a soft, creamy lather that cleanses without irritation.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong>Premium Skincare Experience </strong>– Combines natural ingredients with scientific precision for luxurious, effective results.</li></ol>	<p>Sodium Stearate, Sodium Laureth, Sodium Laureth Sulfate, Glycerin, Propylene Glycol, Sorbitol, Sucrose, Sodium Citrate, Sodium Chloride, Aqua, Parfum, Aloe Vera (Aloe Barbadensis), Leaf Extract, Ethyl Ascorbic Acid, Calamansi (Citrus Microcarpa) Fruit Extract, CI 42053, CI 19140</p>	<ol><li data-list="ordered"><span class="ql-ui" contenteditable="false"></span>Wet your skin and gently lather the soap, avoiding the eye area.</li><li data-list="ordered"><span class="ql-ui" contenteditable="false"></span>Leave the lather on your skin for at least 1 minute for optimal Vitamin C absorption.</li><li data-list="ordered"><span class="ql-ui" contenteditable="false"></span>Rinse thoroughly and pat dry.</li></ol><p>This product is for external use only. Store at a temperate not exceeding 30<strong style="background-color: rgb(255, 255, 255); color: rgb(51, 51, 51);">° </strong><span style="background-color: rgb(255, 255, 255); color: rgb(51, 51, 51);">Celsius</span><strong style="background-color: rgb(255, 255, 255); color: rgb(51, 51, 51);">.</strong></p>
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.reviews (id, user_id, product_id, rating, title, content, is_verified, is_approved, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: subscriptions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.subscriptions (id, email, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, email, password_hash, first_name, last_name, country_code, phone_number, is_admin, created_at, updated_at) FROM stdin;
1	mathena828@gmail.com	scrypt:32768:8:1$XrJFeaCdILWheCrP$7c668c022bc3561b380524db3207d11bf4f261bb8296479ec9fe0aae8e040059b92a54d2404d48ca0eb5b92b6ebf37b3b041f61f0eae8bfba4b1dfed1878edd1	Mathena	Angeles	63	9178289919	t	2025-05-03 17:40:02.314849+00	2025-05-04 17:10:39.991907+00
3	jmpremium.official@gmail.com	scrypt:32768:8:1$MCyANIIQsOvuocc1$cc43fa5788b056381d92f9e2f6053dccc2e35e8a4628f8672e2a0e01c021881ede8ae1cc5ced87588fefe312d515c70b0988fb9f7f8dc5f499bd03ab978b0490	JM 	Premium	\N	\N	t	2025-08-17 14:43:56.039206+00	2025-08-17 14:43:56.039206+00
\.


--
-- Name: addresses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.addresses_id_seq', 1, true);


--
-- Name: cart_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.cart_items_id_seq', 1, false);


--
-- Name: carts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.carts_id_seq', 3, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.categories_id_seq', 2, true);


--
-- Name: category_images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.category_images_id_seq', 1, false);


--
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.order_items_id_seq', 1, false);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.orders_id_seq', 1, false);


--
-- Name: payments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.payments_id_seq', 1, false);


--
-- Name: product_images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.product_images_id_seq', 1, false);


--
-- Name: product_variants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.product_variants_id_seq', 1, false);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.products_id_seq', 4, true);


--
-- Name: reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.reviews_id_seq', 1, false);


--
-- Name: subscriptions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.subscriptions_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


--
-- Name: addresses addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_pkey PRIMARY KEY (id);


--
-- Name: alembic_version alembic_version_pkc; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alembic_version
    ADD CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num);


--
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);


--
-- Name: carts carts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_pkey PRIMARY KEY (id);


--
-- Name: categories categories_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key UNIQUE (name);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: categories categories_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_slug_key UNIQUE (slug);


--
-- Name: category_images category_images_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.category_images
    ADD CONSTRAINT category_images_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: product_images product_images_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_pkey PRIMARY KEY (id);


--
-- Name: product_variants product_variants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT product_variants_pkey PRIMARY KEY (id);


--
-- Name: products products_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_name_key UNIQUE (name);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: products products_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_slug_key UNIQUE (slug);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: subscriptions subscriptions_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_email_key UNIQUE (email);


--
-- Name: subscriptions subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_pkey PRIMARY KEY (id);


--
-- Name: product_variants uq_product_variant_options; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT uq_product_variant_options UNIQUE (product_id, option1_value, option2_value, option3_value);


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
-- Name: addresses addresses_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: cart_items cart_items_cart_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_cart_id_fkey FOREIGN KEY (cart_id) REFERENCES public.carts(id);


--
-- Name: cart_items cart_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: cart_items cart_items_variant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_variant_id_fkey FOREIGN KEY (variant_id) REFERENCES public.product_variants(id);


--
-- Name: carts carts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: categories categories_parent_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_parent_category_id_fkey FOREIGN KEY (parent_category_id) REFERENCES public.categories(id);


--
-- Name: category_images category_images_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.category_images
    ADD CONSTRAINT category_images_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: order_items order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: order_items order_items_variant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_variant_id_fkey FOREIGN KEY (variant_id) REFERENCES public.product_variants(id);


--
-- Name: orders orders_billing_address_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_billing_address_id_fkey FOREIGN KEY (billing_address_id) REFERENCES public.addresses(id);


--
-- Name: orders orders_payment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_payment_id_fkey FOREIGN KEY (payment_id) REFERENCES public.payments(id);


--
-- Name: orders orders_shipping_address_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_shipping_address_id_fkey FOREIGN KEY (shipping_address_id) REFERENCES public.addresses(id);


--
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: payments payments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: product_images product_images_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: product_images product_images_variant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_variant_id_fkey FOREIGN KEY (variant_id) REFERENCES public.product_variants(id);


--
-- Name: product_variants product_variants_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT product_variants_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- Name: reviews reviews_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: reviews reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: -
--



--
-- PostgreSQL database dump complete
--

