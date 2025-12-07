import { useState, useEffect } from "react";
import { fetchCountries } from "../api/universities";

export const useCountries = () => {
  const [countries, setCountries] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchCountries()
      .then(setCountries)
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  return { countries, loading, error };
};
