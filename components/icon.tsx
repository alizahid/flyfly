import * as icons from 'ionicons/icons'
import React, { FunctionComponent } from 'react'

interface Props {
  className?: string
  icon: keyof typeof icons
  size?: number

  onClick?: () => void
}

export const Icon: FunctionComponent<Props> = ({
  className,
  icon,
  onClick,
  size = 24
}) => (
  <img
    className={`${onClick && 'cursor-pointer'} ${className}`}
    onClick={onClick}
    src={icons[icon]}
    style={{
      height: size,
      width: size
    }}
  />
)
