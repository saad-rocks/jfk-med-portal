import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Headphones, GraduationCap } from "lucide-react";

// eslint-disable-next-line no-unused-vars
type NavigateHandler = (path: string) => void;

interface StudentSupportProps {
  onNavigate: NavigateHandler;
}

export function StudentSupport({ onNavigate }: StudentSupportProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-800">
          <Headphones className="h-5 w-5 text-blue-500" aria-hidden="true" />
          Support & Resources
        </CardTitle>
        <p className="text-sm text-slate-500">
          Quick access to help, advising, and campus resources.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <section className="rounded-2xl border border-slate-200/70 bg-white px-4 py-4">
          <h3 className="text-sm font-semibold text-slate-800">Academic Advisor</h3>
          <p className="mt-1 text-sm text-slate-500">
            Reach out to your advisor for curriculum planning or career guidance.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-600">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
              <GraduationCap className="h-4 w-4" aria-hidden="true" />
              MD Program Office
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate("/profile-setup")}
            >
              Message Advisor
            </Button>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200/70 bg-white px-4 py-4">
          <h3 className="text-sm font-semibold text-slate-800">Student Services</h3>
          <ul className="mt-2 list-disc space-y-2 pl-4 text-sm text-slate-600">
            <li>
              Schedule immunizations or compliance updates in
              {' '}
              <button
                type="button"
                className="font-medium text-blue-600 underline"
                onClick={() => onNavigate("/immunizations")}
              >
                Immunizations
              </button>
            </li>
            <li>
              Track clinical hours in
              {' '}
              <button
                type="button"
                className="font-medium text-blue-600 underline"
                onClick={() => onNavigate("/clinical")}
              >
                Clinical Rotations
              </button>
            </li>
            <li>
              Update personal details in
              {' '}
              <button
                type="button"
                className="font-medium text-blue-600 underline"
                onClick={() => onNavigate("/settings")}
              >
                Settings
              </button>
            </li>
          </ul>
        </section>

        <section className="rounded-2xl border border-slate-200/70 bg-slate-50/80 px-4 py-4 text-sm text-slate-600">
          <p>
            Need technical assistance? Visit the <button type="button" className="font-medium text-blue-600 underline" onClick={() => onNavigate("/announcements")}>Help Center</button> or email
            <a className="ml-1 font-medium text-blue-600" href="mailto:support@jfkmed.edu">support@jfkmed.edu</a>.
          </p>
        </section>
      </CardContent>
    </Card>
  );
}
