import { toast } from 'react-toastify';

// Type for toast options with error and success variations
type ToastOptions = {
   type: 'error' | 'success';
   // Add other desired toast options here (e.g., position, autoClose, etc.)
};

/**
 * Utility function for displaying error or success notifications
 * @param message The message to display in the toast
 * @param options Configuration options for the toast (type, position, etc.)
 */
export default function toastify(message: string, options: ToastOptions = { type: 'success' }) {
   const toastConfig = {
      ...options, // Spread in other options for customization
   };

   switch (options.type) {
      case 'error':
         toast.error(message, toastConfig);
         break;
      case 'success':
         toast.success(message, toastConfig);
         break;
      default:
         console.warn(`Invalid toast type: ${options.type}`);
         break;
   }
}
