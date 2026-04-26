import { useState, useEffect } from 'react';
import type { Parent } from './parent.types';
import { getParents } from './parentService';

export const useParents = () => {
  const [parents, setParents] = useState<Parent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getParents()
      .then(data => setParents(data))
      .catch(() => setError("נכשלו טעינת הנתונים מהשרת"))
      .finally(() => setIsLoading(false));
  }, []);

  return { parents, isLoading, error };
};