import { CircularProgress } from "@heroui/progress";

export const SectionLoader = ({ label }: { label?: string }) => {
  return (
    <div className="w-full flex h-[200px] justify-center items-center">
      <CircularProgress label={label} />
    </div>
  );
};
