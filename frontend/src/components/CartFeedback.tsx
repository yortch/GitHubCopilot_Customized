import { useCart } from '../context/useCart';

export default function CartFeedback() {
  const { message, error, storageError, retrySave } = useCart();
  return (
    <div className="max-w-7xl mx-auto px-4 text-gray-800 dark:text-light">
      {storageError && (
        <div role="alert" className="my-4 p-4 border border-red-500 rounded-lg bg-white dark:bg-gray-800">
          <p>{storageError}</p>
          <button type="button" onClick={retrySave} className="mt-2 underline rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
            Retry saving cart
          </button>
        </div>
      )}
      <p role="status" aria-live="polite" aria-atomic="true" className={message ? 'py-3' : 'sr-only'}>{message}</p>
      {error && <p role="alert" className="py-3 text-red-700 dark:text-red-300">{error}</p>}
    </div>
  );
}
