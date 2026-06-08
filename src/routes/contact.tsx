import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import { getRequestUrl } from "@tanstack/react-start/server";
import { Section, Eyebrow } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, CalendarHeart, EnvelopeSimple as Mail, Lock, Phone } from "@/components/icons";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { FormEvent, useState } from "react";
import { z } from "zod";
import { buildSeo } from "@/lib/seo";

declare const process: {
  env: Record<string, string | undefined>;
};

const contactFormSchema = z.object({
  parent: z.string().trim().min(1, "Parent name is required.").max(120),
  email: z.string().trim().email("A valid email is required.").max(254),
  phone: z.string().trim().max(50).optional(),
  grade: z.string().trim().max(80).optional(),
  subject: z.string().trim().max(160).optional(),
  msg: z.string().trim().max(2000).optional(),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const CONTACT_TO_EMAIL = "info@fromthehearttutoring.com";
const CONTACT_SITE_URL = "https://fromthehearttutoring.com";
const BRAND_NAME = "From the Heart Tutoring";

const sendContactEmail = createServerFn({ method: "POST" })
  .inputValidator((data: ContactFormData) => contactFormSchema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env.RESEND_API_KEY;

    let siteUrl = CONTACT_SITE_URL;
    try {
      const url = getRequestUrl({ xForwardedHost: true, xForwardedProto: true });
      siteUrl = url.origin;
    } catch {
      siteUrl = process.env.CONTACT_SITE_URL ?? CONTACT_SITE_URL;
    }

    const toEmail = process.env.CONTACT_TO_EMAIL ?? CONTACT_TO_EMAIL;
    const fromEmail =
      process.env.RESEND_FROM_EMAIL ?? "From the Heart Tutoring <info@fromthehearttutoring.com>";

    const logoUrl = buildAbsoluteUrl(siteUrl, "logo-full.png");
    if (!apiKey) {
      throw new Error("Email is not configured. Missing RESEND_API_KEY.");
    }

    const submittedAt = new Date().toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "America/Chicago",
    });

    const fields: EmailField[] = [
      ["Parent name", data.parent],
      ["Email", data.email],
      ["Phone", data.phone || "Not provided"],
      ["Student grade", data.grade || "Not provided"],
      ["Subject(s)", data.subject || "Not provided"],
      ["Message", data.msg || "Not provided"],
      ["Submitted", `${submittedAt} CT`],
    ];

    const detailText = fields.map(([label, value]) => `${label}: ${value}`).join("\n");

    await Promise.all([
      sendResendEmail({
        apiKey,
        from: fromEmail,
        to: [toEmail],
        replyTo: data.email,
        subject: `New tutoring request: ${data.parent} (${data.subject || "General inquiry"})`,
        text: `A new tutoring request was submitted.\n\n${detailText}`,
        html: buildBusinessNotificationEmail({
          fields,
          parentName: data.parent,
          parentEmail: data.email,
          logoUrl,
          siteUrl,
        }),
      }),
      sendResendEmail({
        apiKey,
        from: fromEmail,
        to: [data.email],
        replyTo: toEmail,
        subject: "We received your tutoring request",
        text: `Hi ${data.parent},\n\nThanks for reaching out to From the Heart Tutoring. We received your request and will reply within one business day.\n\nHere is a copy of what you sent:\n\n${detailText}`,
        html: buildParentConfirmationEmail({
          fields,
          contactEmail: toEmail,
          parentName: data.parent,
          logoUrl,
          siteUrl,
        }),
      }),
    ]);

    return { success: true };
  });

async function sendResendEmail({
  apiKey,
  from,
  to,
  replyTo,
  subject,
  text,
  html,
}: {
  apiKey: string;
  from: string;
  to: string[];
  replyTo: string;
  subject: string;
  text: string;
  html: string;
}) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: replyTo,
      subject,
      text,
      html,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Email provider rejected the message: ${errorText}`);
  }
}

type EmailField = [label: string, value: string];

function buildBusinessNotificationEmail({
  fields,
  parentName,
  parentEmail,
  logoUrl,
  siteUrl,
}: {
  fields: EmailField[];
  parentName: string;
  parentEmail: string;
  logoUrl?: string;
  siteUrl: string;
}) {
  return buildEmailLayout({
    logoUrl,
    siteUrl,
    preheader: `New lead: ${parentName}`,
    eyebrow: "Action Required",
    title: "New session request",
    intro:
      "A new family has reached out via the website. Review their details below and reply to this email to contact them directly.",
    cta: {
      href: `mailto:${parentEmail}`,
      label: "Reply to parent",
    },
    detailsTitle: "Lead Information",
    fields,
    footerNote: "This lead was generated from the From the Heart Tutoring contact form.",
  });
}

function buildParentConfirmationEmail({
  contactEmail,
  fields,
  parentName,
  logoUrl,
  siteUrl,
}: {
  contactEmail: string;
  fields: EmailField[];
  parentName: string;
  logoUrl?: string;
  siteUrl: string;
}) {
  const sections = [
    {
      title: "What happens next?",
      content: `<p style="margin:0;font-size:15px;line-height:24px;color:#6f625f;">
        1. <strong>Review:</strong> We'll look over your student's needs and grade level.<br />
        2. <strong>Match:</strong> We'll identify the best tutor for your specific goals.<br />
        3. <strong>Connect:</strong> We'll reach out (usually within one business day) to find a time that works for you.
      </p>`,
    },
    {
      title: "Why parents love us",
      content: `<p style="margin:0;font-size:15px;line-height:24px;color:#6f625f;">
        From the Heart Tutoring is committed to 1-on-1 personalized learning that builds confidence. Our virtual sessions are flexible, engaging, and designed to help every student thrive.
      </p>`,
    },
  ];

  return buildEmailLayout({
    logoUrl,
    siteUrl,
    preheader: "We've received your request",
    eyebrow: "Thank You",
    title: `Hi ${parentName}, let's get started.`,
    intro:
      "We've received your tutoring request and we're already looking for the perfect match for your student. You can expect a personal follow-up from us within one business day.",
    cta: {
      href: `mailto:${contactEmail}`,
      label: "Have a question? Email us",
    },
    detailsTitle: "Summary of your request",
    fields,
    sections,
    footerNote:
      "If you need to update any information, simply reply to this email and we'll take care of it.",
  });
}

function buildEmailLayout({
  logoUrl,
  heroUrl,
  siteUrl,
  preheader,
  eyebrow,
  title,
  intro,
  cta,
  detailsTitle,
  fields,
  sections = [],
  footerNote,
}: {
  logoUrl?: string;
  heroUrl?: string;
  siteUrl: string;
  preheader: string;
  eyebrow: string;
  title: string;
  intro: string;
  cta: { href: string; label: string };
  detailsTitle: string;
  fields: EmailField[];
  sections?: { title: string; content: string }[];
  footerNote: string;
}) {
  const brand = logoUrl
    ? `<img src="${escapeHtml(logoUrl)}" width="200" height="54" alt="${BRAND_NAME}" border="0" style="display:block;border:0;width:200px;max-width:200px;height:auto;outline:none;text-decoration:none;" />`
    : `<span style="font-family:Georgia,'Times New Roman',serif;font-size:20px;line-height:24px;font-weight:700;color:#332725;">${BRAND_NAME}</span>`;

  const heroImage = heroUrl
    ? `<tr>
        <td style="padding:0;">
          <img src="${escapeHtml(heroUrl)}" width="640" alt="Tutoring session" border="0" style="display:block;border:0;width:100%;max-width:640px;height:auto;line-height:100%;outline:none;text-decoration:none;" />
        </td>
      </tr>`
    : "";

  const extraSections = sections
    .map(
      (s) => `
    <tr>
      <td style="padding:32px 40px 0;">
        <h3 style="margin:0 0 12px;font-family:Georgia,'Times New Roman',serif;font-size:18px;line-height:24px;font-weight:700;color:#332725;">${escapeHtml(s.title)}</h3>
        ${s.content}
      </td>
    </tr>
  `,
    )
    .join("");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(preheader)}</title>
  </head>
  <body style="margin:0;padding:0;background-color:#fffdfb;color:#332725;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(preheader)}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#fffdfb;margin:0;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;max-width:640px;background-color:#ffffff;border:1px solid #eadbd6;border-radius:16px;overflow:hidden;box-shadow:0 8px 24px rgba(69,38,34,0.06);">
            <tr>
              <td style="padding:24px 40px;background-color:#fffdfb;border-bottom:1px solid #eadbd6;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td align="left">
                      <a href="${escapeHtml(siteUrl)}" style="display:block;text-decoration:none;">${brand}</a>
                    </td>
                    <td align="right" style="font-size:11px;line-height:16px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#ba3d35;">
                      Virtual Tutoring
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            ${heroImage}
            <tr>
              <td style="padding:40px 40px 0;">
                <p style="margin:0 0 12px;font-size:12px;line-height:16px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#ba3d35;">${escapeHtml(eyebrow)}</p>
                <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:28px;line-height:36px;font-weight:700;color:#332725;">${escapeHtml(title)}</h1>
                <p style="margin:16px 0 0;font-size:16px;line-height:26px;color:#6f625f;">${escapeHtml(intro)}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:32px 40px 0;">
                <a href="${escapeHtml(cta.href)}" style="display:inline-block;background-color:#ba3d35;color:#ffffff;text-decoration:none;border-radius:30px;padding:14px 28px;font-size:14px;line-height:20px;font-weight:700;box-shadow:0 4px 12px rgba(186,61,53,0.2);">${escapeHtml(cta.label)}</a>
              </td>
            </tr>
            ${extraSections}
            <tr>
              <td style="padding:40px 40px;">
                <div style="background-color:#fffdfb;border:1px solid #eadbd6;border-radius:12px;overflow:hidden;">
                  <div style="padding:16px 20px;background-color:#f8e6e3;border-bottom:1px solid #eadbd6;font-size:14px;line-height:20px;font-weight:700;color:#332725;">${escapeHtml(detailsTitle)}</div>
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                    ${fields.map(renderEmailFieldRow).join("")}
                  </table>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:32px 40px;background-color:#fff8f7;border-top:1px solid #eadbd6;">
                <p style="margin:0;font-size:13px;line-height:20px;color:#766967;">${escapeHtml(footerNote)}</p>
                <p style="margin:12px 0 0;font-size:13px;line-height:20px;color:#766967;">
                  <a href="${escapeHtml(siteUrl)}" style="color:#ba3d35;text-decoration:underline;">Visit our website</a>
                  <span style="padding:0 8px;color:#eadbd6;">&bull;</span>
                  <a href="mailto:${CONTACT_TO_EMAIL}" style="color:#ba3d35;text-decoration:underline;">Contact Support</a>
                </p>
              </td>
            </tr>
          </table>
          <p style="margin:24px 0 0;font-size:12px;line-height:18px;color:#a39794;text-align:center;">
            &copy; ${new Date().getFullYear()} ${BRAND_NAME}. All rights reserved.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function renderEmailFieldRow([label, value]: EmailField) {
  return `<tr>
    <td style="width:34%;padding:14px 20px;border-bottom:1px solid #eadbd6;vertical-align:top;font-size:12px;line-height:18px;font-weight:700;color:#766967;background-color:#ffffff;">${escapeHtml(label)}</td>
    <td style="padding:14px 20px;border-bottom:1px solid #eadbd6;vertical-align:top;font-size:14px;line-height:22px;color:#332725;background-color:#ffffff;">${escapeHtml(value).replace(/\n/g, "<br />")}</td>
  </tr>`;
}

function buildAbsoluteUrl(baseUrl: string, path: string) {
  return `${baseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export const Route = createFileRoute("/contact")({
  head: () => ({
    ...buildSeo({
      title: "Book an Online Tutoring Session | From the Heart Tutoring",
      description:
        "Book a one-on-one online tutoring session or ask a question. From the Heart Tutoring helps K-12 and college students with caring virtual support.",
      path: "/contact",
    }),
  }),
  component: ContactPage,
});

function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [formStatus, setFormStatus] = useState<
    { type: "success" | "error"; message: string } | null
  >(null);
  const submitContact = useServerFn(sendContactEmail);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    setLoading(true);
    setFormStatus(null);

    try {
      await submitContact({
        data: {
          parent: String(formData.get("parent") ?? ""),
          email: String(formData.get("email") ?? ""),
          phone: String(formData.get("phone") ?? ""),
          grade: String(formData.get("grade") ?? ""),
          subject: String(formData.get("subject") ?? ""),
          msg: String(formData.get("msg") ?? ""),
        },
      });

      form.reset();
      setFormStatus({
        type: "success",
        message: "Thanks! We'll be in touch within one business day. A receipt was sent to your email.",
      });
      toast.success(
        "Thanks! We'll be in touch within one business day. A receipt was sent to your email.",
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "We couldn't send your request. Please try again.";

      setFormStatus({ type: "error", message });
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Toaster richColors position="top-center" />
      <Section className="pt-12 md:pt-20">
        <div className="grid gap-12 md:grid-cols-5">
          <div className="md:col-span-2">
            <Eyebrow>Let&rsquo;s talk</Eyebrow>
            <h1 className="mt-5 text-4xl font-semibold leading-tight md:text-5xl">
              Book your first session.
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">
              Tell us a little about your student and we&rsquo;ll match you with the right tutor.
              Most families hear back the same day.
            </p>
            <div className="mt-8 space-y-4">
              <a
                href="mailto:info@fromthehearttutoring.com"
                className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition hover:border-primary/40"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Mail className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-medium">Email us</p>
                  <p className="text-sm text-muted-foreground">info@fromthehearttutoring.com</p>
                </div>
              </a>
              <a
                href="tel:5129666064"
                className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition hover:border-primary/40"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Phone className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-medium">Call or text</p>
                  <p className="text-sm text-muted-foreground">(512) 966-6064</p>
                </div>
              </a>
              <Link
                to="/portal"
                className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition hover:border-primary/40"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Lock className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium">Existing student? Sign in</p>
                  <p className="text-sm text-muted-foreground">
                    Use the Student Portal to schedule.
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            </div>
          </div>

          <div className="md:col-span-3">
            <form
              onSubmit={onSubmit}
              aria-busy={loading}
              aria-describedby={formStatus ? "contact-form-status" : undefined}
              className="rounded-3xl border border-border bg-card p-7 shadow-sm md:p-9"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <CalendarHeart className="h-5 w-5" />
                </span>
                <h2 className="text-xl font-semibold">Tell us about your student</h2>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="parent">Parent name</Label>
                  <Input
                    id="parent"
                    name="parent"
                    required
                    className="mt-1.5"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="mt-1.5"
                    placeholder="you@email.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" className="mt-1.5" placeholder="Optional" />
                </div>
                <div>
                  <Label htmlFor="grade">Student grade</Label>
                  <Input id="grade" name="grade" className="mt-1.5" placeholder="e.g. 10th grade" />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="subject">Subject(s) needed</Label>
                  <Input
                    id="subject"
                    name="subject"
                    className="mt-1.5"
                    placeholder="e.g. Algebra II, SAT prep"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="msg">Anything else we should know?</Label>
                  <Textarea
                    id="msg"
                    name="msg"
                  className="mt-1.5 min-h-28"
                    placeholder="Goals, schedule, learning style…"
                  />
                </div>
              </div>
              {formStatus && (
                <p
                  id="contact-form-status"
                  role={formStatus.type === "error" ? "alert" : "status"}
                  className={`mt-5 rounded-xl border px-4 py-3 text-sm ${
                    formStatus.type === "error"
                      ? "border-destructive/30 bg-destructive/10 text-destructive"
                      : "border-primary/20 bg-primary/10 text-primary"
                  }`}
                >
                  {formStatus.message}
                </p>
              )}
              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="mt-6 w-full rounded-full"
              >
                {loading ? "Sending…" : "Book a Session"}
              </Button>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                No commitment — we&rsquo;ll reach out to find a time that works.
              </p>
            </form>
          </div>
        </div>
      </Section>
    </>
  );
}
