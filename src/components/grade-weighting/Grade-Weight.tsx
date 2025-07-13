type GradeWeightProps = {
  name: string;
  onRemove?: (idx: string) => void;
};

export function GradeWeight({ name, onRemove }: GradeWeightProps) {
  const handleRemove = () => {
    onRemove?.(name);
  };
  return (
    <div className="flex flex-row gap-2 items-center w-full my-2">
      <input
        type="text"
        id={name}
        name={name}
        className="border border-gray-300 rounded p-2"
        placeholder="Weight Name"
      />
      <input
        placeholder="% Percentage"
        type="number"
        name={`num_${name}`}
        min={0}
        max={100}
        defaultValue={0}
      ></input>
      <button onClick={handleRemove}>Remove</button>
    </div>
  );
}
