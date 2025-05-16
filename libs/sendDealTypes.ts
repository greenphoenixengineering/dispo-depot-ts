
export interface SendDealsState {
  message?: string | null;
  errors?: {
    tags?: string;
    subject?: string;
    message?: string;
    api?: string; // For general API errors
  };
  success?: boolean;
}