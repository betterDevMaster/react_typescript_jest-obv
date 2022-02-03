import TextField from '@material-ui/core/TextField'
import React, {useState} from 'react'
import ComponentConfig, {
  ComponentConfigProps,
  SaveButton,
} from 'organization/Event/DashboardConfig/ComponentConfig'
import {useForm} from 'react-hook-form'
import {ResourceListProps} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/ResourceList'
import {useEditSidebarItem} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem'
import {useToggle} from 'lib/toggle'
import RuleConfig from 'Event/attendee-rules/RuleConfig'
import ConfigureRulesButton from 'Event/attendee-rules/ConfigureRulesButton'
import {Rule} from 'Event/attendee-rules'

export function ResourceListConfig(
  props: ComponentConfigProps & {
    list: ResourceListProps
  },
) {
  const {isVisible, onClose, list} = props
  const {handleSubmit, register} = useForm()
  const {update} = useEditSidebarItem()
  const {flag: showingRules, toggle: toggleRules} = useToggle()
  const [rules, setRules] = useState<Rule[]>(list.rules || [])

  const save = (data: Pick<ResourceListProps, 'title' | 'description'>) => {
    update({...data, rules})
    onClose()
  }

  return (
    <ComponentConfig isVisible={isVisible} onClose={onClose} title="Resources">
      <form onSubmit={handleSubmit(save)}>
        <RuleConfig
          visible={showingRules}
          close={toggleRules}
          rules={rules}
          onChange={setRules}
        >
          <>
            <ConfigureRulesButton onClick={toggleRules} />
            <TextField
              defaultValue={list.title}
              name="title"
              inputProps={{
                'aria-label': 'update resources title',
                ref: register,
              }}
              label="Title"
              fullWidth
            />

            <TextField
              name="description"
              defaultValue={list.description}
              inputProps={{
                'aria-label': 'update resources description',
                ref: register,
              }}
              label="Description"
              fullWidth
            />
            <SaveButton />
          </>
        </RuleConfig>
      </form>
    </ComponentConfig>
  )
}
