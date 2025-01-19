export default function PageTitle({ children, className = "" }) {
   return <h1 className={`my-6 text-lg font-bold text-gray-700 dark:text-gray-300 ${className}`}>{children}</h1>;
}
