type Typography = {
  children: React.ReactNode;
  className?: string;
  props?: any;
};

export function TypographyH1({ children, className, ...props }: Typography) {
  return (
    <h1
      className={`scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl ${className}`}
      {...props}
    >
      {children}
    </h1>
  );
}
export function TypographyH2({ children, className, ...props }: Typography) {
  console.log('🚀 ~ TypographyH2 ~ className:', className);
  return (
    <h2
      className={`scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 ${className}`}
      {...props}
    >
      {children}
    </h2>
  );
}
export function TypographyH3({ children, className, ...props }: Typography) {
  return (
    <h3
      className={`scroll-m-20 text-2xl font-semibold tracking-tight ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
}
export function TypographyH4({ children, className, ...props }: Typography) {
  return (
    <h4
      className={`scroll-m-20 text-xl font-semibold tracking-tight ${className}`}
      {...props}
    >
      {children}
    </h4>
  );
}
export function TypographyP({ children, className, ...props }: Typography) {
  return (
    <p
      className={`leading-7 [&:not(:first-child)]:mt-6 ${className}`}
      {...props}
    >
      {children}
    </p>
  );
}
export function TypographyBlockquote({
  children,
  className,
  ...props
}: Typography) {
  return (
    <blockquote
      className={`mt-6 border-l-2 pl-6 italic ${className}`}
      {...props}
    >
      {children}
    </blockquote>
  );
}

export function TypographyList({ children, className, ...props }: Typography) {
  return (
    <ul className={`my-6 ml-6 list-disc [&>li]:mt-2 ${className}`} {...props}>
      {children}
    </ul>
  );
}
export function TypographyInlineCode({
  children,
  className,
  ...props
}: Typography) {
  return (
    <code
      className={`relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold ${className}`}
      {...props}
    >
      {children}
    </code>
  );
}
export function TypographyLead({ children, className, ...props }: Typography) {
  return (
    <p className={`text-xl text-muted-foreground ${className}`} {...props}>
      {children}
    </p>
  );
}

export function TypographyLarge({ children, className, ...props }: Typography) {
  return (
    <div className={`text-lg font-semibold ${className}`} {...props}>
      {children}
    </div>
  );
}

export function TypographySmall({ children, className, ...props }: Typography) {
  return (
    <small
      className={`text-sm font-medium leading-none ${className}`}
      {...props}
    >
      {children}
    </small>
  );
}

export function TypographyMuted({ children, className, ...props }: Typography) {
  return (
    <p className={`text-sm text-muted-foreground ${className}`} {...props}>
      {children}
    </p>
  );
}
