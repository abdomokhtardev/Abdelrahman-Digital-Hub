function isBulletList(lines) {
  return lines.length > 0 && lines.every((l) => l.trim().startsWith('- '))
}

function isNumberedList(lines) {
  return lines.length > 0 && lines.every((l) => /^\d+\.\s/.test(l.trim()))
}

function renderBlock(block, index) {
  const lines = block.split('\n').map((l) => l.trim()).filter(Boolean)

  if (isBulletList(lines)) {
    return (
      <ul key={index} className="my-6 list-none space-y-3 border-r-2 border-gold/60 pr-5">
        {lines.map((line, i) => (
          <li key={i} className="font-serif text-lg text-ink dark:text-sand-200 before:ml-2.5 before:text-gold before:content-['✦'] leading-relaxed">
            {line.replace(/^- /, '').trim()}
          </li>
        ))}
      </ul>
    )
  }

  if (isNumberedList(lines)) {
    return (
      <ol key={index} className="my-6 list-decimal space-y-3 pr-6 marker:text-gold marker:font-bold marker:font-sans">
        {lines.map((line, i) => (
          <li key={i} className="font-serif text-lg text-ink dark:text-sand-200 leading-relaxed">
            {line.replace(/^\d+\.\s/, '').trim()}
          </li>
        ))}
      </ol>
    )
  }

  const isSubheading = lines.length === 1 && lines[0].endsWith(':') && lines[0].length < 60

  if (isSubheading) {
    return (
      <h2 key={index} className="font-kufi text-base sm:text-lg font-bold text-teal dark:text-gold-light mb-4 mt-8 pb-2 border-b border-sand-200/40 dark:border-sand-800/40 flex items-center gap-2">
        <span className="text-gold text-xs">◆</span>
        <span>{lines[0].slice(0, -1)}</span>
      </h2>
    )
  }

  return (
    <p
      key={index}
      className={`font-serif text-lg leading-loose mb-4 ${
        index === 0
          ? 'text-ink font-medium sm:text-xl dark:text-sand-100'
          : 'text-muted dark:text-sand-300'
      }`}
    >
      {block}
    </p>
  )
}

export function ArticleContent({ content }) {
  const blocks = content.split('\n\n').filter(Boolean)

  return (
    <div className="rounded-3xl border border-sand-200/50 bg-white/50 p-6 shadow-sm sm:p-8 dark:border-sand-850/50 dark:bg-sand-900/30 backdrop-blur-sm">
      <div className="space-y-4">{blocks.map((block, i) => renderBlock(block, i))}</div>
    </div>
  )
}
