import React from 'react'

export default function Content(props: {className?: string; children: string}) {
  return (
    <div
      /**
       * '.ck-content' class required for CKEditor styles to take affect. ie. for
       * image alignment.
       *
       * Reference: https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/content-styles.html
       */
      className={`ck-content ${props.className}`}
      dangerouslySetInnerHTML={{
        __html: props.children,
      }}
    />
  )
}
