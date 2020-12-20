import React, { FunctionComponent, useRef, useState } from 'react'
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import typescript from 'react-syntax-highlighter/dist/cjs/languages/prism/typescript'
import nord from 'react-syntax-highlighter/dist/cjs/styles/prism/nord'

import { prettyLanguageName } from '@flyfly/client'

import { Icon } from './icon'

SyntaxHighlighter.registerLanguage('typescript', typescript)

Object.keys(nord).forEach((key) => {
  if (key.includes('[')) {
    delete nord[key]
  }
})

type Props = {
  className?: string
  code: string
  language: string
}

export const Code: FunctionComponent<Props> = ({
  className,
  code,
  language
}) => {
  const timer = useRef<NodeJS.Timeout>()

  const [copied, setCopied] = useState(false)

  return (
    <div
      className={`rounded-lg overflow-hidden shadow-sm ${className}`}
      style={{
        background: '#2E3440',
        color: '#f8f8f2'
      }}>
      <header className="bg-highlight flex items-stretch leading-none">
        <span className="p-4">{prettyLanguageName(language)}</span>
        <a
          className="flex items-center justify-center h-12 w-12 ml-auto"
          href="#copy"
          onClick={async (event) => {
            event.preventDefault()

            clearTimeout(timer.current)

            await navigator.clipboard.writeText(code)

            setCopied(true)

            timer.current = setTimeout(() => setCopied(false), 3000)
          }}>
          <Icon color="white" icon={copied ? 'checkmark' : 'copyOutline'} />
        </a>
      </header>
      <SyntaxHighlighter
        codeTagProps={{
          className: 'font-code leading-relaxed'
        }}
        customStyle={{
          background: '#2E3440',
          overflowX: 'auto',
          padding: '1rem'
        }}
        language={language}
        style={nord}>
        {code}
      </SyntaxHighlighter>
    </div>
  )
}

type InlineCodeProps = {
  className?: string
  text: string
}

export const InlineCode: FunctionComponent<InlineCodeProps> = ({
  className,
  text
}) => {
  const timer = useRef<NodeJS.Timeout>()

  const [copied, setCopied] = useState(false)

  return (
    <div
      className={`flex items-center bg-white rounded-lg shadow-sm leading-none overflow-hidden ${className}`}>
      <a
        className="bg-amber-100"
        href="#copy"
        onClick={async (event) => {
          event.preventDefault()

          clearTimeout(timer.current)

          await navigator.clipboard.writeText(text)

          setCopied(true)

          timer.current = setTimeout(() => setCopied(false), 3000)
        }}>
        <Icon className="m-4" icon={copied ? 'checkmark' : 'copyOutline'} />
      </a>
      <code className="mx-4 font-code">{text}</code>
    </div>
  )
}
