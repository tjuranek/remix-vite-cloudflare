import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { useField } from "remix-validated-form";

const classNames = {
  default:
    "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
  error:
    "block w-full rounded-md border-0 py-1.5 pr-10 text-red-900 ring-1 ring-inset ring-red-300 placeholder:text-red-300 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6",
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
}

export function Input(props: InputProps) {
  const { label, name, ...rest } = props;

  const { error, getInputProps } = useField(name, {
    validationBehavior: {
      initial: "onSubmit",
    },
  });

  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {label}
      </label>

      <div className="relative mt-2 rounded-md shadow-sm">
        <input
          className={error ? classNames.error : classNames.default}
          id={name}
          name={name}
          {...getInputProps({ id: name, ...rest })}
        />
        {error && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ExclamationCircleIcon
              className="h-5 w-5 text-red-500"
              aria-hidden="true"
            />
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600" id="email-error">
          {error}
        </p>
      )}
    </div>
  );
}
