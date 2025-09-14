import { toast } from "react-toastify";

export const useErrorToast = () => {
  const showError = (error: unknown) => {
    const errorMessage =
      error && typeof error === "object" && "message" in error
        ? (error as { message: string }).message
        : "An unexpected error occurred.";
    toast.error(errorMessage);
  };

  return { showError };
};
