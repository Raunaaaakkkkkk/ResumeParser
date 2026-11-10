import React from "react";
import { MapPin, GraduationCap, Award, Check } from "lucide-react";
import { WorkExperience, Education, Certification } from "../types/ats";

interface ExperienceTimelineProps {
  workExperience: WorkExperience[];
  education: Education[];
  certifications?: Certification[];
  totalYears: number;
  seniorityLevel: string;
}

export const ExperienceTimeline: React.FC<ExperienceTimelineProps> = ({
  workExperience = [],
  education = [],
  certifications = [],
  totalYears,
  seniorityLevel,
}) => {
  return (
    <div className="space-y-6">
      {/* Work History */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-200/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-6 border-b border-slate-100">
          <div>
            <h3 className="font-semibold text-slate-900 text-base">
              Verified Chronological Career Timeline
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Strictly fact-checked against resume document dates, metrics, and declared companies
            </p>
          </div>

          <div className="text-xs font-mono text-slate-500">
            <span>{totalYears} Years Total Experience</span>
            <span className="mx-2 text-slate-300" aria-hidden="true">•</span>
            <span className="text-violet-700 font-bold">{seniorityLevel}</span>
          </div>
        </div>

        <div className="space-y-6">
          {workExperience.map((exp, index) => (
            <div key={index} className="border-b border-slate-100 pb-6 last:border-b-0 last:pb-0">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-1.5">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {exp.role} <span className="text-slate-400 font-normal">at</span>{" "}
                    <span className="text-violet-700 font-bold">{exp.company}</span>
                  </h4>
                </div>
                <div className="text-xs font-mono text-slate-500 bg-slate-50 px-2.5 py-0.5 rounded-full border border-slate-200">
                  {exp.start_date} – {exp.end_date}
                  {exp.duration && <span className="ml-1.5 text-slate-400">({exp.duration})</span>}
                </div>
              </div>

              {exp.location && (
                <div className="text-xs text-slate-500 mb-2.5 flex items-center gap-1 font-mono">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{exp.location}</span>
                </div>
              )}

              {/* Achievements */}
              <ul className="space-y-1.5 my-3 text-xs text-slate-700">
                {exp.key_achievements.map((item, aIdx) => (
                  <li key={aIdx} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-violet-500 font-bold mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {/* Technologies */}
              {exp.verified_technologies && exp.verified_technologies.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-2 text-[11px] font-mono text-slate-500">
                  <span className="text-slate-400 font-semibold">Technologies:</span>
                  {exp.verified_technologies.map((tech, tIdx) => (
                    <span key={tIdx} className="text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Education & Certifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-200/80">
          <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-slate-700" />
            <span>Academic Verification</span>
          </div>
          {education.length === 0 ? (
            <p className="text-xs text-slate-500 italic">No formal education declared in document.</p>
          ) : (
            <div className="space-y-3.5">
              {education.map((edu, idx) => (
                <div key={idx} className="text-xs p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="font-semibold text-slate-900 text-sm">{edu.degree}</div>
                  <div className="text-slate-700 mt-0.5 font-medium">{edu.institution}</div>
                  {(edu.field_of_study || edu.graduation_year) && (
                    <div className="text-xs font-mono text-slate-500 mt-1.5 flex items-center gap-2 flex-wrap">
                      {edu.field_of_study && <span>{edu.field_of_study}</span>}
                      {edu.field_of_study && edu.graduation_year && (
                        <span className="text-slate-300" aria-hidden="true">•</span>
                      )}
                      {edu.graduation_year && (
                        <span className="text-slate-600">
                          {/^\d{4}$/.test(edu.graduation_year) ? `Class of ${edu.graduation_year}` : edu.graduation_year}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-200/80">
          <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Award className="w-4 h-4 text-slate-700" />
            <span>Accreditations & Certifications</span>
          </div>
          {!certifications || certifications.length === 0 ? (
            <p className="text-xs text-slate-500 italic">No formal certifications detected.</p>
          ) : (
            <div className="space-y-3.5">
              {certifications.map((cert, idx) => (
                <div key={idx} className="text-xs p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{cert.name}</span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 mt-1 pl-5">
                    {cert.issuer} {cert.year ? `· ${cert.year}` : ""}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
