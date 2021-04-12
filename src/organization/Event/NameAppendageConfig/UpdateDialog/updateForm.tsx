import React, {useEffect, useRef, useState} from 'react'
import {NameAppendage} from "../NameAppendageProvider";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import {onUnknownChangeHandler} from "lib/dom";
import MenuItem from "@material-ui/core/MenuItem";
import {useForm} from "react-hook-form";
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import {Rule} from "Event/Dashboard/component-rules";
import {api} from "lib/url";
import {useEvent} from "Event/EventProvider";
import {useOrganization} from "organization/OrganizationProvider";
import RuleConfig from "Event/Dashboard/component-rules/RuleConfig";
import {emojiesList} from "organization/Event/NameAppendageConfig/emojiesList";
export default function NameAppendageUpdateForm(props: {
    onClose: () => void
    nameAppendage: NameAppendage | null
    nameAppendages: NameAppendage[]
    setNameAppendages: (nameAppendage: NameAppendage[]) => void
}) {

    const {event} = useEvent()
    const {client} = useOrganization()
    const [submitting, setSubmitting] = useState(false)
    const {register, handleSubmit, setValue, errors} = useForm()
    const [emoji, setEmoji] = useState<string>('')
    const [error, setError] = useState<string | null>(null)
    const [rules, setRules] = useState<Rule[]>([])
    const updateRules = () => (value: Rule[]) => setRules(value)
    const mounted = useRef(true)

    useEffect(() => {
        if (mounted.current) {
            if(props.nameAppendage){
                setRules(JSON.parse(props.nameAppendage.rules))
                setEmoji(props.nameAppendage.appendage_emoji)
            }
        }
    }, [mounted])

    if(!props.nameAppendage){
        return null
    }

    const updateURL = api(`/events/${event.slug}/name-appendage/update/${props.nameAppendage.id}`)
    const submit = (data: {appendage_text: string, appendage_emoji: string, rules: Rule[]}) => {
        setSubmitting(true)
        data.rules = rules
        data.appendage_emoji = emoji
        client
            .post<NameAppendage>(updateURL, data)
            .then((nameAppendage) => {
                props.setNameAppendages(updateNameAppendageFromList(props.nameAppendages, nameAppendage))
            })
            .finally(() => {
                props.onClose()
                setSubmitting(false)
            })
    }

    function updateNameAppendageFromList(nameAppendagesList: NameAppendage[], nameAppendage: NameAppendage) {
        nameAppendagesList.map((value, index) => {
            if(value.id == nameAppendage.id){
                nameAppendagesList[index] = nameAppendage
            }
        })

        return nameAppendagesList
    }


    return (
        <>
            <form onSubmit={handleSubmit(submit)}>
                <RuleConfig
                    visible={true}
                    onChange={updateRules()}
                    rules={rules}
                    description={"Appendage will be added when"}
                >
                    <></>
                </RuleConfig>

                <TextField
                    name="appendage_text"
                    label="Appendage Text"
                    defaultValue={props.nameAppendage.appendage_text}
                    fullWidth
                    disabled={submitting}
                    inputProps={{
                        ref: register(),
                        'aria-label': 'Appendage Text',
                    }}
                />
                <Select
                    fullWidth
                    displayEmpty
                    defaultValue={props.nameAppendage.appendage_emoji}
                    disabled={submitting}
                    label="Appendage emoji"
                    value={emoji}
                    onChange={onUnknownChangeHandler(setEmoji)}
                    inputProps={{
                        ref: register(),
                        'aria-label': 'Appendage emoji',
                    }}
                >
                    <MenuItem value="">
                        Select appendage emoji
                    </MenuItem>
                    {emojiesList.map((emoji, index) => (
                        <MenuItem key={index} value={emoji}>
                            {emoji}
                        </MenuItem>
                    ))}
                </Select>

                <div>
                    <Error>{error}</Error>
                    <br />
                    <SaveButton
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={submitting}
                        type="submit"
                        aria-label="save action"
                    >
                        Update name appendage
                    </SaveButton>
                </div>
            </form>
        </>
    )
}

function Error(props: {children: string | null}) {
    if (!props.children) {
        return null
    }

    return <ErrorText>{props.children}</ErrorText>
}

const ErrorText = styled.div`
  margin-top: ${(props) => props.theme.spacing[4]};
  color: ${(props) => props.theme.colors.error};
`

const SaveButton = styled(Button)`
  margin-bottom: ${(props) => props.theme.spacing[4]}!important;
`