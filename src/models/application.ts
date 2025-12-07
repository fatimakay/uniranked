export type ApplicationStatus = "Accepted" | "Rejected" | "Waitlisted";
export type DegreeLevel = "Bachelors" | "Masters" | "PhD";

export interface ApplicationEntry {
  // Required
  id: string;
  country: string;
  university: string;
  degree: DegreeLevel;
  program: string;
  applicationYear: number;
  status: ApplicationStatus;

  // Optional
  submissionDate?: string; // ISO format
  decisionDate?: string; // ISO format
  scholarship?: boolean;
}
