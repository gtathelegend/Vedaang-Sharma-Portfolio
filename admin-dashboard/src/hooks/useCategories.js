import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../lib/api";

let categoryCache = null;

const useCategories = () => {
  const [categories, setCategories] = useState(categoryCache || []);
  const [loading, setLoading] = useState(!categoryCache);

  const fetchCategories = useCallback(async () => {
    if (categoryCache) {
      setCategories(categoryCache);
      return;
    }

    setLoading(true);
    const response = await api.get("/api/categories");
    const items = response?.data?.data || [];
    categoryCache = items;
    setCategories(items);
    setLoading(false);
  }, []);

  const createCategory = useCallback(async (name) => {
    const response = await api.post("/api/categories", { name });
    const created = response?.data?.data;

    categoryCache = [...(categoryCache || []), created].sort((a, b) => a.name.localeCompare(b.name));
    setCategories(categoryCache);

    return created;
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const categoryMap = useMemo(
    () =>
      categories.reduce((acc, category) => {
        acc[category._id] = category;
        return acc;
      }, {}),
    [categories]
  );

  return {
    categories,
    categoryMap,
    loading,
    createCategory,
    refetch: fetchCategories,
  };
};

export default useCategories;
