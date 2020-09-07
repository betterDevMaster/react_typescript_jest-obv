import React from 'react'
import styled from 'styled-components'

export default function Footer() {
  return (
    <Box>
      <div>
        <a href="/terms">Terms of Service</a> •{' '}
        <a href="/privacy-policy">Privacy Policy</a>
      </div>
      <p>© 2020 Roz Business Strategies. All Rights Reserved.</p>
    </Box>
  )
}

const Box = styled.div`
  padding: 40px 25px 25px;
  background: #201e1f;
  color: #90999e;
  text-align: center;

  a {
    color: #ffffff;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`
