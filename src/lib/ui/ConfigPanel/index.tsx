import React, {useEffect, useState} from 'react'
import styled from 'styled-components'

import Drawer from '@material-ui/core/Drawer'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
import {Hidden} from '@material-ui/core'

import IconButton from 'lib/ui/IconButton'
import Box from 'lib/ui/Box'
import Icon from 'lib/ui/Icon'

const STYLING = 'STYLING'
const SETTINGS = 'SETTINGS'
const RULES = 'RULES'

type ConfigPanelProps = {
  title?: string
  open: boolean
  settings?: JSX.Element
  styling?: JSX.Element
  rules?: JSX.Element
  onClose?: () => void
}

export default function ConfigPanel(props: ConfigPanelProps) {
  const [value, setValue] = useState(SETTINGS)

  const [open, setOpen] = useState(props.open)

  useEffect(() => {
    setOpen(props.open)
  }, [props.open])

  const handleCloseConfig = () => {
    setOpen(!open)
    if (props.onClose) {
      props.onClose()
    }
  }

  return (
    <>
      <StyledDrawer anchor="right" open={open}>
        <CloseButtonContainer>
          <IconButton onClick={handleCloseConfig}>
            <Icon className="far fa-times" iconSize={24} color="light" />
          </IconButton>
        </CloseButtonContainer>
        <Box p={3}>
          <Typography variant="h5">{props.title}</Typography>
        </Box>
        <StyledTabs
          value={value}
          onChange={(_, value) => setValue(value)}
          aria-label="wrapped label tabs example"
        >
          <StyledTab
            value={SETTINGS}
            label={<Label tabLabel={SETTINGS} iconName="fas fa-cog" />}
            wrapped
            disabled={!Boolean(props.settings)}
          />
          <StyledTab
            value={STYLING}
            label={<Label tabLabel={STYLING} iconName="fas fa-code" />}
            disabled={!Boolean(props.styling)}
          />
          <StyledTab
            value={RULES}
            label={<Label tabLabel={RULES} iconName="fas fa-pencil-ruler" />}
            disabled={!Boolean(props.rules)}
          />
        </StyledTabs>
        <TabPanel value={value} index={SETTINGS}>
          {props.settings}
        </TabPanel>
        <TabPanel value={value} index={STYLING}>
          {props.styling}
        </TabPanel>
        <TabPanel value={value} index={RULES}>
          {props.rules}
        </TabPanel>
      </StyledDrawer>
    </>
  )
}

function TabPanel(props: {
  children?: React.ReactNode
  index: string
  value: string
}) {
  const {children, value, index, ...other} = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
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
      <StyledIcon className={iconName} iconSize={24} />
      <Hidden smDown>
        <Typography>{tabLabel}</Typography>
      </Hidden>
    </FlexBox>
  )
}

const FlexBox = styled(Box)`
  display: flex;
`
const StyledIcon = styled(Icon)`
  padding: ${(props) => `0px ${props.theme.spacing[2]}`};
`
const CloseButtonContainer = styled(Box)`
  position: fixed;
  margin-left: -${(props) => props.theme.spacing[6]};
  margin-top: ${(props) => props.theme.spacing[3]};
  border-top-left-radius: 50%;
  border-bottom-left-radius: 50%;
  background-color: #222222;
  width: 32px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: ${(props) => props.theme.spacing[2]};
  padding-right: ${(props) => props.theme.spacing[2]};
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    position: absolute;
    width: 100%;
    justify-content: flex-end;
    background-color: transparent;
  }

  &:hover {
    cursor: pointer;
  }
`

const StyledDrawer = styled(Drawer)`
  .MuiPaper-root {
    background-color: #222222;
    color: #fff;
    @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
      width: 90%;
      left: 5%;
      right: 5%;
      top: 3%;
      bottom: 3%;
      height: 94%;
    }
  }
`

const StyledTabs = styled(Tabs)``

const StyledTab = styled(Tab)`
  &.MuiTab-root {
    margin: 0px 5px;
    background-color: #353535;
  }
  &.Mui-selected {
    background-color: ${(props) => props.theme.colors.primary};
  }
`
