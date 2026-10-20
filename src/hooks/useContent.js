import { useCallback, useEffect, useRef, useState } from 'react';

// Loads a help-content collection (resources, faq, glossary) the first time `enabled` is true.
export function useContent(key, enabled) {
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const requestedRef = useRef(false);

  useEffect(() => {
    if (!enabled || requestedRef.current) return;
    requestedRef.current = true;
    setLoading(true);
    setError(null);
    fetch(`/api/content/${key}`, { credentials: 'include' })
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status}`);
        return res.json();
      })
      .then((data) => setItems(data.items))
      .catch((err) => {
        requestedRef.current = false;
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [key, enabled]);

  const save = useCallback(
    async (nextItems) => {
      const res = await fetch(`/api/content/${key}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: nextItems })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `${res.status}`);
      }
      const data = await res.json();
      setItems(data.items);
      return data.items;
    },
    [key]
  );

  return { items, loading, error, save };
}
