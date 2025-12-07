export type ApplicationStatus = "Accepted" | "Rejected" | "Waitlisted";
export type DegreeLevel = "Bachelors" | "Masters" | "PhD";

export interface ApplicationEntry {
  id: string;
  country: string;
  university: string;
  degree: DegreeLevel;
  program: string;
  applicationYear: number;
  status: ApplicationStatus;
  submissionDate?: string; // ISO format
  decisionDate?: string;
  scholarship?: boolean;
}
