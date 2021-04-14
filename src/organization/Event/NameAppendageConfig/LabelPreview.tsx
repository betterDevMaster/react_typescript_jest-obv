import React from "react";

export function LabelPreview  (props:{
    text: string
    emoji: string
    withoutDash?: boolean
}) {
    return (
        <>
            {props.withoutDash? "" : "-"} {props.text} {props.emoji}
        </>
    )
}