import * as React from 'react'
import {SVGProps} from 'react'

const CloseDrawer = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={39}
    height={32}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M19.5 32c-5.172 0-10.132-1.686-13.789-4.686S0 20.244 0 16c0-4.243 2.054-8.313 5.711-11.314C9.368 1.686 14.328 0 19.5 0v32Z"
      fill="#262626"
    />
    <path
      d="m12.131 15.985 3.637-3.636-1.213-1.213-3.636 3.637-3.637-3.636-1.212 1.212 3.637 3.636-3.637 3.637 1.212 1.212 3.637-3.636 3.636 3.636 1.213-1.212-3.637-3.637Z"
      fill="#fff"
    />
  </svg>
)

export default CloseDrawer
