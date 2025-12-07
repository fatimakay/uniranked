import { useState, useEffect } from "react";
import type { University } from "../api/universities";
import { fetchUniversitiesByCountry } from "../api/universities";

export const useUniversities = (country?: string) => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!country) {
      setUniversities([]);
      return;
    }

    setLoading(true);
    setError(null);

    fetchUniversitiesByCountry(country)
      .then(setUniversities)
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [country]);

  return { universities, loading, error };
};
