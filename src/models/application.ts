export type ApplicationStatus = "Accepted" | "Rejected" | "Waitlisted";
export type DegreeLevel = "Bachelors" | "Masters" | "PhD";

export interface ApplicationEntry {
  university: string;
  degreeLevel: DegreeLevel;
  program: string;
  major: string;
  year: number;
  status: ApplicationStatus;
  submissionDate?: string; // ISO format
  decisionDate?: string; // ISO format
  scholarship?: string;
}
