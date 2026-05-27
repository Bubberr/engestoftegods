'use client';

// Genanvendeligt formfelt med label, inputtype og fejlbesked
export default function FormFelt({
  label,
  name,
  type = 'text',
  value,
  onChange,
  påkrævet = false,
  hjælpetekst,
  fejl,
  placeholder,
  maxLength,
  min,
  rows,
}) {
  const basisKlasser =
    'w-full rounded-lg border px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-jule-green/40 transition-colors';
  const normalKlasser = 'border-gray-300 bg-white';
  const fejlKlasser = 'border-red-400 bg-red-50';

  const inputKlasser = `${basisKlasser} ${fejl ? fejlKlasser : normalKlasser}`;

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-jule-brown mb-1">
        {label}
        {påkrævet && <span className="text-jule-red ml-1">*</span>}
      </label>

      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          rows={rows || 4}
          className={inputKlasser}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          min={min}
          required={påkrævet}
          className={inputKlasser}
        />
      )}

      {/* Tegnoptæller til tekstfelter med maxLength */}
      {type === 'textarea' && maxLength && (
        <p className="mt-1 text-xs text-gray-400 text-right">
          {value?.length || 0}/{maxLength} tegn
        </p>
      )}

      {hjælpetekst && !fejl && (
        <p className="mt-1 text-xs text-gray-500">{hjælpetekst}</p>
      )}

      {fejl && <p className="mt-1 text-xs text-red-500">{fejl}</p>}
    </div>
  );
}
