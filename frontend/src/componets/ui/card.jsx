export function Card({ children, className = "" }) {
    return (
      <div className={`rounded-lg border bg-white p-4 shadow-md ${className}`}>
        {children}
      </div>
    );
  }
  
  export function CardHeader({ children, className = "" }) {
    return <div className={`mb-3 ${className}`}>{children}</div>;
  }
  
  export function CardTitle({ children, className = "" }) {
    return (
      <h3 className={`text-lg font-semibold leading-tight ${className}`}>
        {children}
      </h3>
    );
  }
  
  export function CardContent({ children, className = "" }) {
    return <div className={className}>{children}</div>;
  }
  
  export function CardFooter({ children, className = "" }) {
    return <div className={`mt-3 ${className}`}>{children}</div>;
  }
  
  export function CardDescription({ children, className = "" }) {
    return <p className={`text-sm text-gray-500 ${className}`}>{children}</p>;
  }
  