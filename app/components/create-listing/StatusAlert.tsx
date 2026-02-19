interface StatusAlertProps {
  type: "error" | "success";
  msg: string;
}

export default function StatusAlert({ type, msg }: StatusAlertProps) {
  return (
    <div
      className={`mb-8 p-4 rounded-2xl font-bold text-sm border ${
        type === "error"
          ? "bg-red-50 text-red-600 border-red-100"
          : "bg-green-50 text-green-600 border-green-100"
      }`}
    >
      {msg}
    </div>
  );
}
