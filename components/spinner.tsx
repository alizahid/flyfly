import React, { FunctionComponent } from 'react'

interface Props {
  className?: string
}

export const Spinner: FunctionComponent<Props> = ({ className }) => (
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
      <span className="one h-2 w-2 bg-blue-500 rounded-full" />
      <span className="two h-2 w-2 bg-blue-500 rounded-full ml-1" />
      <span className="three h-2 w-2 bg-blue-500 rounded-full ml-1" />
    </div>
  </>
)
