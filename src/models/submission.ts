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

  // Required for Secondary users
  grade?: number;

  // Required for University users (Bachelors/Masters/PhD)
  university?: string; // Current/previous university
  degree?: EducationLevel; // Current/previous degree level
  currentProgram?: string; // Current/previous program/major
  gpa?: number;
  gpaScale?: string;

  // Optional
  testScore?: TestScore;

  // Required - at least one application
  applications: ApplicationEntry[];
}
