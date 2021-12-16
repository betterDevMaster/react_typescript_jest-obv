import React, {useEffect} from 'react'
import {Helmet} from 'react-helmet'
import {TeamMember} from 'auth/user'

export default function WithLiveChatSupport(props: {
  children: React.ReactElement | React.ReactElement[]
  user?: TeamMember
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
      <UserVariables user={props.user} />
      {props.children}
    </>
  )
}

function UserVariables(props: {user?: TeamMember}) {
  const {user} = props
  if (!user) {
    return null
  }

  const name = `${user.first_name} ${user.last_name}`
  const email = user.email
  const isFounder = user.is_founder ? 'YES' : 'NO'
  const isSubscribed = user.is_subscribed ? 'YES' : 'NO'
  const numCredits = user.credits
  const plan = user.plan?.name || 'NO PLAN / SUBSCRIPTION'

  return (
    <Helmet>
      <script>
        {`
          const lc = window.LiveChatWidget;
          if (lc) {
            lc.call("set_customer_name", "${name}");
            lc.call("set_customer_email", "${email}");
            lc.call("update_session_variables", {
              is_founder: "${isFounder}",
              is_owner: "${isSubscribed}",
              credits: "${numCredits}",
              plan: "${plan}"
            });
          } 
        `}
      </script>
    </Helmet>
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
