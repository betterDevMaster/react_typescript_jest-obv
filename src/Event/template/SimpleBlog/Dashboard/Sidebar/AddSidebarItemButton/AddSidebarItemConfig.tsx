import FormControl from '@material-ui/core/FormControl'
import {v4 as uuid} from 'uuid'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import {EMOJI_LIST} from 'Event/template/Panels/Dashboard/EmojiList'
import {SidebarItemProps} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem'
import {
  AGENDA_LIST,
  createAgendaList,
} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/AgendaList'
import {
  createResourceList,
  RESOURCE_LIST,
} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/ResourceList'
import {
  createSidebarNav,
  SIDEBAR_NAV,
} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/SidebarNav'
import {
  createPointsSummary,
  POINTS_SUMMARY,
} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/PointsSummary'
import {onUnknownChangeHandler} from 'lib/dom'
import ComponentConfig, {
  SaveButton,
} from 'organization/Event/DashboardConfig/ComponentConfig'
import React, {useEffect, useState} from 'react'
import {
  createTicketRibbonList,
  TICKET_RIBBON_LIST,
} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/TicketRibbonList'
import {
  createText,
  TEXT,
} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/Text'
import Select from '@material-ui/core/Select'
import {useForm} from 'react-hook-form'
import {useSimpleBlogUpdate} from 'Event/template/SimpleBlog'
import {createEmojiList} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/EmojiList'

export default function AddSidebarItemConfig(props: {
  showing: boolean
  onClose: () => void
}) {
  const {showing, onClose} = props
  const [type, setType] = useState<SidebarItemProps['type'] | null>(null)
  const {handleSubmit} = useForm()
  const update = useSimpleBlogUpdate()

  /**
   * Reset selecter on close
   */
  useEffect(() => {
    if (!showing) {
      setType(null)
    }
  }, [showing])

  const add = () => {
    if (!type) {
      return
    }

    const id = uuid()
    const item = createItem(type)

    update({
      sidebarItems: {
        [id]: item,
      },
    })

    onClose()
  }

  return (
    <ComponentConfig
      isVisible={showing}
      onClose={onClose}
      title="Add Sidebar Item"
    >
      <form onSubmit={handleSubmit(add)}>
        <FormControl fullWidth>
          <InputLabel>Pick one</InputLabel>
          <Select
            defaultValue=""
            onChange={onUnknownChangeHandler(setType)}
            inputProps={{
              'aria-label': 'select sidebar item',
            }}
          >
            <MenuItem value={AGENDA_LIST}>Agendas</MenuItem>
            <MenuItem value={EMOJI_LIST}>Emojis</MenuItem>
            <MenuItem value={RESOURCE_LIST}>Resources</MenuItem>
            <MenuItem value={POINTS_SUMMARY}>Points Summary</MenuItem>
            <MenuItem value={SIDEBAR_NAV}>Sidebar Buttons</MenuItem>
            <MenuItem value={TICKET_RIBBON_LIST}>Ticket Ribbons</MenuItem>
            <MenuItem value={TEXT}>Text</MenuItem>
          </Select>
        </FormControl>
        <SaveButton type="submit" disabled={!type} aria-label="add item">
          ADD
        </SaveButton>
      </form>
    </ComponentConfig>
  )
}

function createItem(type: SidebarItemProps['type']): SidebarItemProps {
  switch (type) {
    case AGENDA_LIST:
      return createAgendaList()
    case EMOJI_LIST:
      return createEmojiList()
    case RESOURCE_LIST:
      return createResourceList()
    case POINTS_SUMMARY:
      return createPointsSummary()
    case SIDEBAR_NAV:
      return createSidebarNav()
    case TICKET_RIBBON_LIST:
      return createTicketRibbonList()
    case TEXT:
      return createText()
  }
}
