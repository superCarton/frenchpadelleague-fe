import { Alert } from "@heroui/alert";
import clsx from "clsx";

export default function ErrorComponent({
  error,
  className,
}: {
  error: string;
  className?: string;
}) {
  return (
    <div className={clsx("w-full flex justify-center items-center py-6", className)}>
      <div className="max-w-xl">
        <Alert color="danger" title={error} />
      </div>
    </div>
  );
}
