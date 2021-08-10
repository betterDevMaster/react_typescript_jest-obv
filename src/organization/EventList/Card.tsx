import styled from 'styled-components'
import grey from '@material-ui/core/colors/grey'
import React, {useState} from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import {spacing} from 'lib/ui/theme'
import Typography from '@material-ui/core/Typography'
import {appRoot} from 'env'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import {ObvioEvent} from 'Event'
import {useEventRoutes} from 'organization/Event/EventRoutes'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import IconButton from '@material-ui/core/IconButton'

export default function Card(props: {event: ObvioEvent}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const label = `view ${props.event.name}`
  const routes = useEventRoutes(props.event)

  const open = Boolean(anchorEl)

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget)
  const handleCloseMenu = () => setAnchorEl(null)

  return (
    <Container>
      <RelativeLink to={routes.root} disableStyles aria-label={label}>
        <Box>
          <Name>{props.event.name}</Name>
          <URL variant="caption">
            {props.event.slug}.{appRoot}
          </URL>
        </Box>
      </RelativeLink>
      <Bottom>
        <IconButton
          onClick={handleOpenMenu}
          aria-label="show event menu"
          aria-haspopup="true"
          aria-controls="event-menu"
        >
          <MoreHorizIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          id="event-menu"
          keepMounted
          open={open}
          onClose={handleCloseMenu}
          MenuListProps={{
            disablePadding: true,
          }}
        >
          <RelativeLink
            to={routes.duplicate}
            disableStyles
            aria-label="duplicate event"
          >
            <MenuItem>Duplicate</MenuItem>
          </RelativeLink>
        </Menu>
      </Bottom>
    </Container>
  )
}

const Box = styled.div`
  border: 1px solid ${(props) => props.theme.colors.border};
  padding: ${(props) => props.theme.spacing[5]};
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 180px;

  &:hover {
    background: ${grey[200]};
  }
`

const Name = styled.h5`
  margin: 0;
  font-size: 28px;
`

const URL = withStyles({
  root: {
    display: 'block',
    marginTop: spacing[1],
  },
})(Typography)

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${(props) => props.theme.spacing[4]};
`

const Bottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`
