const CategoryMultiSelect = ({ categories, selected, onChange }) => {
  const selectedSet = new Set((selected || []).map(String));

  const toggleCategory = (categoryId, checked) => {
    const next = checked
      ? [...new Set([...(selected || []), categoryId])]
      : (selected || []).filter((item) => String(item) !== String(categoryId));

    onChange(next);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {categories.map((category) => (
        <label key={category._id} className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={selectedSet.has(String(category._id))}
            onChange={(event) => toggleCategory(category._id, event.target.checked)}
          />
          <span>{category.name}</span>
        </label>
      ))}
    </div>
  );
};

export default CategoryMultiSelect;
