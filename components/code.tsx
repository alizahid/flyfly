import React, { FunctionComponent, useRef, useState } from 'react'
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
// import csharp from 'react-syntax-highlighter/dist/cjs/languages/prism/csharp'
// import java from 'react-syntax-highlighter/dist/cjs/languages/prism/java'
// import kotlin from 'react-syntax-highlighter/dist/cjs/languages/prism/kotlin'
import php from 'react-syntax-highlighter/dist/cjs/languages/prism/php'
import python from 'react-syntax-highlighter/dist/cjs/languages/prism/python'
import ruby from 'react-syntax-highlighter/dist/cjs/languages/prism/ruby'
// import swift from 'react-syntax-highlighter/dist/cjs/languages/prism/swift'
import typescript from 'react-syntax-highlighter/dist/cjs/languages/prism/typescript'
import nord from 'react-syntax-highlighter/dist/cjs/styles/prism/nord'

import { prettyLanguageName } from '@flyfly/client'

import { Icon } from './icon'

// SyntaxHighlighter.registerLanguage('csharp', csharp)
// SyntaxHighlighter.registerLanguage('java', java)
// SyntaxHighlighter.registerLanguage('kotlin', kotlin)
SyntaxHighlighter.registerLanguage('php', php)
SyntaxHighlighter.registerLanguage('python', python)
SyntaxHighlighter.registerLanguage('ruby', ruby)
// SyntaxHighlighter.registerLanguage('swift', swift)
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
      <header className="bg-gray-800 flex items-stretch leading-none">
        <div className="font-medium p-4">{prettyLanguageName(language)}</div>
        <button
          className="flex items-center justify-center h-12 w-12 ml-auto"
          onClick={async (event) => {
            event.preventDefault()

            clearTimeout(timer.current)

            await navigator.clipboard.writeText(code)

            setCopied(true)

            timer.current = setTimeout(() => setCopied(false), 3000)
          }}>
          <Icon
            color="white"
            icon={copied ? 'checkmark' : 'copyOutline'}
            size={20}
          />
        </button>
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
      <button
        className="bg-gray-300"
        onClick={async (event) => {
          event.preventDefault()

          clearTimeout(timer.current)

          await navigator.clipboard.writeText(text)

          setCopied(true)

          timer.current = setTimeout(() => setCopied(false), 3000)
        }}>
        <Icon
          className="m-4"
          icon={copied ? 'checkmark' : 'copyOutline'}
          size={20}
        />
      </button>
      <code className="mx-4 font-code">{text}</code>
    </div>
  )
}
