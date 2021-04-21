import Grid from '@material-ui/core/Grid'
import React, {useState} from 'react'
import {Button} from '@material-ui/core'
import styled from 'styled-components'
import {emojiesList} from "organization/Event/NameAppendageConfig/EmojiSelector/emojiesList";

export default function EmojiesSelector(props: {
    selected?: string
    callback: (emoji: string) => void
}) {
    const [showEmojies, setShowEmojies] = useState<boolean>(false)
    const toggleButtonHandle = () => {
        if (showEmojies) {
            setShowEmojies(false)
        } else {
            setShowEmojies(true)
        }
    }

    const HandleSelect = (emoji: string) => {
        if (props.selected == emoji) {
            props.callback('')
        } else {
            setShowEmojies(false)
            props.callback(emoji)
        }
    }

    const CleanSelectedEmoji = () => {
        props.callback('')
    }

    const ToggleButton = () => {
        return (
            <>
                <StyledToggleButton onClick={() => toggleButtonHandle()}>
                    {' '}
                    {showEmojies
                        ? 'Hide label emojies list'
                        : props.selected
                            ? 'Selected emoji: ' + props.selected
                            : 'Select label emoji'}{' '}
                </StyledToggleButton>
                <StyledCloseButton onClick={CleanSelectedEmoji}>X</StyledCloseButton>
            </>
        )
    }

    function GenerateEmojiWithButton(props: {
        emoji: string
        onSelect: () => void
        selected?: string
    }) {
        if (props.emoji === props.selected) {
            return (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        props.onSelect()
                    }}
                >
                    {props.emoji}
                </Button>
            )
        } else {
            return (
                <Button
                    onClick={() => {
                        props.onSelect()
                    }}
                >
                    {props.emoji}
                </Button>
            )
        }
    }

    const ShowEmojiSelector = () => {
        return (
            <EmojiSelectorContainer>
                <ToggleButton />
                <EmojiSelectorGrid container>
                    {emojiesList.map((emoji, index) => (
                        <Grid item sm={1} key={index}>
                            <GenerateEmojiWithButton
                                emoji={emoji}
                                onSelect={() => HandleSelect(emoji)}
                                selected={props.selected}
                            />
                        </Grid>
                    ))}
                </EmojiSelectorGrid>
            </EmojiSelectorContainer>
        )
    }

    const HideEmojiSelector = () => {
        return (
            <>
                <ToggleButton />
            </>
        )
    }

    return <>{showEmojies ? <ShowEmojiSelector /> : <HideEmojiSelector />}</>
}

const StyledToggleButton = styled(Button)`
  border-bottom: 1px solid rgba(0, 0, 0, 0.87) !important;
  border-radius: 0 !important;
  text-align: left !important;
  width: 88% !important;
`

const StyledCloseButton = styled(Button)`
  background: #ff0021 !important;
  color: white !important;
  width: 12% !important;
`

const EmojiSelectorContainer = styled.div`
  background: rgba(0, 0, 0, 0.04);
`
const EmojiSelectorGrid = styled(Grid)`
  padding-right: 20px;
`
