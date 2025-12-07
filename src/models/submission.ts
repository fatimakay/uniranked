import type { ApplicationEntry } from "./application";
export type EducationLevel = "Secondary" | "Bachelors" | "Masters" | "PhD";
export type TestScoreType = "GRE" | "SAT" | "TOEFL" | "IELTS" | "Other";

export interface TestScore {
  type: TestScoreType;
  score: number;
  otherType?: string;
}

export interface SubmissionFormData {
  educationLevel: EducationLevel;
  country: string;
  grade?: number | null;

  university?: string; // Current/previous university
  currentProgram?: string; // Current/previous program/major
  gpa?: number;
  gpaScale?: string;

  testScore?: TestScore;
  applications: ApplicationEntry[];
}
