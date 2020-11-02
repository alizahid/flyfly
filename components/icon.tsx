import * as ionicons from 'ionicons/icons'
import { kebabCase } from 'lodash'
import React, { FunctionComponent } from 'react'

const icons = Object.keys(ionicons)
  .map((name) => {
    let icon = kebabCase(name)

    if (name === 'logoCss3') {
      icon = 'logo-css3'
    }

    if (name === 'logoHtml5') {
      icon = 'logo-html5'
    }

    return {
      icon: require(`raw-loader!ionicons/dist/svg/${icon}.svg`),
      name
    }
  })
  .reduce((icons, { icon, name }) => {
    icons[name] = icon.default

    return icons
  }, {})

interface Props {
  className?: string
  color?:
    | 'black'
    | 'white'
    | 'gray'
    | 'red'
    | 'orange'
    | 'yellow'
    | 'green'
    | 'teal'
    | 'blue'
    | 'indigo'
    | 'purple'
    | 'pink'
  icon: keyof typeof ionicons
  size?: number

  onClick?: () => void
}

export const Icon: FunctionComponent<Props> = ({
  className,
  color = 'black',
  icon,
  onClick,
  size = 24
}) => (
  <div
    className={`icon-${color} ${onClick && 'cursor-pointer'} ${className}`}
    dangerouslySetInnerHTML={{
      __html: icons[icon]
    }}
    onClick={onClick}
    style={{
      height: size,
      width: size
    }}
  />
)
