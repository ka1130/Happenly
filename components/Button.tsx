import { type ReactNode, ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export default function Button(props: ButtonProps) {
  const { children, className, ...rest } = props;
  return (
    <button
      type="submit"
      className={`mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded py-2 transition ${className || ""}`}
      {...rest}
    >
      {children}
    </button>
  );
}
