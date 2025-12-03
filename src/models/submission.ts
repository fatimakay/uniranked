import type { ApplicationEntry } from "./application";
export type EducationLevel = "Secondary" | "Bachelors" | "Masters" | "PhD";
export type TestScoreType = "GRE" | "SAT" | "TOEFL" | "IELTS" | "Other";

export interface TestScore {
  type: TestScoreType;
  score: number;
  otherType?: string; // required if type === "Other"
}

export interface UndergraduateData {
  educationLevel: EducationLevel;
  major?: string;
  grade: number;
  applications: ApplicationEntry[];
}

export interface GraduateData {
  educationLevel: EducationLevel;
  major?: string;
  gpa: number;
  gpaScale?: number;
  testScores?: TestScore[];
  applications: ApplicationEntry[];
}

export type SubmissionFormData = UndergraduateData | GraduateData;
