import themes from "daisyui/src/theming/themes";
import { ConfigProps, PlanName } from "./types/config";

const config = {
  // REQUIRED
  appName: "dispo depo",
  // REQUIRED: a short description of your app for SEO tags (can be overwritten)
  appDescription:
    "Automate your wholesale workflow with a powerful CRM built for real estate professionals. Analyze deals, estimate repairs and max allowable offers (MAO), and send properties to the right buyer tags — all in one streamlined platform.",
  // REQUIRED (no https://, not trailing slash at the end, just the naked domain)
  domainName: "shipfa.st",
  crisp: {
    // Crisp website ID. IF YOU DON'T USE CRISP: just remove this => Then add a support email in this config file (resend.supportEmail) otherwise customer support won't work.
    id: "",
    // Hide Crisp by default, except on route "/". Crisp is toggled with <ButtonSupport/>. If you want to show Crisp on every routes, just remove this below
    onlyShowOnRoutes: ["/"],
  },
  stripe: {
    // Create multiple plans in your Stripe dashboard, then add them here. You can add as many plans as you want, just make sure to add the priceId
    plans: [
      {
        // REQUIRED — we use this to find the plan in the webhook (for instance if you want to update the user's credits based on the plan)
        priceId: process.env.STRIPE_FREE_PLAN_PRICE_ID || "",
        
        //  REQUIRED - Name of the plan, displayed on the pricing page
        name: PlanName.FREE,
        // A friendly description of the plan, displayed on the pricing page. Tip: explain why this plan and not others
        description: "Perfect for getting started",
        // The price you want to display, the one user will be charged on Stripe.
        price: 0,
        // If you have an anchor price (i.e. $29) that you want to display crossed out, put it here. Otherwise, leave it empty
        priceAnchor: null,
        features: [
          { name: "10 buyers" },
          { name: "1 email by tag/month" },
          { name: "Basic buyer management" },
          { name: "Email support" },
        ],
      },
      {
        priceId: process.env.STRIPE_STANDARD_PLAN_PRICE_ID || "",
        // This plan will look different on the pricing page, it will be highlighted. You can only have one plan with isFeatured: true
        isFeatured: true,
        name: PlanName.STANDARD,
        description: "For growing businesses",
        price: 9,
        priceAnchor: null,
        features: [
          { name: "500 buyers" },
          { name: "100 emails by tag/month" },
          { name: "Advanced buyer management" },
          { name: "Priority email support" },
          { name: "CSV/Excel import" },
        ],
      },
      {
        priceId: process.env.STRIPE_PRO_PLAN_PRICE_ID || "",
        name: PlanName.PRO,
        description: "For power users",
        price: 19,
        priceAnchor: null,
        features: [
          { name: "Unlimited buyers" },
          { name: "Unlimited emails" },
          { name: "Advanced analytics" },
          { name: "Priority phone support" },
          { name: "API access" },
          { name: "Custom integrations" },
        ],
      },
    ],
  },
  aws: {
    // If you use AWS S3/Cloudfront, put values in here
    bucket: "bucket-name",
    bucketUrl: `https://bucket-name.s3.amazonaws.com/`,
    cdn: "https://cdn-id.cloudfront.net/",
  },
  resend: {
    // REQUIRED — Email 'From' field to be used when sending magic login links
    fromNoReply: `ShipFast <noreply@resend.shipfa.st>`,
    // REQUIRED — Email 'From' field to be used when sending other emails, like abandoned carts, updates etc..
    fromAdmin: `Marc at ShipFast <marc@resend.shipfa.st>`,
    // Email shown to customer if they need support. Leave empty if not needed => if empty, set up Crisp above, otherwise you won't be able to offer customer support."
    supportEmail: "marc.louvion@gmail.com",
  },
  colors: {
    // REQUIRED — The DaisyUI theme to use (added to the main layout.js). Leave blank for default (light & dark mode). If you use any theme other than light/dark, you need to add it in config.tailwind.js in daisyui.themes.
    theme: "light",
    // REQUIRED — This color will be reflected on the whole app outside of the document (loading bar, Chrome tabs, etc..). By default it takes the primary color from your DaisyUI theme (make sure to update your the theme name after "data-theme=")
    // OR you can just do this to use a custom color: main: "#f37055". HEX only.
    main: themes["light"]["primary"],
  },
  auth: {
    // REQUIRED — the path to log in users. It's use to protect private routes (like /dashboard). It's used in apiClient (/libs/api.js) upon 401 errors from our API
    loginUrl: "/api/auth/signin",
    // REQUIRED — the path you want to redirect users to after a successful login (i.e. /dashboard, /private). This is normally a private page for users to manage their accounts. It's used in apiClient (/libs/api.js) upon 401 errors from our API & in ButtonSignin.js
    callbackUrl: "/dashboard",
  },
} as ConfigProps;

export default config;
