import React, {useEffect} from 'react'
import {Helmet} from 'react-helmet'

export default function WithLiveChatSupport(props: {
  children: React.ReactElement | React.ReactElement[]
}) {
  return (
    <>
      <Helmet>
        <script>
          {`
    window.__lc = window.__lc || {};
    window.__lc.license = 11913300;
    ;(function(n,t,c){function i(n){return e._h?e._h.apply(null,n):e._q.push(n)}var e={_q:[],_h:null,_v:"2.0",on:function(){i(["on",c.call(arguments)])},once:function(){i(["once",c.call(arguments)])},off:function(){i(["off",c.call(arguments)])},get:function(){if(!e._h)throw new Error("[LiveChatWidget] You can't use getters before load.");return i(["get",c.call(arguments)])},call:function(){i(["call",c.call(arguments)])},init:function(){var n=t.createElement("script");n.async=!0,n.type="text/javascript",n.src="https://cdn.livechatinc.com/tracking.js",t.head.appendChild(n)}};!n.__lc.asyncInit&&e.init(),n.LiveChatWidget=n.LiveChatWidget||e}(window,document,[].slice))
    `}
        </script>
        <noscript>
          {`
        <a
          href="https://www.livechatinc.com/chat-with/11913300/"
          rel="nofollow"
        >
          Chat with us
        </a>
        , powered by{' '}
        <a
          href="https://www.livechatinc.com/?welcome"
          rel="noopener nofollow"
          target="_blank"
        >
          LiveChat
        </a>
`}
        </noscript>
      </Helmet>
      {props.children}
    </>
  )
}

/**
 * Hides the live chat widget on load.
 *
 * reference: https://developers.livechat.com/docs/extending-chat-widget/javascript-api/#hide
 *
 * @param props
 * @returns
 */
export function HideLiveChatSupport(props: {
  children: React.ReactElement | React.ReactElement[]
}) {
  useEffect(() => {
    // @ts-ignore
    const lc = window.LiveChatWidget

    if (!lc) {
      // Not loaded, ignore
      return
    }

    lc.call('hide')

    return () => {
      lc.call('show')
    }
  }, [])

  return <>{props.children}</>
}