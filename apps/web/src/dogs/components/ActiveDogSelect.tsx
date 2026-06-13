import { useActiveDog } from '../useActiveDog.js';

interface ActiveDogSelectProps {
  id: string;
  label: string;
}

export function ActiveDogSelect({ id, label }: ActiveDogSelectProps) {
  const { activeDogId, dogs, setActiveDogId } = useActiveDog();

  return (
    <label className="block text-sm font-medium" htmlFor={id}>
      {label}
      <select
        className="mt-2 min-h-11 w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-2 text-base outline-none focus:border-[var(--app-link)]"
        id={id}
        value={activeDogId ?? ''}
        onChange={(event) => setActiveDogId(event.target.value || null)}
      >
        {dogs.map((dog) => (
          <option key={dog.id} value={dog.id}>
            {dog.name}
          </option>
        ))}
      </select>
    </label>
  );
}
