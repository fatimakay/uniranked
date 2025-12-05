import {
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
  MenuItem,
  Button,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { gpaScales } from "../constants/gpaScales";
import { standardTests } from "../constants/tests";
import { useState } from "react";
import type {
  SubmissionFormData,
  EducationLevel,
  TestScoreType,
} from "../models/submission";
import type { DegreeLevel, ApplicationStatus } from "../models/application";

export default function SubmitForm() {
  const { t } = useTranslation();
  const [errors, setErrors] = useState<{
    gpa?: string;
    year?: string;
  }>({});
  const currentYear = new Date().getFullYear();

  const [formData, setFormData] = useState<SubmissionFormData>({
    educationLevel: "" as EducationLevel,
    country: "",

    // Secondary users
    grade: undefined,

    // University users
    university: undefined,
    degree: undefined,
    currentProgram: undefined,
    gpa: undefined,
    gpaScale: undefined,

    // Optional
    testScore: undefined,

    applications: [
      {
        id: crypto.randomUUID(),
        country: "",
        university: "",
        degreeLevel: "" as DegreeLevel,
        program: "",
        applicationYear: 0,
        status: "" as ApplicationStatus,
        scholarship: false,
      },
    ],
  });
  const isSecondary =
    formData.educationLevel === "Secondary" || !formData.educationLevel;
  const currentApplication = formData.applications[0];
  const currentTestScore = formData.testScore;

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
          {t("submitForm.title")}
        </Typography>
        <Typography variant="caption" sx={{ color: "#d32f2f" }}>
          * {t("submitForm.required")}
        </Typography>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: "bold" }}>
          {t("submitForm.applicantInfo")}
        </Typography>

        <Stack spacing={3} mb={3}>
          {/* Current Status */}
          <Stack direction="row" spacing={2}>
            <TextField
              required
              select
              label={t("submitForm.educationLevel")}
              value={formData.educationLevel}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  educationLevel: e.target.value as EducationLevel,
                }))
              }
              sx={{ flex: 1 }}
            >
              <MenuItem value="" disabled>
                {t("submitForm.chooseOption")}
              </MenuItem>
              <MenuItem value="Secondary">{t("submitForm.secondary")}</MenuItem>
              <MenuItem value="Bachelors">{t("submitForm.bachelors")}</MenuItem>
              <MenuItem value="Masters">{t("submitForm.masters")}</MenuItem>
              <MenuItem value="PhD">{t("submitForm.phd")}</MenuItem>
            </TextField>

            {isSecondary ? (
              <TextField
                required
                label={t("submitForm.grade")}
                sx={{ flex: 1 }}
                value={formData.grade ?? ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    grade: Number(e.target.value),
                  }))
                }
              />
            ) : (
              <>
                <TextField
                  label={t("submitForm.gpa")}
                  type="number"
                  inputProps={{ step: "0.01", min: 0 }}
                  sx={{ flex: 1 }}
                  value={formData.gpa && formData.gpa !== 0 ? formData.gpa : ""}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    const gpaValue =
                      inputValue === "" ? undefined : Number(inputValue);
                    const gpaError =
                      gpaValue !== undefined && gpaValue <= 1
                        ? t("submitForm.gpaError")
                        : undefined;
                    setErrors((prev) => ({ ...prev, gpa: gpaError }));
                    setFormData((prev) => ({
                      ...prev,
                      gpa: gpaValue,
                    }));
                  }}
                  error={!!errors.gpa}
                  helperText={errors.gpa}
                />
                <TextField
                  select
                  label={t("submitForm.gpaScale")}
                  sx={{ flex: 1 }}
                  value={formData.gpaScale ?? ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      gpaScale: Number(e.target.value),
                    }))
                  }
                >
                  <MenuItem value="" disabled>
                    {t("submitForm.chooseOption")}
                  </MenuItem>
                  {gpaScales.map((scale) => (
                    <MenuItem key={scale.value} value={scale.value}>
                      {scale.label}
                    </MenuItem>
                  ))}
                </TextField>
              </>
            )}
          </Stack>

          {/* Country - shown for both Secondary and non-Secondary */}
          <Stack direction="row" spacing={2}>
            <TextField
              required
              select
              label={t("submitForm.country")}
              sx={{ flex: 1 }}
              value={formData.country}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  country: e.target.value,
                }))
              }
            >
              <MenuItem value="" disabled>
                {t("submitForm.chooseOption")}
              </MenuItem>
            </TextField>
            {!isSecondary && (
              <TextField
                required
                select
                label={t("submitForm.university")}
                value={formData.university ?? ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    university: e.target.value,
                  }))
                }
                sx={{ flex: 2 }}
              >
                <MenuItem value="" disabled>
                  {t("submitForm.chooseOption")}
                </MenuItem>
              </TextField>
            )}
          </Stack>

          {/* Degree and Program - only for non-Secondary */}
          {!isSecondary && (
            <Stack direction="row" spacing={2}>
              <TextField
                required
                select
                label={t("submitForm.degree")}
                value={formData.degree ?? ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    degree: e.target.value as EducationLevel,
                  }))
                }
                sx={{ flex: 1 }}
              >
                <MenuItem value="" disabled>
                  {t("submitForm.chooseOption")}
                </MenuItem>
                <MenuItem value="Bachelors">
                  {t("submitForm.bachelors")}
                </MenuItem>
                <MenuItem value="Masters">{t("submitForm.masters")}</MenuItem>
                <MenuItem value="PhD">{t("submitForm.phd")}</MenuItem>
              </TextField>
              <TextField
                required
                label={t("submitForm.program")}
                value={formData.program ?? ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    program: e.target.value,
                  }))
                }
                sx={{ flex: 2 }}
              />
            </Stack>
          )}

          <Stack direction="row" spacing={2}>
            <TextField
              select
              label={t("submitForm.test")}
              value={currentTestScore?.type ?? ""}
              onChange={(e) => {
                const testType = e.target.value as TestScoreType;
                setFormData((prev) => ({
                  ...prev,
                  testScore: {
                    type: testType,
                    score: currentTestScore?.score ?? 0,
                    ...(testType === "Other" && {
                      otherType: currentTestScore?.otherType ?? "",
                    }),
                  },
                }));
              }}
              sx={{ flex: 1 }}
            >
              {standardTests.map((test) => (
                <MenuItem key={test.value} value={test.value}>
                  {test.label}
                </MenuItem>
              ))}
            </TextField>
            {currentTestScore?.type === "Other" && (
              <TextField
                label={t("submitForm.other")}
                value={currentTestScore.otherType ?? ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    testScore: prev.testScore
                      ? {
                          ...prev.testScore,
                          otherType: e.target.value,
                        }
                      : {
                          type: "Other",
                          score: 0,
                          otherType: e.target.value,
                        },
                  }))
                }
                sx={{ flex: 1 }}
              />
            )}
            <TextField
              label={t("submitForm.score")}
              type="number"
              value={
                currentTestScore?.score && currentTestScore.score !== 0
                  ? currentTestScore.score
                  : ""
              }
              onChange={(e) => {
                const inputValue = e.target.value;
                // Convert empty string to 0 for storage, but show empty in UI
                const scoreValue = inputValue === "" ? 0 : Number(inputValue);
                setFormData((prev) => ({
                  ...prev,
                  testScore: prev.testScore
                    ? {
                        ...prev.testScore,
                        score: scoreValue,
                      }
                    : {
                        type: "GRE",
                        score: scoreValue,
                      },
                }));
              }}
              sx={{ flex: 1 }}
            />
          </Stack>
        </Stack>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: "bold" }}>
          {t("submitForm.universityApplications")}
        </Typography>
        {/* uni country, uni list (dynamic based on country), degree, program,
        application year,result, scholarship */}
        <Stack spacing={3} mb={3}>
          <Stack direction="row" spacing={2} mb={3}>
            <TextField
              required
              select
              label={t("submitForm.country")}
              value={currentApplication.country}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  applications: [
                    { ...prev.applications[0], country: e.target.value },
                  ],
                }))
              }
              sx={{ flex: 1 }}
            >
              <MenuItem value="" disabled>
                {t("submitForm.chooseOption")}
              </MenuItem>
            </TextField>
            {!isSecondary && (
              <TextField
                required
                select
                label={t("submitForm.university")}
                value={currentApplication.university}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    applications: [
                      { ...prev.applications[0], university: e.target.value },
                    ],
                  }))
                }
                sx={{ flex: 2 }}
              >
                <MenuItem value="" disabled>
                  {t("submitForm.chooseOption")}
                </MenuItem>
              </TextField>
            )}
          </Stack>
          <Stack direction="row" spacing={2} mb={3}>
            <TextField
              required
              select
              label={t("submitForm.degree")}
              value={currentApplication.degreeLevel}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  applications: [
                    {
                      ...prev.applications[0],
                      degreeLevel: e.target.value as DegreeLevel,
                    },
                  ],
                }))
              }
              sx={{ flex: 2 }}
            >
              <MenuItem value="" disabled>
                {t("submitForm.chooseOption")}
              </MenuItem>
              <MenuItem value="Bachelors">{t("submitForm.bachelors")}</MenuItem>
              <MenuItem value="Masters">{t("submitForm.masters")}</MenuItem>
              <MenuItem value="PhD">{t("submitForm.phd")}</MenuItem>
            </TextField>
            <TextField
              required
              label={t("submitForm.program")}
              value={currentApplication.program}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  applications: [
                    { ...prev.applications[0], program: e.target.value },
                  ],
                }))
              }
              sx={{ flex: 2 }}
            />
            <TextField
              required
              label={t("submitForm.year")}
              type="number"
              value={
                currentApplication.applicationYear &&
                currentApplication.applicationYear !== 0
                  ? currentApplication.applicationYear
                  : ""
              }
              onChange={(e) => {
                const inputValue = e.target.value;
                const yearValue = inputValue === "" ? 0 : Number(inputValue);
                let yearError: string | undefined;

                if (yearValue !== 0) {
                  const maxYear = currentYear + 1;
                  if (yearValue < 1900 || yearValue > maxYear) {
                    yearError = t("submitForm.yearError");
                  }
                }

                setErrors((prev) => ({ ...prev, year: yearError }));
                setFormData((prev) => ({
                  ...prev,
                  applications: [
                    {
                      ...prev.applications[0],
                      applicationYear: yearValue,
                    },
                  ],
                }));
              }}
              error={!!errors.year}
              helperText={errors.year}
              sx={{ flex: 1 }}
            />
          </Stack>
          <Stack direction="row" spacing={2} mb={3}>
            <TextField
              label={t("submitForm.applicationDate")}
              type="date"
              value={
                currentApplication.submissionDate
                  ? currentApplication.submissionDate.split("T")[0]
                  : ""
              }
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  applications: [
                    {
                      ...prev.applications[0],
                      submissionDate: e.target.value
                        ? new Date(e.target.value).toISOString()
                        : undefined,
                    },
                  ],
                }))
              }
              sx={{ flex: 1 }}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              label={t("submitForm.decisionDate")}
              type="date"
              value={
                currentApplication.decisionDate
                  ? currentApplication.decisionDate.split("T")[0]
                  : ""
              }
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  applications: [
                    {
                      ...prev.applications[0],
                      decisionDate: e.target.value
                        ? new Date(e.target.value).toISOString()
                        : undefined,
                    },
                  ],
                }))
              }
              sx={{ flex: 1 }}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Stack>
          <Stack direction="row" spacing={2} mb={3}>
            <TextField
              required
              select
              label={t("submitForm.status")}
              value={currentApplication.status}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  applications: [
                    {
                      ...prev.applications[0],
                      status: e.target.value as ApplicationStatus,
                    },
                  ],
                }))
              }
              sx={{ flex: 1 }}
            >
              <MenuItem value="" disabled>
                {t("submitForm.chooseOption")}
              </MenuItem>
              <MenuItem value="Accepted">{t("submitForm.accepted")}</MenuItem>
              <MenuItem value="Rejected">{t("submitForm.rejected")}</MenuItem>
              <MenuItem value="Waitlisted">
                {t("submitForm.waitlisted")}
              </MenuItem>
            </TextField>
            <TextField
              select
              label={t("submitForm.scholarship")}
              value={currentApplication.scholarship ? "Yes" : "No"}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  applications: [
                    {
                      ...prev.applications[0],
                      scholarship: e.target.value === "Yes",
                    },
                  ],
                }))
              }
              sx={{ flex: 1 }}
            >
              <MenuItem value="Yes">{t("submitForm.yes")}</MenuItem>
              <MenuItem value="No">{t("submitForm.no")}</MenuItem>
            </TextField>
          </Stack>
        </Stack>
        <Button variant="contained" color="secondary" size="large">
          Submit
        </Button>

        {/* Debug Section - Remove this before production */}
        <Paper sx={{ p: 2, mt: 3, bgcolor: "#f5f5f5" }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Debug: Current Form State
          </Typography>
          <pre style={{ fontSize: "12px", overflow: "auto" }}>
            {JSON.stringify(formData, null, 2)}
          </pre>
        </Paper>
      </Paper>
    </Container>
  );
}
