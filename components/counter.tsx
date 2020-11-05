import { range } from 'lodash'
import React, { FunctionComponent, useEffect, useState } from 'react'

interface Props {
  value: number
}

export const Counter: FunctionComponent<Props> = ({ value }) => {
  const [next, setNext] = useState(value)

  useEffect(() => {
    range(next, value + (value > next ? 1 : -1)).forEach((next, index) =>
      setTimeout(() => setNext(next), index)
    )
  }, [value])

  return <>{next}</>
}
