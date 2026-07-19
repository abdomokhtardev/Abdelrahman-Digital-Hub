export function ErrorBanner({ error }) {
  if (!error) return null
  return (
    <div className="mb-4 rounded-xl border border-terracotta/30 bg-terracotta/10 px-4 py-3 text-sm text-terracotta">
      {error}
    </div>
  )
}
