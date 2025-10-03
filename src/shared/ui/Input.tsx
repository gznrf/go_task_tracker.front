type Props = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = (props: Props) => {
  return (
    <input
      {...props}
      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
    />
  );
};
