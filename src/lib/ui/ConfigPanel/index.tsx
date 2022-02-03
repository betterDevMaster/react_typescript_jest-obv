import React, {useEffect, useState} from 'react'
import styled from 'styled-components'

import Drawer from '@material-ui/core/Drawer'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import {Hidden} from '@material-ui/core'

import IconButton from 'lib/ui/IconButton'
import Box from 'lib/ui/Box'
import Icon from 'lib/ui/Icon'
import {Typography} from 'lib/ui/typography'
import CloseDrawerIcon from './icons/CloseDrawer'
import StylingIcon from './icons/Styling'
import RulesIcon from './icons/Rules'

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
            <CloseDrawerIcon />
          </IconButton>
        </CloseButtonContainer>
        <Container>
          <Typography
            fontSize={24}
            lineHeight={28}
            fontWeight="normal"
            color="#DFDFDF"
          >
            {props.title}
          </Typography>
        </Container>
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
            label={<Label tabLabel={STYLING} icon={<StylingIcon />} />}
            disabled={!Boolean(props.styling)}
          />
          <StyledTab
            value={RULES}
            label={<Label tabLabel={RULES} icon={<RulesIcon />} />}
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
      {value === index && <Container>{children}</Container>}
    </div>
  )
}

function Label(props: {
  iconName?: string
  tabLabel: string
  icon?: React.ReactElement
}) {
  const {iconName, tabLabel, icon} = props

  return (
    <FlexBox>
      <IconContainer>
        {iconName ? <StyledIcon className={iconName} iconSize={24} /> : icon}
      </IconContainer>
      <Hidden xsDown>
        <Typography
          fontSize={16}
          lineHeight={19}
          fontWeight="normal"
          color="#FFFFFF"
        >
          {tabLabel}
        </Typography>
      </Hidden>
    </FlexBox>
  )
}

const Container = styled(Box)`
  padding: 24px 20px;
`

const FlexBox = styled(Box)`
  display: flex;
  align-items: center;
`

const IconContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 10px;
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    padding-right: 0;
  }
`

const StyledIcon = styled(Icon)`
  font-size: 20px;
`

const CloseButtonContainer = styled(Box)`
  position: fixed;
  margin-left: -${(props) => props.theme.spacing[4]};
  margin-top: ${(props) => props.theme.spacing[3]};
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 0;
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

const StyledTabs = styled(Tabs)`
  .MuiTabs-indicator {
    background-color: unset;
  }
`

const StyledTab = styled(Tab)`
  &.MuiTab-root {
    margin: 0px 1px;
    background-color: #353535;
    @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
      width: 33%;
    }
  }
  &.Mui-selected {
    background-color: ${(props) => props.theme.colors.primary};
  }
`
