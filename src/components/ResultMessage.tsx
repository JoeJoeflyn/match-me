import { ActionResult } from "@/types";
import clsx from "clsx";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
type Props = {
  result: ActionResult<string> | null;
};
export default function ResultMessage({ result }: Props) {
  if (!result) return null;
  const isSuccess = result.status === "success";
  return (
    <div
      className={clsx(
        "p-3 rounded-xl w-full flex items-center justify-center gap-x-2 text-sm",
        {
          "text-danger-800 bg-danger-50": result.status === "error",
          "text-success-800 bg-success-50": isSuccess,
        }
      )}
    >
      {isSuccess ? (
        <FaCheckCircle size={20} />
      ) : (
        <FaExclamationTriangle size={20} />
      )}
      <p>{isSuccess ? result.data : (result.error as string)}</p>
    </div>
  );
}
