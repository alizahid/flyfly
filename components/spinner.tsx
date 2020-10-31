import React, { FunctionComponent } from 'react'

interface Props {
  className?: string
}

export const Spinner: FunctionComponent<Props> = ({ className }) => (
  <>
    <style jsx>{`
      .spinner {
        animation: spinner 0.5s linear infinite;
        border-radius: 100%;
        border: 2px solid #38a169;
        border-top-color: transparent;
        height: 1.5em;
        width: 1.5em;
      }

      @keyframes spinner {
        from {
          transform: rotate(0deg);
        }

        to {
          transform: rotate(360deg);
        }
      }
    `}</style>
    <div className={`spinner ${className}`}></div>
  </>
)
