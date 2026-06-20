import { cn } from "@/shared/lib/utils";

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export function ErrorMessage({
  title = "Something went wrong",
  message,
  onRetry,
  retryLabel = "Try again",
  className,
}: ErrorMessageProps) {
  return (
    <div
      role="alert"
      className={cn("rounded-lg border border-red-200 bg-red-50 p-4 text-red-900", className)}
    >
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-1 text-sm">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 text-sm font-medium underline underline-offset-2 hover:no-underline"
        >
          {retryLabel}
        </button>
      )}
    </div>
  );
}
