import React from 'react'
import {Provider} from 'react-redux'
import {store} from 'store'

export default function StoreProvider(props: {children: React.ReactNode}) {
  return <Provider store={store}>{props.children}</Provider>
}
