import {MainNavButtonConfig} from 'Dashboard/templates/SimpleBlog/MainNavButton/MainNavButtonConfig'
import {Component} from 'Dashboard/edit/state/actions'
import {MAIN_NAV_BUTTON} from 'Dashboard/templates/SimpleBlog/MainNavButton'
import React from 'react'

export function ComponentConfig(props: {component: Component | null}) {
  if (!props.component) {
    return null
  }

  switch (props.component.type) {
    case MAIN_NAV_BUTTON:
      return <MainNavButtonConfig id={props.component.id} />
  }
}
