import Button from '@material-ui/core/Button'
import React from 'react'

export default function NameAppendageAddButton(props: {openAdd: () => void}) {
    return (
        <Button
            variant="contained"
            color="primary"
            onClick={props.openAdd}
            aria-label="add name appendage"
        >
            Add name appendage
        </Button>
    )
}