/**
 * Declarative registry for every content module in the dashboard. The list
 * page, the form, the Zod schema and the revalidation logic all derive from
 * these definitions, so adding a module is a config change.
 */
import type { ContentTableName } from "@/types/database";

export type Option = { label: string; value: string };

export type FieldType =
  | "text"
  | "slug"
  | "textarea"
  | "richtext"
  | "number"
  | "select"
  | "switch"
  | "image"
  | "images"
  | "tags"
  | "list"
  | "keyvalue"
  | "relation"
  | "date"
  | "email"
  | "url";

export type FieldDef = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  hint?: string;
  options?: Option[];
  /** For `relation`: which table and column provide the options. */
  relation?: { table: ContentTableName; labelColumn: string };
  /** For `list`: shape of each item. */
  item?: FieldDef[];
  /** Layout width inside the form grid. */
  width?: "full" | "half" | "third";
  /** Group fields under a heading. */
  section?: string;
  min?: number;
  max?: number;
};

export type ColumnDef = {
  key: string;
  label: string;
  type?: "text" | "badge" | "number" | "image" | "date" | "boolean" | "rating" | "currency";
  width?: string;
};

export type ModuleDef = {
  /** URL segment, e.g. "pricing-plans". */
  key: string;
  table: ContentTableName;
  label: string;
  singular: string;
  icon: string;
  description: string;
  /** Column used as the display title in lists and headings. */
  titleField: string;
  /** Column the slug is generated from. */
  slugSource: string;
  searchFields: string[];
  columns: ColumnDef[];
  fields: FieldDef[];
  /** Extra boolean toggles exposed in the list (besides is_published). */
  toggles: { key: string; label: string }[];
  /** Cache tag + public paths to revalidate after a save. */
  tag: string;
  publicPaths: (slug: string) => string[];
};

const seo: FieldDef[] = [
  { name: "seo_title", label: "SEO title", type: "text", section: "SEO", hint: "Defaults to the title. Keep under 60 characters." },
  { name: "seo_description", label: "SEO description", type: "textarea", section: "SEO", hint: "Shown in search results. 150–160 characters." },
];

const flags = (extra: FieldDef[] = []): FieldDef[] => [
  { name: "is_published", label: "Published", type: "switch", section: "Visibility", width: "third", hint: "Draft items are hidden from the public site." },
  { name: "is_featured", label: "Featured", type: "switch", section: "Visibility", width: "third", hint: "Shown on the homepage." },
  ...extra,
];

const currencyOptions: Option[] = [
  { label: "BDT (৳)", value: "BDT" },
  { label: "USD ($)", value: "USD" },
];

export const modules: ModuleDef[] = [
  {
    key: "services",
    table: "services",
    label: "Services",
    singular: "Service",
    icon: "layers",
    description: "The six core offerings shown on the homepage and /services.",
    titleField: "title",
    slugSource: "title",
    searchFields: ["title", "short_description"],
    columns: [
      { key: "title", label: "Title" },
      { key: "starting_price", label: "From", type: "currency" },
      { key: "is_featured", label: "Featured", type: "boolean" },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true, width: "half" },
      { name: "slug", label: "Slug", type: "slug", width: "half" },
      { name: "short_description", label: "Short description", type: "textarea", required: true, hint: "One or two sentences for cards." },
      { name: "description", label: "Full description", type: "richtext" },
      {
        name: "icon",
        label: "Icon",
        type: "select",
        width: "half",
        options: [
          { label: "Globe (web)", value: "globe" },
          { label: "Shopping bag (e-commerce)", value: "shopping-bag" },
          { label: "Smartphone (mobile)", value: "smartphone" },
          { label: "Code (software)", value: "code" },
          { label: "Line chart (marketing)", value: "line-chart" },
          { label: "Bot (AI)", value: "bot" },
        ],
      },
      { name: "cover_image", label: "Cover image", type: "image", width: "half" },
      { name: "features", label: "Features", type: "tags", section: "Details", hint: "Press Enter after each item." },
      { name: "deliverables", label: "Deliverables", type: "tags", section: "Details" },
      { name: "tech_stack", label: "Technology", type: "tags", section: "Details" },
      {
        name: "process_steps",
        label: "Process steps",
        type: "list",
        section: "Details",
        item: [
          { name: "title", label: "Step title", type: "text", required: true, width: "third" },
          { name: "description", label: "Description", type: "text", width: "full" },
        ],
      },
      {
        name: "faqs",
        label: "FAQs",
        type: "list",
        section: "Details",
        item: [
          { name: "q", label: "Question", type: "text", required: true },
          { name: "a", label: "Answer", type: "textarea", required: true },
        ],
      },
      { name: "starting_price", label: "Starting price", type: "number", section: "Pricing", width: "half", min: 0 },
      { name: "price_currency", label: "Currency", type: "select", section: "Pricing", width: "half", options: currencyOptions },
      ...seo,
      ...flags(),
    ],
    toggles: [{ key: "is_featured", label: "Featured" }],
    tag: "services",
    publicPaths: (slug) => ["/", "/services", `/services/${slug}`, "/sitemap.xml"],
  },
  {
    key: "products",
    table: "products",
    label: "Products",
    singular: "Product",
    icon: "package",
    description: "Your own apps and SaaS platforms.",
    titleField: "name",
    slugSource: "name",
    searchFields: ["name", "tagline"],
    columns: [
      { key: "cover_image", label: "", type: "image", width: "3rem" },
      { key: "name", label: "Name" },
      { key: "status", label: "Status", type: "badge" },
      { key: "price", label: "Price", type: "currency" },
    ],
    fields: [
      { name: "name", label: "Name", type: "text", required: true, width: "half" },
      { name: "slug", label: "Slug", type: "slug", width: "half" },
      { name: "tagline", label: "Tagline", type: "text" },
      { name: "description", label: "Description", type: "richtext" },
      {
        name: "status",
        label: "Status",
        type: "select",
        width: "third",
        options: [
          { label: "Live", value: "live" },
          { label: "Beta", value: "beta" },
          { label: "Coming soon", value: "coming_soon" },
        ],
      },
      { name: "cover_image", label: "Cover image", type: "image", width: "half" },
      { name: "gallery", label: "Gallery", type: "images", section: "Media" },
      { name: "features", label: "Features", type: "tags", section: "Details" },
      { name: "tech_stack", label: "Technology", type: "tags", section: "Details" },
      {
        name: "pricing_model",
        label: "Pricing model",
        type: "select",
        section: "Pricing",
        width: "third",
        options: [
          { label: "Subscription", value: "subscription" },
          { label: "One-time", value: "one_time" },
          { label: "Free", value: "free" },
          { label: "Custom", value: "custom" },
        ],
      },
      { name: "price", label: "Price", type: "number", section: "Pricing", width: "third", min: 0 },
      { name: "price_currency", label: "Currency", type: "select", section: "Pricing", width: "third", options: currencyOptions },
      { name: "demo_url", label: "Demo URL", type: "url", section: "Links", width: "half" },
      { name: "website_url", label: "Website URL", type: "url", section: "Links", width: "half" },
      { name: "app_store_url", label: "App Store URL", type: "url", section: "Links", width: "half" },
      { name: "play_store_url", label: "Google Play URL", type: "url", section: "Links", width: "half" },
      ...seo,
      ...flags(),
    ],
    toggles: [{ key: "is_featured", label: "Featured" }],
    tag: "products",
    publicPaths: (slug) => ["/", "/products", `/products/${slug}`, "/sitemap.xml"],
  },
  {
    key: "projects",
    table: "projects",
    label: "Projects",
    singular: "Project",
    icon: "briefcase",
    description: "Client work shown in the portfolio as case studies.",
    titleField: "title",
    slugSource: "title",
    searchFields: ["title", "client_name", "industry"],
    columns: [
      { key: "cover_image", label: "", type: "image", width: "3rem" },
      { key: "title", label: "Title" },
      { key: "client_name", label: "Client" },
      { key: "industry", label: "Industry", type: "badge" },
      { key: "year", label: "Year", type: "number" },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true, width: "half" },
      { name: "slug", label: "Slug", type: "slug", width: "half" },
      { name: "client_name", label: "Client name", type: "text", width: "half" },
      { name: "client_id", label: "Linked client", type: "relation", width: "half", relation: { table: "clients", labelColumn: "name" } },
      { name: "service_id", label: "Service", type: "relation", width: "half", relation: { table: "services", labelColumn: "title" } },
      { name: "industry", label: "Industry", type: "text", width: "third" },
      { name: "year", label: "Year", type: "number", width: "third", min: 2000, max: 2100 },
      { name: "live_url", label: "Live URL", type: "url", width: "half" },
      { name: "summary", label: "Summary", type: "textarea", required: true },
      { name: "challenge", label: "The challenge", type: "richtext", section: "Case study" },
      { name: "solution", label: "What we built", type: "richtext", section: "Case study" },
      { name: "results", label: "The results", type: "richtext", section: "Case study" },
      {
        name: "metrics",
        label: "Key metrics",
        type: "list",
        section: "Case study",
        hint: 'e.g. label "AOV increase", value "+24%"',
        item: [
          { name: "label", label: "Label", type: "text", required: true },
          { name: "value", label: "Value", type: "text", required: true },
        ],
      },
      { name: "tech_stack", label: "Technology", type: "tags", section: "Case study" },
      { name: "cover_image", label: "Cover image", type: "image", section: "Media", width: "half" },
      { name: "gallery", label: "Gallery", type: "images", section: "Media" },
      ...seo,
      ...flags(),
    ],
    toggles: [{ key: "is_featured", label: "Featured" }],
    tag: "projects",
    publicPaths: (slug) => ["/", "/portfolio", `/portfolio/${slug}`, "/sitemap.xml"],
  },
  {
    key: "pricing-plans",
    table: "pricing_plans",
    label: "Pricing plans",
    singular: "Plan",
    icon: "credit-card",
    description: "Packages shown on /pricing with monthly, yearly and one-time prices.",
    titleField: "name",
    slugSource: "name",
    searchFields: ["name", "category"],
    columns: [
      { key: "name", label: "Plan" },
      { key: "category", label: "Category", type: "badge" },
      { key: "price_monthly", label: "Monthly", type: "currency" },
      { key: "price_one_time", label: "One-time", type: "currency" },
      { key: "is_popular", label: "Popular", type: "boolean" },
    ],
    fields: [
      { name: "name", label: "Name", type: "text", required: true, width: "half" },
      { name: "slug", label: "Slug", type: "slug", width: "half" },
      { name: "description", label: "Description", type: "textarea" },
      {
        name: "category",
        label: "Category",
        type: "select",
        width: "third",
        options: [
          { label: "Websites", value: "web" },
          { label: "E-commerce", value: "ecommerce" },
          { label: "Mobile apps", value: "app" },
          { label: "Software", value: "software" },
          { label: "Marketing", value: "marketing" },
        ],
      },
      { name: "currency", label: "Currency", type: "select", width: "third", options: currencyOptions },
      { name: "price_monthly", label: "Monthly price", type: "number", section: "Prices", width: "third", min: 0, hint: "Leave empty for “Custom”." },
      { name: "price_yearly", label: "Yearly price", type: "number", section: "Prices", width: "third", min: 0 },
      { name: "price_one_time", label: "One-time price", type: "number", section: "Prices", width: "third", min: 0 },
      { name: "features", label: "Features", type: "tags", section: "Details", hint: "Also used to build the comparison table." },
      { name: "limits", label: "Limits", type: "keyvalue", section: "Details", hint: "e.g. pages → 15" },
      { name: "cta_label", label: "Button label", type: "text", section: "Call to action", width: "half" },
      { name: "cta_href", label: "Button link", type: "text", section: "Call to action", width: "half" },
      { name: "is_published", label: "Published", type: "switch", section: "Visibility", width: "third" },
      { name: "is_popular", label: "Popular", type: "switch", section: "Visibility", width: "third", hint: "Highlights the plan." },
    ],
    toggles: [{ key: "is_popular", label: "Popular" }],
    tag: "pricing_plans",
    publicPaths: () => ["/pricing"],
  },
  {
    key: "courses",
    table: "courses",
    label: "Courses",
    singular: "Course",
    icon: "graduation-cap",
    description: "Academy courses, curriculum and batches.",
    titleField: "title",
    slugSource: "title",
    searchFields: ["title", "short_description"],
    columns: [
      { key: "title", label: "Course" },
      { key: "level", label: "Level", type: "badge" },
      { key: "format", label: "Format", type: "badge" },
      { key: "price", label: "Price", type: "currency" },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true, width: "half" },
      { name: "slug", label: "Slug", type: "slug", width: "half" },
      { name: "short_description", label: "Short description", type: "textarea", required: true },
      { name: "description", label: "Full description", type: "richtext" },
      {
        name: "level",
        label: "Level",
        type: "select",
        width: "third",
        options: [
          { label: "Beginner", value: "beginner" },
          { label: "Intermediate", value: "intermediate" },
          { label: "Advanced", value: "advanced" },
        ],
      },
      {
        name: "format",
        label: "Format",
        type: "select",
        width: "third",
        options: [
          { label: "Online", value: "online" },
          { label: "Offline", value: "offline" },
          { label: "Hybrid", value: "hybrid" },
        ],
      },
      { name: "duration_weeks", label: "Duration (weeks)", type: "number", width: "third", min: 1 },
      { name: "instructor_id", label: "Instructor", type: "relation", width: "half", relation: { table: "team_members", labelColumn: "name" } },
      { name: "cover_image", label: "Cover image", type: "image", width: "half" },
      { name: "price", label: "Price", type: "number", section: "Pricing", width: "third", min: 0 },
      { name: "discount_price", label: "Discount price", type: "number", section: "Pricing", width: "third", min: 0 },
      { name: "currency", label: "Currency", type: "select", section: "Pricing", width: "third", options: currencyOptions },
      {
        name: "curriculum",
        label: "Curriculum",
        type: "list",
        section: "Content",
        item: [
          { name: "module", label: "Module", type: "text", required: true },
          { name: "topics", label: "Topics", type: "tags" },
        ],
      },
      { name: "outcomes", label: "Outcomes", type: "tags", section: "Content" },
      { name: "prerequisites", label: "Prerequisites", type: "tags", section: "Content" },
      {
        name: "batches",
        label: "Batches",
        type: "list",
        section: "Batches",
        item: [
          { name: "name", label: "Batch name", type: "text", required: true, width: "third" },
          { name: "starts_on", label: "Start date", type: "date", required: true, width: "third" },
          { name: "schedule", label: "Schedule", type: "text", width: "third" },
          { name: "seats", label: "Seats", type: "number", width: "third" },
          { name: "seats_left", label: "Seats left", type: "number", width: "third" },
          {
            name: "status",
            label: "Status",
            type: "select",
            width: "third",
            options: [
              { label: "Enrolling", value: "enrolling" },
              { label: "Upcoming", value: "upcoming" },
              { label: "Running", value: "running" },
              { label: "Closed", value: "closed" },
            ],
          },
        ],
      },
      ...seo,
      ...flags(),
    ],
    toggles: [{ key: "is_featured", label: "Featured" }],
    tag: "courses",
    publicPaths: (slug) => ["/", "/academy", `/academy/${slug}`, "/sitemap.xml"],
  },
  {
    key: "clients",
    table: "clients",
    label: "Clients & partners",
    singular: "Client",
    icon: "handshake",
    description: "Logos shown in the marquee and on /clients.",
    titleField: "name",
    slugSource: "name",
    searchFields: ["name", "industry"],
    columns: [
      { key: "logo_url", label: "", type: "image", width: "3rem" },
      { key: "name", label: "Name" },
      { key: "type", label: "Type", type: "badge" },
      { key: "industry", label: "Industry" },
    ],
    fields: [
      { name: "name", label: "Name", type: "text", required: true, width: "half" },
      { name: "slug", label: "Slug", type: "slug", width: "half" },
      {
        name: "type",
        label: "Type",
        type: "select",
        width: "third",
        options: [
          { label: "Client", value: "client" },
          { label: "Partner", value: "partner" },
        ],
      },
      { name: "industry", label: "Industry", type: "text", width: "third" },
      { name: "website_url", label: "Website", type: "url", width: "third" },
      { name: "logo_url", label: "Logo", type: "image", hint: "SVG or PNG with transparent background works best." },
      ...flags(),
    ],
    toggles: [{ key: "is_featured", label: "Featured" }],
    tag: "clients",
    publicPaths: () => ["/", "/clients"],
  },
  {
    key: "testimonials",
    table: "testimonials",
    label: "Testimonials",
    singular: "Testimonial",
    icon: "message-square-quote",
    description: "Reviews from clients and students. Public submissions arrive unapproved.",
    titleField: "author_name",
    slugSource: "author_name",
    searchFields: ["author_name", "author_company", "content"],
    columns: [
      { key: "author_name", label: "Author" },
      { key: "author_company", label: "Company" },
      { key: "rating", label: "Rating", type: "rating" },
      { key: "is_approved", label: "Approved", type: "boolean" },
      { key: "created_at", label: "Received", type: "date" },
    ],
    fields: [
      { name: "author_name", label: "Author name", type: "text", required: true, width: "half" },
      { name: "slug", label: "Slug", type: "slug", width: "half" },
      { name: "author_role", label: "Role", type: "text", width: "third" },
      { name: "author_company", label: "Company / batch", type: "text", width: "third" },
      { name: "author_email", label: "Email (private)", type: "email", width: "third" },
      { name: "client_id", label: "Linked client", type: "relation", width: "half", relation: { table: "clients", labelColumn: "name" } },
      { name: "author_avatar", label: "Avatar", type: "image", width: "half" },
      { name: "content", label: "Review", type: "textarea", required: true },
      { name: "rating", label: "Rating (1–5)", type: "number", width: "third", min: 1, max: 5, required: true },
      { name: "source", label: "Source", type: "text", width: "third", placeholder: "Google, LinkedIn, Website…" },
      { name: "is_approved", label: "Approved", type: "switch", section: "Visibility", width: "third", hint: "Only approved and published reviews are public." },
      ...flags(),
    ],
    toggles: [
      { key: "is_approved", label: "Approved" },
      { key: "is_featured", label: "Featured" },
    ],
    tag: "testimonials",
    publicPaths: () => ["/", "/clients"],
  },
  {
    key: "team",
    table: "team_members",
    label: "Team",
    singular: "Team member",
    icon: "users",
    description: "People shown on the About page and as course instructors.",
    titleField: "name",
    slugSource: "name",
    searchFields: ["name", "role"],
    columns: [
      { key: "avatar_url", label: "", type: "image", width: "3rem" },
      { key: "name", label: "Name" },
      { key: "role", label: "Role" },
    ],
    fields: [
      { name: "name", label: "Name", type: "text", required: true, width: "half" },
      { name: "slug", label: "Slug", type: "slug", width: "half" },
      { name: "role", label: "Role / title", type: "text", required: true, width: "half" },
      { name: "avatar_url", label: "Photo", type: "image", width: "half" },
      { name: "bio", label: "Bio", type: "textarea" },
      { name: "skills", label: "Skills", type: "tags" },
      { name: "socials", label: "Social links", type: "keyvalue", hint: "e.g. linkedin → https://linkedin.com/in/…" },
      ...flags(),
    ],
    toggles: [{ key: "is_featured", label: "Featured" }],
    tag: "team_members",
    publicPaths: () => ["/about", "/academy"],
  },
  {
    key: "blog",
    table: "blog_posts",
    label: "Blog",
    singular: "Post",
    icon: "newspaper",
    description: "Articles and announcements.",
    titleField: "title",
    slugSource: "title",
    searchFields: ["title", "excerpt"],
    columns: [
      { key: "cover_image", label: "", type: "image", width: "3rem" },
      { key: "title", label: "Title" },
      { key: "published_at", label: "Published", type: "date" },
      { key: "reading_time", label: "Min read", type: "number" },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true, width: "half" },
      { name: "slug", label: "Slug", type: "slug", width: "half" },
      { name: "excerpt", label: "Excerpt", type: "textarea" },
      { name: "content", label: "Content", type: "richtext" },
      { name: "cover_image", label: "Cover image", type: "image", width: "half" },
      { name: "author_id", label: "Author", type: "relation", width: "half", relation: { table: "team_members", labelColumn: "name" } },
      { name: "tags", label: "Tags", type: "tags", width: "half" },
      { name: "reading_time", label: "Reading time (min)", type: "number", width: "third", min: 1 },
      { name: "published_at", label: "Publish date", type: "date", width: "third" },
      ...seo,
      ...flags(),
    ],
    toggles: [{ key: "is_featured", label: "Featured" }],
    tag: "blog_posts",
    publicPaths: () => ["/"],
  },
];

export const moduleByKey = new Map(modules.map((m) => [m.key, m]));

export function getModule(key: string): ModuleDef | undefined {
  return moduleByKey.get(key);
}

/** Fields that live in the form (everything except system columns). */
export function formFields(def: ModuleDef): FieldDef[] {
  return def.fields;
}

/** Sections in display order, preserving first appearance. */
export function sectionsOf(def: ModuleDef): string[] {
  const seen: string[] = [];
  for (const f of def.fields) {
    const s = f.section ?? "General";
    if (!seen.includes(s)) seen.push(s);
  }
  return seen;
}
