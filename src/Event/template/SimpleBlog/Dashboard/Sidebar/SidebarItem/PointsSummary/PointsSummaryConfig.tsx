import React, {useState} from 'react'
import EventImageUpload from 'organization/Event/DashboardConfig/EventImageUpload'
import {useEvent} from 'Event/EventProvider'
import ComponentConfig, {
  ComponentConfigProps,
  SaveButton,
} from 'organization/Event/DashboardConfig/ComponentConfig'
import {Controller, useForm} from 'react-hook-form'
import TextEditor from 'lib/ui/form/TextEditor'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import InputLabel from '@material-ui/core/InputLabel'
import Alert from '@material-ui/lab/Alert'
import AlertTitle from '@material-ui/lab/AlertTitle'
import {PointsSummaryProps} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/PointsSummary'
import {useEditSidebarItem} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem'
import {useToggle} from 'lib/toggle'
import {Rule} from 'Event/attendee-rules'
import RuleConfig from 'Event/attendee-rules/RuleConfig'
import ConfigureRulesButton from 'Event/attendee-rules/ConfigureRulesButton'

export function PointsSummaryConfig(
  props: ComponentConfigProps & {
    points: PointsSummaryProps
  },
) {
  const {isVisible, onClose, points} = props
  const {event} = useEvent()
  const {handleSubmit, control} = useForm()
  const {update} = useEditSidebarItem()
  const {flag: showingRules, toggle: toggleRules} = useToggle()
  const [rules, setRules] = useState<Rule[]>(points.rules || [])

  const save = (data: PointsSummaryProps) => {
    update({...data, rules})
    onClose()
  }

  return (
    <ComponentConfig title="Points" isVisible={isVisible} onClose={onClose}>
      <form onSubmit={handleSubmit(save)}>
        <RuleConfig
          visible={showingRules}
          close={toggleRules}
          rules={rules}
          onChange={setRules}
        >
          <>
            <ConfigureRulesButton onClick={toggleRules} />
            <EventImageUpload
              label="Points Logo"
              property="points_summary_logo"
              current={event.points_summary_logo}
            />
            <Box mb={2}>
              <Alert severity="info">
                <AlertTitle>Variables</AlertTitle>
                <div>
                  <Typography variant="caption">
                    {`{{leaderboard_points}} - Attendee's current points`}
                  </Typography>
                </div>
                <Typography variant="caption">
                  {`{{points_unit}} - Name for points`}
                </Typography>
              </Alert>
            </Box>
            <Box mb={2}>
              <Box mb={1}>
                <InputLabel>Summary</InputLabel>
              </Box>
              <Controller
                name="summary"
                control={control}
                defaultValue={points.summary || ''}
                render={({value, onChange}) => (
                  <TextEditor
                    data={value}
                    onChange={onChange}
                    customToolBars={['bold', 'italic', 'link', 'alignment']}
                    customLinks={['leaderboardLink']}
                  />
                )}
              />
            </Box>
            <Box mb={1}>
              <Box mb={1}>
                <InputLabel>Description</InputLabel>
              </Box>
              <Controller
                name="description"
                control={control}
                defaultValue={points.description || ''}
                render={({value, onChange}) => (
                  <TextEditor
                    data={value}
                    onChange={onChange}
                    customToolBars={['bold', 'italic', 'link', 'alignment']}
                    customLinks={['leaderboardLink']}
                  />
                )}
              />
            </Box>
            <SaveButton />
          </>
        </RuleConfig>
      </form>
    </ComponentConfig>
  )
}
