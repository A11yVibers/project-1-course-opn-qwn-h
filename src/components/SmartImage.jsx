import { useEffect, useState } from 'react'

export default function SmartImage({ src, alt, className, ...rest }) {
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setFailed(false)
  }, [src])

  if (!src || failed) {
    return (
      <div className={`smart-image smart-image--fallback ${className ?? ''}`} role="img" aria-label={alt} {...rest}>
        <span>{alt}</span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`smart-image ${className ?? ''}`}
      loading="lazy"
      onError={() => setFailed(true)}
      {...rest}
    />
  )
}
