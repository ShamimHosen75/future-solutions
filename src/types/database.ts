/**
 * Hand-maintained database types that mirror supabase/migrations.
 * Regenerate from a linked project with `npm run db:types` once the schema is
 * applied; the output is drop-in compatible with everything that imports from
 * here.
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

/** Columns that have DB defaults and may be omitted on insert. */
type WithDefaults<Row, K extends keyof Row> = Omit<Row, K> & Partial<Pick<Row, K>>;

export type UserRole = "admin" | "editor";
export type LeadType = "contact" | "quote" | "enrollment" | "career" | "review" | "newsletter";
export type LeadStatus = "new" | "contacted" | "won" | "lost";
export type ProductStatus = "live" | "beta" | "coming_soon";
export type CourseLevel = "beginner" | "intermediate" | "advanced";
export type CourseFormat = "online" | "offline" | "hybrid";
export type ClientType = "client" | "partner";

/* ─────────────────────────── Row types ─────────────────────────── */

export type ProfileRow = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ServiceRow = {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  description: string | null;
  icon: string | null;
  cover_image: string | null;
  features: Json;
  process_steps: Json;
  deliverables: Json;
  tech_stack: Json;
  faqs: Json;
  starting_price: number | null;
  price_currency: string;
  seo_title: string | null;
  seo_description: string | null;
  is_featured: boolean;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type ProductRow = {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  cover_image: string | null;
  gallery: Json;
  features: Json;
  tech_stack: Json;
  pricing_model: string | null;
  price: number | null;
  price_currency: string;
  demo_url: string | null;
  website_url: string | null;
  app_store_url: string | null;
  play_store_url: string | null;
  status: ProductStatus;
  seo_title: string | null;
  seo_description: string | null;
  is_featured: boolean;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type ProjectRow = {
  id: string;
  slug: string;
  title: string;
  client_name: string | null;
  client_id: string | null;
  service_id: string | null;
  industry: string | null;
  year: number | null;
  summary: string;
  challenge: string | null;
  solution: string | null;
  results: string | null;
  cover_image: string | null;
  gallery: Json;
  tech_stack: Json;
  metrics: Json;
  live_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
  is_featured: boolean;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type PricingPlanRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  category: string;
  price_monthly: number | null;
  price_yearly: number | null;
  price_one_time: number | null;
  currency: string;
  features: Json;
  limits: Json;
  cta_label: string;
  cta_href: string;
  is_popular: boolean;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type CourseRow = {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  description: string | null;
  cover_image: string | null;
  level: CourseLevel;
  format: CourseFormat;
  duration_weeks: number | null;
  price: number | null;
  discount_price: number | null;
  currency: string;
  curriculum: Json;
  outcomes: Json;
  prerequisites: Json;
  batches: Json;
  instructor_id: string | null;
  seo_title: string | null;
  seo_description: string | null;
  is_featured: boolean;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type ClientRow = {
  id: string;
  slug: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  industry: string | null;
  type: ClientType;
  is_featured: boolean;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type TestimonialRow = {
  id: string;
  slug: string;
  author_name: string;
  author_role: string | null;
  author_company: string | null;
  author_avatar: string | null;
  author_email: string | null;
  client_id: string | null;
  content: string;
  rating: number;
  source: string | null;
  is_approved: boolean;
  is_featured: boolean;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type TeamMemberRow = {
  id: string;
  slug: string;
  name: string;
  role: string;
  bio: string | null;
  avatar_url: string | null;
  socials: Json;
  skills: Json;
  is_featured: boolean;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type LeadRow = {
  id: string;
  type: LeadType;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  subject: string | null;
  message: string | null;
  budget: string | null;
  service_id: string | null;
  course_id: string | null;
  source: string | null;
  metadata: Json;
  status: LeadStatus;
  notes: string | null;
  assigned_to: string | null;
  ip_hash: string | null;
  user_agent: string | null;
  created_at: string;
  updated_at: string;
};

export type MediaRow = {
  id: string;
  bucket: string;
  path: string;
  url: string;
  alt: string | null;
  folder: string;
  mime_type: string | null;
  size_bytes: number | null;
  width: number | null;
  height: number | null;
  uploaded_by: string | null;
  created_at: string;
  updated_at: string;
};

export type SettingRow = {
  id: string;
  key: string;
  value: Json;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
};

export type BlogPostRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  cover_image: string | null;
  author_id: string | null;
  tags: Json;
  reading_time: number | null;
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  is_featured: boolean;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type PageViewRow = {
  id: number;
  path: string;
  referrer: string | null;
  country: string | null;
  device: string | null;
  session_hash: string | null;
  created_at: string;
};

/* ─────────────────────── Insert / Update ─────────────────────── */

type Timestamps = "created_at" | "updated_at";
type ContentDefaults = "id" | "sort_order" | "is_published" | "is_featured" | Timestamps;

type Table<Row, Insert> = {
  Row: Row;
  Insert: Insert;
  Update: Partial<Insert>;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      profiles: Table<
        ProfileRow,
        WithDefaults<ProfileRow, "full_name" | "avatar_url" | "role" | "is_active" | Timestamps>
      >;
      services: Table<
        ServiceRow,
        WithDefaults<
          ServiceRow,
          | ContentDefaults
          | "description"
          | "icon"
          | "cover_image"
          | "features"
          | "process_steps"
          | "deliverables"
          | "tech_stack"
          | "faqs"
          | "starting_price"
          | "price_currency"
          | "seo_title"
          | "seo_description"
        >
      >;
      products: Table<
        ProductRow,
        WithDefaults<
          ProductRow,
          | ContentDefaults
          | "tagline"
          | "description"
          | "cover_image"
          | "gallery"
          | "features"
          | "tech_stack"
          | "pricing_model"
          | "price"
          | "price_currency"
          | "demo_url"
          | "website_url"
          | "app_store_url"
          | "play_store_url"
          | "status"
          | "seo_title"
          | "seo_description"
        >
      >;
      projects: Table<
        ProjectRow,
        WithDefaults<
          ProjectRow,
          | ContentDefaults
          | "client_name"
          | "client_id"
          | "service_id"
          | "industry"
          | "year"
          | "challenge"
          | "solution"
          | "results"
          | "cover_image"
          | "gallery"
          | "tech_stack"
          | "metrics"
          | "live_url"
          | "seo_title"
          | "seo_description"
        >
      >;
      pricing_plans: Table<
        PricingPlanRow,
        WithDefaults<
          PricingPlanRow,
          | "id"
          | "sort_order"
          | "is_published"
          | "is_popular"
          | Timestamps
          | "description"
          | "category"
          | "price_monthly"
          | "price_yearly"
          | "price_one_time"
          | "currency"
          | "features"
          | "limits"
          | "cta_label"
          | "cta_href"
        >
      >;
      courses: Table<
        CourseRow,
        WithDefaults<
          CourseRow,
          | ContentDefaults
          | "description"
          | "cover_image"
          | "level"
          | "format"
          | "duration_weeks"
          | "price"
          | "discount_price"
          | "currency"
          | "curriculum"
          | "outcomes"
          | "prerequisites"
          | "batches"
          | "instructor_id"
          | "seo_title"
          | "seo_description"
        >
      >;
      clients: Table<
        ClientRow,
        WithDefaults<ClientRow, ContentDefaults | "logo_url" | "website_url" | "industry" | "type">
      >;
      testimonials: Table<
        TestimonialRow,
        WithDefaults<
          TestimonialRow,
          | ContentDefaults
          | "slug"
          | "author_role"
          | "author_company"
          | "author_avatar"
          | "author_email"
          | "client_id"
          | "rating"
          | "source"
          | "is_approved"
        >
      >;
      team_members: Table<
        TeamMemberRow,
        WithDefaults<TeamMemberRow, ContentDefaults | "bio" | "avatar_url" | "socials" | "skills">
      >;
      leads: Table<
        LeadRow,
        WithDefaults<
          LeadRow,
          | "id"
          | Timestamps
          | "phone"
          | "company"
          | "subject"
          | "message"
          | "budget"
          | "service_id"
          | "course_id"
          | "source"
          | "metadata"
          | "status"
          | "notes"
          | "assigned_to"
          | "ip_hash"
          | "user_agent"
        >
      >;
      media: Table<
        MediaRow,
        WithDefaults<
          MediaRow,
          | "id"
          | Timestamps
          | "bucket"
          | "alt"
          | "folder"
          | "mime_type"
          | "size_bytes"
          | "width"
          | "height"
          | "uploaded_by"
        >
      >;
      settings: Table<SettingRow, WithDefaults<SettingRow, "id" | Timestamps | "updated_by">>;
      blog_posts: Table<
        BlogPostRow,
        WithDefaults<
          BlogPostRow,
          | ContentDefaults
          | "excerpt"
          | "content"
          | "cover_image"
          | "author_id"
          | "tags"
          | "reading_time"
          | "published_at"
          | "seo_title"
          | "seo_description"
        >
      >;
      page_views: Table<
        PageViewRow,
        WithDefaults<PageViewRow, "id" | "created_at" | "referrer" | "country" | "device" | "session_hash">
      >;
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean };
      is_editor_or_admin: { Args: Record<string, never>; Returns: boolean };
      get_my_role: { Args: Record<string, never>; Returns: UserRole | null };
      increment_sort_order: { Args: { table_name: string }; Returns: number };
    };
    Enums: {
      user_role: UserRole;
      lead_type: LeadType;
      lead_status: LeadStatus;
      product_status: ProductStatus;
      course_level: CourseLevel;
      course_format: CourseFormat;
      client_type: ClientType;
    };
    CompositeTypes: Record<string, never>;
  };
};

/* ─────────────────────────── Helpers ─────────────────────────── */

export type PublicSchema = Database["public"];
export type TableName = keyof PublicSchema["Tables"];
export type Tables<T extends TableName> = PublicSchema["Tables"][T]["Row"];
export type TablesInsert<T extends TableName> = PublicSchema["Tables"][T]["Insert"];
export type TablesUpdate<T extends TableName> = PublicSchema["Tables"][T]["Update"];
export type Enums<T extends keyof PublicSchema["Enums"]> = PublicSchema["Enums"][T];

/** Tables that follow the content convention (slug, sort_order, is_published). */
export type ContentTableName =
  | "services"
  | "products"
  | "projects"
  | "pricing_plans"
  | "courses"
  | "clients"
  | "testimonials"
  | "team_members"
  | "blog_posts";
