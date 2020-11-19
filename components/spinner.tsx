import React, { FunctionComponent } from 'react'

interface Props {
  className?: string
  light?: boolean
}

export const Spinner: FunctionComponent<Props> = ({ className, light }) => (
  <>
    <style jsx>{`
      span {
        animation: spinner 1.4s infinite ease-in-out both;
      }

      .one {
        animation-delay: -0.32s;
      }

      .two {
        animation-delay: -0.16s;
      }

      .three {
      }

      @keyframes spinner {
        0%,
        80%,
        100% {
          opacity: 0.1;
        }
        40% {
          opacity: 1;
        }
      }
    `}</style>
    <div className={`flex items-center w-8 ${className}`}>
      <span
        className={`one h-2 w-2 rounded-full ${
          light ? 'bg-white' : 'bg-emerald-500'
        }`}
      />
      <span
        className={`two h-2 w-2 rounded-full ml-1 ${
          light ? 'bg-white' : 'bg-emerald-500'
        }`}
      />
      <span
        className={`three h-2 w-2 rounded-full ml-1 ${
          light ? 'bg-white' : 'bg-emerald-500'
        }`}
      />
    </div>
  </>
)
