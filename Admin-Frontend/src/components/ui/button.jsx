export function Button({ children, className = "", variant = "default", ...props }) {
  const styles = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    outline: "border border-gray-300 hover:bg-gray-100",
  };

  return (
    <button
      {...props}
      className={`px-4 py-2 rounded-lg font-medium ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}