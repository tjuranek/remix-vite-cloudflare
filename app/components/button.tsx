interface ButtonProps {
  label: string;
  type?: "button" | "submit";
}

export function Button(props: ButtonProps) {
  const { label, type = "button" } = props;

  return (
    <button
      type={type}
      className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    >
      {label}
    </button>
  );
}
