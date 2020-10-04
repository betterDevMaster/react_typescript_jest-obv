import {MainNavButtonConfig} from 'Dashboard/Template/SimpleBlog/MainNavButton/MainNavButtonConfig'
import {Component} from 'Dashboard/edit/state/actions'
import {MAIN_NAV_BUTTON} from 'Dashboard/Template/SimpleBlog/MainNavButton'
import React from 'react'
import {WELCOME_TEXT} from 'Dashboard/Template/SimpleBlog/WelcomeText'
import WelcomeTextConfig from 'Dashboard/Template/SimpleBlog/WelcomeText/WelcomeTextConfig'
import {SIMPLE_BLOG} from 'Dashboard/Template/SimpleBlog'
import SimpleBlogConfig from 'Dashboard/Template/SimpleBlog/SimpleBlogConfig'

export function ComponentConfig(props: {component: Component | null}) {
  if (!props.component) {
    return null
  }

  switch (props.component.type) {
    case MAIN_NAV_BUTTON:
      return <MainNavButtonConfig id={props.component.id} />
    case WELCOME_TEXT:
      return <WelcomeTextConfig />
    case SIMPLE_BLOG:
      return <SimpleBlogConfig />
  }
}
