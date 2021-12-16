import React from 'react'

import {useTemplate} from 'Event/TemplateProvider'

import SimpleBlogLeaderboardConfig from 'Event/template/SimpleBlog/Leaderboard/LeaderboardConfig'
import PanelsLeaderboardConfig from 'Event/template/Panels/Dashboard/Leaderboard/LeaderboardConfig'
import CardsLeaderboardConfig from 'Event/template/Cards/Leaderboard/LeaderboardConfig'
import FiftyBlogLeaderboardConfig from 'Event/template/FiftyBlog/Dashboard/Leaderboard/LeaderboardConfig'
import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import {PANELS} from 'Event/template/Panels'
import {CARDS} from 'Event/template/Cards'
import {FIFTY_BLOG} from 'Event/template/FiftyBlog'

export type LeaderboardConfigProps = {onComplete: () => void}

export default function LeaderboardSettingsDialog(props: {
  onClose: () => void
  visible: boolean
}) {
  const {visible, onClose} = props
  const {name} = useTemplate()

  switch (name) {
    case SIMPLE_BLOG:
      return (
        <SimpleBlogLeaderboardConfig isVisible={visible} onClose={onClose} />
      )
    case PANELS:
      return <PanelsLeaderboardConfig isVisible={visible} onClose={onClose} />
    case CARDS:
      return <CardsLeaderboardConfig isVisible={visible} onClose={onClose} />
    case FIFTY_BLOG:
      return (
        <FiftyBlogLeaderboardConfig isVisible={visible} onClose={onClose} />
      )
    default:
      throw new Error(
        `Missing Leaderboard Settins Dialog for template: ${name}`,
      )
  }
}
