type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <label className="search-bar">
      <span aria-hidden="true">⌕</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder="Busca un medicamento o producto" aria-label="Buscar productos" />
      {value && <button type="button" onClick={() => onChange("")} aria-label="Limpiar búsqueda">×</button>}
    </label>
  );
}
