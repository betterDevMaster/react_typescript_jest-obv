import React, {Fragment, useState} from 'react'
import Drawer from '@material-ui/core/Drawer'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Box from '@material-ui/core/Box'
import Icon from 'lib/ui/Icon'
import Typography from '@material-ui/core/Typography'
import styled from 'styled-components'
import {muiDarkTheme, muiTheme} from 'lib/ui/theme'
import {ThemeProvider} from '@material-ui/core/styles'
import {onChangeStringHandler} from 'lib/dom'

type Anchor = 'top' | 'left' | 'bottom' | 'right'

const STYLING = 'STYLING'
const SETTINGS = 'SETTINGS'
const RULES = 'RULES'

type ConfigPanelProps = {
  title?: string
  position?: Anchor
  open: boolean
  settings?: JSX.Element
  styling?: JSX.Element
  rules?: JSX.Element
  onClose?: () => void
}

export default function ConfigPanel(props: ConfigPanelProps) {
  const [value, setValue] = useState(SETTINGS)
  const position = props.position || 'right'

  return (
    <ThemeProvider theme={muiDarkTheme}>
      <Fragment key={position}>
        <Drawer anchor={position} open={props.open} onClose={props.onClose}>
          <Box p={3}>
            <Typography variant="h5">{props.title}</Typography>
          </Box>
          <Tabs
            value={value}
            onChange={(e) => onChangeStringHandler(setValue)}
            aria-label="wrapped label tabs example"
          >
            <Tab
              value={SETTINGS}
              label={<Label tabLabel={SETTINGS} iconName="fas fa-cog" />}
              wrapped
              disabled={!Boolean(props.settings)}
            ></Tab>
            <Tab
              value={STYLING}
              label={<Label tabLabel={STYLING} iconName="fas fa-code" />}
              disabled={!Boolean(props.styling)}
            />
            <Tab
              value={RULES}
              label={<Label tabLabel={RULES} iconName="fas fa-pencil-ruler" />}
              disabled={!Boolean(props.rules)}
            />
          </Tabs>
          <TabPanel value={value} index={SETTINGS}>
            {props.settings}
          </TabPanel>
          <TabPanel value={value} index={STYLING}>
            {props.styling}
          </TabPanel>
          <TabPanel value={value} index={RULES}>
            {props.rules}
          </TabPanel>
        </Drawer>
      </Fragment>
    </ThemeProvider>
  )
}

function TabPanel(props: {children?: React.ReactNode; index: any; value: any}) {
  const {children, value, index, ...other} = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`wrapped-tabpanel-${index}`}
      aria-labelledby={`wrapped-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  )
}

function Label(props: {iconName: string; tabLabel: string}) {
  const {iconName, tabLabel} = props

  return (
    <FlexBox>
      <StyledIcon className={iconName} iconSize={18} />
      <Typography>{tabLabel}</Typography>
    </FlexBox>
  )
}

const FlexBox = styled(Box)`
  display: flex;
`
const StyledIcon = styled(Icon)`
  padding: ${(props) => `0px ${props.theme.spacing[2]}`};
`
