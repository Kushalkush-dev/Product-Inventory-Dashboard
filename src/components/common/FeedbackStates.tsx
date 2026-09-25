import { AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
}

export function ErrorState({
  title = "Something went wrong",
  message = "Failed to load the requested information. Please check your connection and try again.",
  onRetry,
  isRetrying = false,
}: ErrorStateProps) {
  return (
    <div className="mx-auto my-8 max-w-lg">
      <Alert variant="destructive" className="flex flex-col items-center p-8 text-center">
        <AlertCircle className="mb-2 size-8" />
        <AlertTitle className="text-lg">{title}</AlertTitle>
        <AlertDescription className="mb-4">{message}</AlertDescription>
        {onRetry && (
          <Button onClick={onRetry} disabled={isRetrying} size="sm">
            <RefreshCw className={isRetrying ? "animate-spin" : ""} />
            {isRetrying ? "Retrying..." : "Retry"}
          </Button>
        )}
      </Alert>
    </div>
  );
}

interface EmptyStateProps {
  title?: string;
  message?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  title = "No products found",
  message = "No items match your selected filters. Try searching for something else or clearing filters.",
  action,
}: EmptyStateProps) {
  return (
    <div className="mx-auto my-8 max-w-lg rounded-xl border bg-card p-12 text-center">
      <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl border bg-muted text-2xl">
        📦
      </div>
      <h3 className="mb-1 text-lg font-bold">{title}</h3>
      <p className="mb-4 text-sm text-muted-foreground">{message}</p>
      {action}
    </div>
  );
}
