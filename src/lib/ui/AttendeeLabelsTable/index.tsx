import React, {useState} from 'react'
import styled from 'styled-components'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import IconButton from '@material-ui/core/IconButton'
import Icon from 'lib/ui/Icon'
import {Label, MenuItemLabel, TableHeader} from 'lib/ui/typography'

export type AttendeeLabelProps = {
  priority: number
  label: string
  hasVisibilityRules: boolean
}

export default function AttendeeLabelsTable(props: {
  attendeeLabels: AttendeeLabelProps[]
}) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const {attendeeLabels} = props

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)

  const handleDelete = () => {
    handleClose()
  }

  const handleEdit = () => {
    handleClose()
  }

  const handleExportList = () => {
    handleClose()
  }

  const open = Boolean(anchorEl)

  return (
    <>
      <Table>
        <tr>
          <TH minWidth={150}>
            <TableHeader>Priority</TableHeader>
          </TH>
          <TH minWidth={150}>
            <TableHeader>Label</TableHeader>
          </TH>
          <TH minWidth={400}>
            <TableHeader>Visibility Rules</TableHeader>
          </TH>
          <TH align="right">
            <Icon className="far fa-ellipsis-h" iconSize={24} />
          </TH>
        </tr>
        {attendeeLabels.map(
          (attendeeLabel: AttendeeLabelProps, index: number) => {
            const {priority, label, hasVisibilityRules} = attendeeLabel

            const last = index === attendeeLabels.length - 1
            const visibilityRuleText = hasVisibilityRules
              ? 'See rules'
              : 'No rules'

            return (
              <tr key={index}>
                <TD last={last}>
                  <TdTypography>{priority}</TdTypography>
                </TD>
                <TD last={last}>
                  <TdTypography>{label}</TdTypography>
                </TD>
                <TD last={last}>
                  <TdTypography isLink={hasVisibilityRules}>
                    {visibilityRuleText}
                  </TdTypography>
                </TD>
                <TD last={last} align="right">
                  <StyledIconButton onClick={handleOpen}>
                    <Icon className="far fa-ellipsis-h" iconSize={24} />
                  </StyledIconButton>
                </TD>
              </tr>
            )
          },
        )}
      </Table>
      <StyledMenu
        id="action-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
      >
        <StyledMenuItem onClick={handleDelete}>
          <StyledIcon className="far fa-trash-alt" iconSize={12} />
          <MenuItemLabel>Delete</MenuItemLabel>
        </StyledMenuItem>
        <StyledMenuItem onClick={handleEdit}>
          <StyledIcon className="far fa-edit" iconSize={12} />
          <MenuItemLabel>Edit</MenuItemLabel>
        </StyledMenuItem>
        <StyledMenuItem last onClick={handleExportList}>
          <StyledIcon className="fas fa-external-link-alt" iconSize={12} />
          <MenuItemLabel>Export List</MenuItemLabel>
        </StyledMenuItem>
      </StyledMenu>
    </>
  )
}

type AlignProps = 'right' | 'left' | 'center'

const Table = styled.table`
  border: 1px solid #dfdfdf;
  width: 100%;
  border-spacing: 0;
`

type THProps = {
  align?: AlignProps
  minWidth?: number
}

const TH = styled.th<THProps>`
  border-bottom: 1px solid #dfdfdf !important;
  padding: ${(props) => `${props.theme.spacing[4]} ${props.theme.spacing[3]}`};
  text-align: ${(props) => (props.align ? props.align : 'left')};
  min-width: ${(props) => (props.minWidth ? `${props.minWidth}px` : 'auto')};
`

type TDProps = {
  last?: boolean
  align?: AlignProps
  isLink?: boolean
}

const TD = styled.td<TDProps>`
  padding: ${(props) => `${props.theme.spacing[4]} ${props.theme.spacing[3]}`};
  border-bottom: ${(props) =>
    props.last ? 'none' : '1px solid #DFDFDF !important'};
  text-align: ${(props) => (props.align ? props.align : 'auto')};
`

type TdTypographyProps = {
  isLink?: boolean
}

const TdTypography = styled(Label)<TdTypographyProps>`
  cursor: ${(props) => (props.isLink ? 'pointer' : 'normal')};
  color: ${(props) => (props.isLink ? props.theme.colors.primary : '#000000')};
  text-decoration: ${(props) => (props.isLink ? 'underline' : 'none')};
`

const StyledIconButton = styled(IconButton)`
  padding: 0 0 !important;
  height: 40px;
`

const StyledMenu = styled(Menu)`
  .MuiPaper-root {
    border-radius: 0;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  }
  ul {
    padding: 0 0 !important;
  }
`

type StyledMenuItemProps = {
  last?: boolean
}

const StyledMenuItem = styled(MenuItem)<StyledMenuItemProps>`
  border-bottom: ${(props) =>
    props.last ? 'none' : '1px solid #DFDFDF !important'};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  padding: 10px 14px !important;
  width: 150px !important;
`

const StyledIcon = styled(Icon)`
  color: #4f4f4f;
`
