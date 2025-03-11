import type React from "react"

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  onClick?: () => void
}

const Button: React.FC<ButtonProps> = ({ children, onClick, ...props }) => {
  return (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  )
}

export default Button

