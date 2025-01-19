interface Props {
  variant?: 'border' | 'solid';
  icon?: React.ReactNode;
  className?: string;
  id?: string;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const Button: React.FC<Props> = ({
  children,
  variant = 'solid',
  icon,
  className = '',
  id = '',
  onClick = () => {},
}) => (
  <button
    onClick={onClick}
    id={id}
    className={`flex transform items-center justify-center rounded-xl border-2 border-primary px-2 py-2 transition-all duration-300 ease-in-out hover:shadow-xl active:scale-95 md:px-4 ${variant === 'solid' ? 'bg-primary text-white' : ''} ${className}`}
  >
    {icon && <span>{icon}</span>}
    {children}
  </button>
);

export default Button;
