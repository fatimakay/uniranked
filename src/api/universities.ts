// src/api/universities.ts
export interface University {
  name: string;
  country: string;
}
const JSON_URL =
  "https://fatimakay.github.io/world-universities/world_universities_and_domains.json";

export const fetchAllUniversities = async (): Promise<University[]> => {
  const res = await fetch(JSON_URL);
  if (!res.ok) throw new Error("Failed to fetch universities");
  const data: University[] = await res.json();
  return data;
};

export const fetchUniversitiesByCountry = async (
  country: string
): Promise<University[]> => {
  if (!country) return [];

  const universities = await fetchAllUniversities();
  return universities.filter(
    (u) => u.country.toLowerCase() === country.toLowerCase()
  );
};

export const fetchCountries = async (): Promise<string[]> => {
  const universities = await fetchAllUniversities();
  const countries = Array.from(
    new Set(universities.map((u) => u.country))
  ).sort();
  return countries;
};
