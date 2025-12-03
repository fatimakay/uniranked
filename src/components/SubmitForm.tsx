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
import type { EducationLevel } from "../models/submission";

export default function SubmitForm() {
  const { t } = useTranslation();
  const [educationLevel, setEducationLevel] =
    useState<EducationLevel>("Secondary");
  const [selectedTest, setSelectedTest] = useState<string>("");
  const isSecondary = educationLevel === "Secondary";

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
          {t("submitForm.title")}
        </Typography>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: "bold" }}>
          {t("submitForm.applicantInfo")}
        </Typography>

        <Stack spacing={3} mb={3}>
          {/* Current Status */}
          <Stack direction="row" spacing={2}>
            <TextField
              select
              label={t("submitForm.educationLevel")}
              value={educationLevel}
              onChange={(e) =>
                setEducationLevel(e.target.value as EducationLevel)
              }
              sx={{ flex: 1 }}
            >
              <MenuItem value="Secondary">{t("submitForm.secondary")}</MenuItem>
              <MenuItem value="Bachelors">{t("submitForm.bachelors")}</MenuItem>
              <MenuItem value="Masters">{t("submitForm.masters")}</MenuItem>
              <MenuItem value="PhD">{t("submitForm.phd")}</MenuItem>
            </TextField>

            {isSecondary ? (
              <TextField label={t("submitForm.grade")} sx={{ flex: 1 }} />
            ) : (
              <>
                <TextField label={t("submitForm.gpa")} sx={{ flex: 1 }} />
                <TextField
                  select
                  label={t("submitForm.gpaScale")}
                  sx={{ flex: 1 }}
                >
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
              select
              label={t("submitForm.country")}
              sx={{ flex: 1 }}
            />
            {!isSecondary && (
              <TextField label={t("submitForm.university")} sx={{ flex: 2 }} />
            )}
          </Stack>

          {/* Degree and Program - only for non-Secondary */}
          {!isSecondary && (
            <Stack direction="row" spacing={2}>
              <TextField select label={t("submitForm.degree")} sx={{ flex: 1 }}>
                <MenuItem value="Bachelors">
                  {t("submitForm.bachelors")}
                </MenuItem>
                <MenuItem value="Masters">{t("submitForm.masters")}</MenuItem>
                <MenuItem value="PhD">{t("submitForm.phd")}</MenuItem>
              </TextField>
              <TextField label={t("submitForm.program")} sx={{ flex: 2 }} />
            </Stack>
          )}

          {/* Additional Tests - shown for both */}
          <Stack direction="row" spacing={2}>
            <TextField
              select
              label={t("submitForm.test")}
              value={selectedTest}
              onChange={(e) => setSelectedTest(e.target.value)}
              sx={{ flex: 1 }}
            >
              {standardTests.map((test) => (
                <MenuItem key={test.value} value={test.value}>
                  {test.label}
                </MenuItem>
              ))}
            </TextField>
            {selectedTest === "Other" && (
              <TextField label="Specify Test" sx={{ flex: 1 }} />
            )}
            <TextField label={t("submitForm.score")} sx={{ flex: 1 }} />
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
              select
              label={t("submitForm.country")}
              sx={{ flex: 1 }}
            />
            {!isSecondary && (
              <TextField label={t("submitForm.university")} sx={{ flex: 2 }} />
            )}
          </Stack>
          <Stack direction="row" spacing={2} mb={3}>
            <TextField select label={t("submitForm.degree")} sx={{ flex: 1 }}>
              <MenuItem value="Bachelors">{t("submitForm.bachelors")}</MenuItem>
              <MenuItem value="Masters">{t("submitForm.masters")}</MenuItem>
              <MenuItem value="PhD">{t("submitForm.phd")}</MenuItem>
            </TextField>
            <TextField label={t("submitForm.program")} sx={{ flex: 2 }} />
          </Stack>
          <Stack direction="row" spacing={2} mb={3}>
            <TextField
              label={t("submitForm.applicationDate")}
              type="date"
              sx={{ flex: 1 }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label={t("submitForm.decisionDate")}
              type="date"
              sx={{ flex: 1 }}
              InputLabelProps={{ shrink: true }}
            />
          </Stack>
          <Stack direction="row" spacing={2} mb={3}>
            <TextField select label={t("submitForm.status")} sx={{ flex: 1 }}>
              <MenuItem value="Accepted">{t("submitForm.accepted")}</MenuItem>
              <MenuItem value="Rejected">{t("submitForm.rejected")}</MenuItem>
              <MenuItem value="Waitlisted">
                {t("submitForm.waitlisted")}
              </MenuItem>
            </TextField>
            <TextField
              select
              label={t("submitForm.scholarship")}
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
      </Paper>
    </Container>
  );
}
