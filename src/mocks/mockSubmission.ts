import type { SubmissionFormData } from "../models/submission";

export const mockSubmission: SubmissionFormData = {
  educationLevel: "Bachelors",
  country: "USA",
  grade: null,

  university: "MIT",
  currentProgram: "Computer Science",
  gpa: 3.82,
  gpaScale: "4.0",

  testScore: {
    type: "GRE",
    score: 327,
  },

  applications: [
    {
      id: crypto.randomUUID(),
      country: "USA",
      university: "MIT",
      degree: "Masters",
      program: "Artificial Intelligence",
      applicationYear: 2025,
      status: "Accepted",
      scholarship: true,
      submissionDate: new Date("2024-11-01").toISOString(),
      decisionDate: new Date("2025-02-15").toISOString(),
    },
  ],
};
