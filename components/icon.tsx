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
    icons[name] = icon.default.replace(/<title>([\w\s]+)<\/title>/, '')

    return icons
  }, {})

type IconColor =
  | 'black'
  | 'white'
  | 'gray'
  | 'red'
  | 'orange'
  | 'amber'
  | 'yellow'
  | 'lime'
  | 'green'
  | 'emerald'
  | 'teal'
  | 'cyan'
  | 'light-blue'
  | 'blue'
  | 'indigo'
  | 'violet'
  | 'purple'
  | 'fuchsia'
  | 'pink'

interface Props {
  className?: string
  color?: IconColor
  icon: keyof typeof ionicons
  size?: number
  title?: string

  onClick?: () => void
}

export const Icon: FunctionComponent<Props> = ({
  className,
  color = 'black',
  icon,
  onClick,
  size = 24,
  title
}) => (
  <div
    className={`icon-${color} ${onClick ? 'cursor-pointer' : ''} ${className}`}
    dangerouslySetInnerHTML={{
      __html: icons[icon]
    }}
    onClick={onClick}
    style={{
      height: size,
      width: size
    }}
    title={title}
  />
)
