import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Lock, Sparkles, Wand2 } from "lucide-react";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";

import { JourneySteps } from "@/components/pathway/JourneySteps";
import { Notice, Page, PageHeader } from "@/components/pathway/common";
import { TagInput } from "@/components/pathway/TagInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DEMO_PROFILE } from "@/lib/pathway/demo-data";
import { usePathway } from "@/lib/pathway/store";
import { PROFESSIONAL_FIELDS, WORK_TYPES, type TalentProfile } from "@/lib/pathway/types";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Talent Profile — Pathway Nexus" },
      { name: "description", content: "Share your professional experience, skills and goals to generate your AI Skills Passport." },
      { property: "og:title", content: "Create your Talent Profile — Pathway Nexus" },
      { property: "og:description", content: "Turn your experience into a structured skills profile in a few minutes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProfilePage,
});

const EMPTY: TalentProfile = {
  fullName: "",
  countryOfResidence: "",
  professionalField: "",
  yearsOfExperience: 0,
  education: "",
  skills: [],
  languages: [],
  previousRoles: "",
  careerGoal: "",
  preferredWorkType: "",
};

const SKILL_SUGGESTIONS: Record<string, string[]> = {
  "Finance & Accounting": ["Financial reporting", "Bookkeeping", "Budgeting", "Excel", "Payroll", "Audit preparation"],
  Healthcare: ["Patient care", "Triage", "Health education", "Medical terminology"],
  Engineering: ["Civil engineering", "AutoCAD", "Site supervision", "Project management"],
  "Information Technology": ["JavaScript", "React", "Networking", "Troubleshooting", "SQL"],
  Education: ["Teaching", "Lesson planning", "Classroom management", "Curriculum design"],
  "Humanitarian & NGO": ["Project management", "Monitoring & evaluation", "Reporting", "Stakeholder engagement"],
  "Logistics & Supply Chain": ["Procurement", "Inventory management", "Fleet coordination"],
  Agriculture: ["Crop management", "Training", "Data collection"],
  "Business & Administration": ["Administration", "Microsoft Office", "Customer service", "Scheduling"],
  Legal: ["Contract drafting", "Legal research", "Compliance"],
};

type Errors = Partial<Record<keyof TalentProfile, string>>;

function validate(p: TalentProfile): Errors {
  const e: Errors = {};
  if (!p.fullName.trim()) e.fullName = "Please enter your name.";
  if (!p.countryOfResidence.trim()) e.countryOfResidence = "Please enter your country of residence.";
  if (!p.professionalField) e.professionalField = "Please choose your professional field.";
  if (p.yearsOfExperience < 0 || p.yearsOfExperience > 60) e.yearsOfExperience = "Enter a number between 0 and 60.";
  if (!p.skills.length) e.skills = "Add at least one professional skill.";
  if (!p.preferredWorkType) e.preferredWorkType = "Please choose a preferred work type.";
  return e;
}

const selectClass =
  "flex h-11 w-full rounded-lg border border-input bg-card px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-[invalid=true]:border-destructive";

function ProfilePage() {
  const { profile, hydrated, saveProfileAndAnalyze } = usePathway();
  const navigate = useNavigate();
  const [form, setForm] = useState<TalentProfile>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (hydrated && profile) setForm(profile);
  }, [hydrated, profile]);

  const set = <K extends keyof TalentProfile>(k: K, v: TalentProfile[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const onSubmit = (ev: FormEvent) => {
    ev.preventDefault();
    const e = validate(form);
    setErrors(e);
    const first = Object.keys(e)[0];
    if (first) {
      document.getElementById(first)?.focus();
      return;
    }
    saveProfileAndAnalyze({ ...form, fullName: form.fullName.trim(), countryOfResidence: form.countryOfResidence.trim() });
    void navigate({ to: "/passport" });
  };

  return (
    <Page>
      <JourneySteps current="/profile" />
      <PageHeader
        eyebrow="Step 1 · Talent profile"
        title="Tell us what you already know how to do."
        description="Describe your professional experience in your own words. We'll use it to build your Skills Passport — no CV upload needed."
        actions={
          <Button type="button" variant="outline" onClick={() => { setForm(DEMO_PROFILE); setErrors({}); }}>
            <Wand2 /> Fill with demo profile
          </Button>
        }
      />

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
        <form onSubmit={onSubmit} noValidate className="space-y-10">
          <Section title="About you" number="01">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="fullName" label="Full name" error={errors.fullName}>
                <Input id="fullName" className="h-11" value={form.fullName} onChange={(e) => set("fullName", e.target.value)} autoComplete="name" aria-invalid={Boolean(errors.fullName)} aria-describedby={errors.fullName ? "fullName-error" : undefined} />
              </Field>
              <Field id="countryOfResidence" label="Country of residence" error={errors.countryOfResidence}>
                <Input id="countryOfResidence" className="h-11" value={form.countryOfResidence} onChange={(e) => set("countryOfResidence", e.target.value)} placeholder="e.g. Kenya" autoComplete="country-name" aria-invalid={Boolean(errors.countryOfResidence)} aria-describedby={errors.countryOfResidence ? "countryOfResidence-error" : undefined} />
              </Field>
            </div>
          </Section>

          <Section title="Your profession" number="02">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="professionalField" label="Professional field" error={errors.professionalField}>
                <select id="professionalField" className={selectClass} value={form.professionalField} onChange={(e) => set("professionalField", e.target.value as TalentProfile["professionalField"])} aria-invalid={Boolean(errors.professionalField)}>
                  <option value="">Select a field</option>
                  {PROFESSIONAL_FIELDS.map((f) => <option key={f}>{f}</option>)}
                </select>
              </Field>
              <Field id="yearsOfExperience" label="Years of experience" error={errors.yearsOfExperience}>
                <Input id="yearsOfExperience" type="number" min={0} max={60} className="h-11" value={form.yearsOfExperience} onChange={(e) => set("yearsOfExperience", Number(e.target.value) || 0)} aria-invalid={Boolean(errors.yearsOfExperience)} />
              </Field>
            </div>
            <Field id="education" label="Education" hint="Highest degree, diploma or training — and where you studied.">
              <Input id="education" className="h-11" value={form.education} onChange={(e) => set("education", e.target.value)} placeholder="e.g. BSc Accounting, University of Khartoum" />
            </Field>
            <Field id="skills" label="Professional skills" hint="Press Enter after each skill." error={errors.skills}>
              <TagInput id="skills" value={form.skills} onChange={(v) => set("skills", v)} placeholder="e.g. Financial reporting" suggestions={SKILL_SUGGESTIONS[form.professionalField] ?? []} invalid={Boolean(errors.skills)} {...(errors.skills ? { describedBy: "skills-error" } : {})} />
            </Field>
            <Field id="languages" label="Languages" hint="Include your level if helpful, e.g. “German (B1)”.">
              <TagInput id="languages" value={form.languages} onChange={(v) => set("languages", v)} placeholder="e.g. Arabic" suggestions={["English", "Arabic", "French", "Swahili", "Spanish"]} />
            </Field>
            <Field id="previousRoles" label="Previous roles" hint="Job titles, type of organisation, and what you were responsible for.">
              <Textarea id="previousRoles" rows={5} value={form.previousRoles} onChange={(e) => set("previousRoles", e.target.value)} placeholder="e.g. Senior Accountant at a trading company (4 years) — month-end close, payroll, audit preparation." />
            </Field>
          </Section>

          <Section title="Where you want to go" number="03">
            <Field id="careerGoal" label="Career goal">
              <Textarea id="careerGoal" rows={3} value={form.careerGoal} onChange={(e) => set("careerGoal", e.target.value)} placeholder="e.g. Work in NGO finance or grants management" />
            </Field>
            <Field id="preferredWorkType" label="Preferred work type" error={errors.preferredWorkType}>
              <div id="preferredWorkType" tabIndex={-1} role="radiogroup" aria-labelledby="preferredWorkType-label" className="flex flex-wrap gap-2">
                {WORK_TYPES.map((w) => (
                  <button
                    key={w}
                    type="button"
                    role="radio"
                    aria-checked={form.preferredWorkType === w}
                    onClick={() => set("preferredWorkType", w)}
                    className="rounded-full border px-4 py-2 text-sm transition-colors hover:border-primary aria-checked:border-primary aria-checked:bg-primary aria-checked:text-primary-foreground"
                  >
                    {w}
                  </button>
                ))}
              </div>
            </Field>
          </Section>

          <div className="flex flex-col gap-3 border-t pt-8 sm:flex-row sm:items-center">
            <Button type="submit" size="lg">
              <Sparkles /> Generate my Skills Passport
            </Button>
            <p className="text-sm text-muted-foreground">Takes about 30 seconds. You can edit your profile any time.</p>
          </div>
        </form>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border bg-card p-6">
            <Lock className="size-5 text-primary" aria-hidden="true" />
            <h2 className="mt-3 text-xl font-medium">Your privacy</h2>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
              <li>We only ask for professional information.</li>
              <li>Please don't include ID numbers, legal or immigration status, addresses or health details.</li>
              <li>Your profile is saved only in this browser. Your skills details are sent to our AI service to generate your analysis and are not shown to partners with your name.</li>
            </ul>
          </div>
          <Notice>
            The AI analysis is an assessment to guide you. It does not verify your qualifications.
          </Notice>
        </aside>
      </div>
    </Page>
  );
}

function Section({ title, number, children }: { title: string; number: string; children: ReactNode }) {
  return (
    <fieldset className="space-y-5">
      <legend className="mb-5 flex items-baseline gap-3">
        <span className="font-mono text-xs text-muted-foreground">{number}</span>
        <span className="font-display text-2xl font-medium">{title}</span>
      </legend>
      {children}
    </fieldset>
  );
}

function Field({ id, label, hint, error, children }: { id: string; label: string; hint?: string; error?: string | undefined; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id === "preferredWorkType" ? undefined : id} id={`${id}-label`} className="text-sm font-semibold">
        {label}
      </Label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-destructive" role="alert">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}
