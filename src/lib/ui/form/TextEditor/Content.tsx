import React from 'react'

export default function Content(props: {
  className?: string
  color?: string
  children: string
}) {
  return (
    <div
      /**
       * '.ck-content' class required for CKEditor styles to take affect. ie. for
       * image alignment.
       *
       * Reference: https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/content-styles.html
       */
      className={`ck-content ${props.className}`}
      style={{color: props.color}}
      dangerouslySetInnerHTML={{
        __html: props.children,
      }}
    />
  )
}
