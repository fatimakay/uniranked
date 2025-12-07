import {
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
  MenuItem,
  Button,
  Box,
  Autocomplete,
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
import { db } from "../firebase/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useUniversities } from "../hooks/useUniversities";
import { useCountries } from "../hooks/useCountries";
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

    grade: null,

    university: undefined,
    currentProgram: undefined,
    gpa: undefined,
    gpaScale: undefined,

    testScore: undefined,

    applications: [
      {
        id: crypto.randomUUID(),
        country: "",
        university: "",
        degree: "" as DegreeLevel,
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    countries,
    loading: countryLoading,
    error: countryError,
  } = useCountries();
  const {
    universities,
    loading: uniLoading,
    error: uniError,
  } = useUniversities(formData.country);
  const {
    universities: appUniversities,
    loading: appUniLoading,
    error: appUniError,
  } = useUniversities(currentApplication.country);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      // TODO: Basic frontend validation

      if (!formData.applications[0].university) {
        throw new Error("At least one university application is required");
      }

      // Submit to Firestore
      await addDoc(collection(db, "submissions"), {
        ...formData,
        createdAt: serverTimestamp(),
      });

      console.log("✅ Submission successful");
      setSubmitSuccess(true);

      // TODO: reset form after submit or give success page with check mark
      // setFormData(INITIAL_STATE);
      //TODO: FIX LINT ERROR
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("❌ Submit failed:", err.message);
      setSubmitError(err.message || "Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
          {t("submitForm.title")}
        </Typography>
        <Typography variant="caption" sx={{ color: "#d32f2f" }}>
          * {t("submitForm.required")}
        </Typography>
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
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
                <MenuItem value="Secondary">
                  {t("submitForm.secondary")}
                </MenuItem>
                <MenuItem value="Bachelors">
                  {t("submitForm.bachelors")}
                </MenuItem>
                <MenuItem value="Masters">{t("submitForm.masters")}</MenuItem>
                <MenuItem value="PhD">{t("submitForm.phd")}</MenuItem>
              </TextField>

              {isSecondary ? (
                <TextField
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
                    value={
                      formData.gpa && formData.gpa !== 0 ? formData.gpa : ""
                    }
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
                        gpaScale: e.target.value,
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
                    university: "",
                  }))
                }
              >
                {countryLoading && (
                  <MenuItem value="">{t("Loading...")}</MenuItem>
                )}
                {countryError && (
                  <MenuItem value="">{t("Error loading countries")}</MenuItem>
                )}
                {!countryLoading &&
                  !countryError &&
                  countries.map((c) => (
                    <MenuItem key={c} value={c}>
                      {c}
                    </MenuItem>
                  ))}
              </TextField>
              {!isSecondary && (
                <Autocomplete
                  options={universities.map((uni) => uni.name)}
                  value={formData.university ?? ""}
                  onChange={(event, newValue) =>
                    setFormData((prev) => ({
                      ...prev,
                      university: newValue ?? "",
                    }))
                  }
                  loading={uniLoading}
                  disabled={!formData.country || uniError !== null}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t("submitForm.university")}
                      required
                      variant="outlined"
                      error={!!uniError}
                      helperText={
                        uniError ? t("Error loading universities") : ""
                      }
                    />
                  )}
                  sx={{ flex: 2 }}
                  freeSolo={false}
                />
              )}
            </Stack>

            {/* Degree and Program - only for non-Secondary */}
            {!isSecondary && (
              <Stack direction="row" spacing={2}>
                <TextField
                  required
                  label={t("submitForm.program")}
                  value={formData.currentProgram ?? ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      currentProgram: e.target.value,
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
                      {
                        ...prev.applications[0],
                        country: e.target.value,
                        university: "",
                      },
                    ],
                  }))
                }
                sx={{ flex: 1 }}
              >
                {countryLoading && (
                  <MenuItem value="">{t("Loading...")}</MenuItem>
                )}
                {countryError && (
                  <MenuItem value="">{t("Error loading countries")}</MenuItem>
                )}
                {!countryLoading &&
                  !countryError &&
                  countries.map((c) => (
                    <MenuItem key={c} value={c}>
                      {c}
                    </MenuItem>
                  ))}
              </TextField>
              {!isSecondary && (
                <Autocomplete
                  options={appUniversities.map((uni) => uni.name)}
                  value={currentApplication.university}
                  onChange={(event, newValue) =>
                    setFormData((prev) => ({
                      ...prev,
                      applications: [
                        { ...prev.applications[0], university: newValue ?? "" },
                      ],
                    }))
                  }
                  loading={appUniLoading}
                  disabled={!currentApplication.country || appUniError !== null}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t("submitForm.university")}
                      required
                      variant="outlined"
                      error={!!appUniError}
                      helperText={
                        appUniError ? t("Error loading universities") : ""
                      }
                    />
                  )}
                  sx={{ flex: 2 }}
                  freeSolo={false}
                />
              )}
            </Stack>
            <Stack direction="row" spacing={2} mb={3}>
              <TextField
                required
                select
                label={t("submitForm.degree")}
                value={currentApplication.degree}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    applications: [
                      {
                        ...prev.applications[0],
                        degree: e.target.value as DegreeLevel,
                      },
                    ],
                  }))
                }
                sx={{ flex: 2 }}
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
          <Button
            variant="contained"
            color="secondary"
            size="large"
            type="submit"
            disabled={isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? "Submitting..." : t("submitForm.submit")}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
