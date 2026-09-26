"use client";

import { useId, useState, type FormEvent } from "react";
import { trackEvent } from "../lib/analytics-client";
import { siteConfig } from "../lib/site-config";

type FormKind =
  | "LOCATION_DETAILS"
  | "DEVELOPMENT_UPDATES"
  | "GENERAL_INQUIRY"
  | "EARLY_ACCESS"
  | "SITE_VISIT"
  | "NEWSLETTER";

type FormState = "idle" | "submitting" | "success" | "error";

const apiBase = siteConfig.apiUrl;

function formValue(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function createIdempotencyKey(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function EnquiryForm({
  kind = "GENERAL_INQUIRY",
  projectSlug,
  projectTitle,
  compact = false,
  inline = false,
}: {
  kind?: FormKind;
  projectSlug?: string;
  projectTitle?: string;
  compact?: boolean;
  inline?: boolean;
}) {
  const formId = useId();
  const [state, setState] = useState<FormState>("idle");
  const [referenceCode, setReferenceCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const isSubscription = kind === "NEWSLETTER" || kind === "EARLY_ACCESS";
  const isNewsletter = kind === "NEWSLETTER";
  const isSiteVisit = kind === "SITE_VISIT";

  const title = isNewsletter
    ? "Occasional notes from the lake"
    : kind === "EARLY_ACCESS"
      ? "Follow the future resort"
      : projectTitle
        ? `Ask about ${projectTitle}`
        : "Start a conversation";

  const submitLabel = isNewsletter
    ? "Join the newsletter"
    : kind === "EARLY_ACCESS"
      ? "Join the early-access list"
      : isSiteVisit
        ? "Request a site visit"
        : "Send enquiry";

  const consentLabel = isSubscription
    ? "I agree to receive occasional destination and development updates by email. I can unsubscribe at any time, and this is not a booking or reservation request."
    : "I agree to be contacted about this enquiry and understand that booking is not available through this form.";

  const successEvent =
    kind === "NEWSLETTER"
      ? "NEWSLETTER_JOINED"
      : kind === "EARLY_ACCESS"
        ? "EARLY_ACCESS_JOINED"
        : isSiteVisit
          ? "SITE_VISIT_REQUESTED"
          : "ENQUIRY_SUBMITTED";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setErrorMessage("");
    const form = event.currentTarget;
    const formData = new FormData(form);
    const common = {
      name: formValue(formData, "name"),
      email: formValue(formData, "email"),
      phone: formValue(formData, "phone"),
      preferredContact: formValue(formData, "preferredContact") || "email",
      projectSlug: formValue(formData, "projectSlug"),
      message: formValue(formData, "message"),
      sourcePage: window.location.pathname,
      idempotencyKey: createIdempotencyKey(),
      consent: formData.get("consent") === "on",
      website: formValue(formData, "website"),
    };

    let endpoint = "/api/v1/public/leads";
    let payload: Record<string, unknown> = { ...common, kind: "GENERAL_INQUIRY" };

    if (kind === "LOCATION_DETAILS") {
      payload = { ...common, kind: "LOCATION_DETAILS" };
    }

    if (kind === "DEVELOPMENT_UPDATES") {
      payload = { ...common, kind: "DEVELOPMENT_UPDATES" };
    }

    if (kind === "EARLY_ACCESS") {
      endpoint = "/api/v1/public/early-access";
      payload = {
        name: common.name,
        email: common.email,
        kind: "EARLY_ACCESS",
        projectSlug: common.projectSlug,
        sourcePage: common.sourcePage,
        idempotencyKey: common.idempotencyKey,
        consent: common.consent,
        website: common.website,
      };
    }

    if (kind === "NEWSLETTER") {
      endpoint = "/api/v1/public/newsletter";
      payload = {
        name: common.name,
        email: common.email,
        kind: "NEWSLETTER",
        sourcePage: common.sourcePage,
        idempotencyKey: common.idempotencyKey,
        consent: common.consent,
        website: common.website,
      };
    }

    if (isSiteVisit) {
      endpoint = "/api/v1/public/site-visit-requests";
      payload = {
        name: common.name,
        email: common.email,
        phone: common.phone,
        preferredContact: common.preferredContact,
        projectSlug: common.projectSlug,
        preferredDate: formValue(formData, "preferredDate"),
        visitorCount: formValue(formData, "visitorCount"),
        message: common.message,
        sourcePage: common.sourcePage,
        idempotencyKey: common.idempotencyKey,
        consent: common.consent,
        website: common.website,
      };
    }

    try {
      const response = await fetch(`${apiBase}${endpoint}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await response.json().catch(() => undefined);
      if (!response.ok) {
        throw new Error(body?.error?.message || "We could not send your request.");
      }
      setReferenceCode(body?.data?.referenceCode || "Received");
      setState("success");
      form.reset();
      trackEvent(successEvent, window.location.pathname, projectSlug);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "We could not send your request.");
      setState("error");
    }
  }

  const form = (
    <form
      className={`enquiry-form ${inline ? "enquiry-form--inline" : ""}`}
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="form-field">
        <label htmlFor={`${formId}-name`}>{isNewsletter ? "Name" : "Full name"}</label>
        <input id={`${formId}-name`} name="name" type="text" autoComplete="name" required maxLength={120} />
      </div>

      {isSubscription ? null : (
        <div className="form-row">
          <div className="form-field">
            <label htmlFor={`${formId}-email`}>Email address</label>
            <input
              id={`${formId}-email`}
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
            />
          </div>
          <div className="form-field">
            <label htmlFor={`${formId}-phone`}>Phone / WhatsApp</label>
            <input id={`${formId}-phone`} name="phone" type="tel" autoComplete="tel" maxLength={40} />
          </div>
        </div>
      )}

      {isNewsletter ? (
        <div className="form-field">
          <label htmlFor={`${formId}-newsletter-email`}>Email address</label>
          <input
            id={`${formId}-newsletter-email`}
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
          />
        </div>
      ) : null}

      {isSubscription ? null : (
        <div className="form-field">
          <label htmlFor={`${formId}-contact`}>Preferred contact</label>
          <select id={`${formId}-contact`} name="preferredContact" defaultValue="email">
            <option value="email">Email</option>
            <option value="phone">Phone</option>
            <option value="whatsapp">WhatsApp</option>
          </select>
        </div>
      )}

      {isSiteVisit && !projectSlug ? (
        <div className="form-field">
          <label htmlFor={`${formId}-project`}>Location of interest</label>
          <select
            id={`${formId}-project`}
            name="projectSlug"
            defaultValue="location-1-land-opportunity"
            required
          >
            <option value="location-1-land-opportunity">Location 1 / Land opportunity</option>
            <option value="location-2-active-development">Location 2 / Active development</option>
            <option value="location-3-future-resort">Location 3 / Future resort</option>
          </select>
        </div>
      ) : null}
      {projectSlug ? <input type="hidden" name="projectSlug" value={projectSlug} /> : null}

      {isSiteVisit ? (
        <div className="form-row">
          <div className="form-field">
            <label htmlFor={`${formId}-date`}>Preferred date or window</label>
            <input
              id={`${formId}-date`}
              name="preferredDate"
              type="text"
              placeholder="To be agreed with the team"
              maxLength={80}
            />
          </div>
          <div className="form-field">
            <label htmlFor={`${formId}-visitors`}>Visitors</label>
            <input
              id={`${formId}-visitors`}
              name="visitorCount"
              type="number"
              min={1}
              max={50}
              inputMode="numeric"
            />
          </div>
        </div>
      ) : null}

      {isSubscription ? (
        <p className="form-hint">
          {isNewsletter
            ? "A short, occasional note about the destination and confirmed development progress."
            : "Early access is an update list. It is not a reservation or booking."}
        </p>
      ) : (
        <div className="form-field">
          <label htmlFor={`${formId}-message`}>How can we help?</label>
          <textarea id={`${formId}-message`} name="message" rows={4} maxLength={3000} />
        </div>
      )}

      <div className="honeypot-field" aria-hidden="true">
        <label htmlFor={`${formId}-website`}>Website</label>
        <input
          id={`${formId}-website`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          maxLength={200}
        />
      </div>

      <label className="checkbox-field">
        <input name="consent" type="checkbox" required />
        <span>{consentLabel}</span>
      </label>

      {state === "error" ? (
        <p className="form-error" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <button className="button button--dark button--full" type="submit" disabled={state === "submitting"}>
        {state === "submitting" ? "Sending…" : submitLabel}
        <span aria-hidden="true">↗</span>
      </button>

      {inline ? null : (
        <p className="form-footnote">
          Your details are used to respond to this request. We do not sell or guarantee investment returns.
        </p>
      )}
    </form>
  );

  if (inline) {
    return (
      <div className="enquiry-inline">
        <p className="footer-label">Newsletter</p>
        {state === "success" ? (
          <p className="form-success-inline" role="status">
            Thank you. You are on the list for occasional updates.
          </p>
        ) : (
          form
        )}
      </div>
    );
  }

  return (
    <div className={`enquiry-card ${compact ? "enquiry-card--compact" : ""}`}>
      <div className="enquiry-card__header">
        <p className="eyebrow">Lakefront contact</p>
        <h2>{title}</h2>
        <p>Share a few details and the team can continue the conversation with context.</p>
      </div>

      {state === "success" ? (
        <div className="form-success" role="status">
          <span className="form-success__mark" aria-hidden="true">
            ✓
          </span>
          <h3>Request received</h3>
          <p>
            Your reference is <strong>{referenceCode}</strong>. A team member will follow up using the contact
            details you provided.
          </p>
          <button className="text-button" type="button" onClick={() => setState("idle")}>
            Send another enquiry
          </button>
        </div>
      ) : (
        form
      )}
    </div>
  );
}
