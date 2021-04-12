import React, {useState} from 'react'
import {useForm} from 'react-hook-form'
import TextField from '@material-ui/core/TextField'
import styled from 'styled-components'
import Button from '@material-ui/core/Button'
import {api} from 'lib/url'
import {useEvent} from 'Event/EventProvider'
import {useOrganization} from 'organization/OrganizationProvider'
import {NameAppendage} from "../NameAppendageProvider";
import {Rule} from "Event/Dashboard/component-rules";
import Select from "@material-ui/core/Select";
import {onUnknownChangeHandler} from "lib/dom";
import MenuItem from "@material-ui/core/MenuItem";
import RuleConfig, {useRuleConfig} from "Event/Dashboard/component-rules/RuleConfig";
import {emojiesList} from "organization/Event/NameAppendageConfig/emojiesList";

export default function NameAppendageAddForm(props: {
    onClose: () => void
    nameAppendages: NameAppendage[]
    setNameAppendages: (name_appendage: NameAppendage[]) => void
}) {
    const {register, handleSubmit, setValue, errors} = useForm()
    const [submitting, setSubmitting] = useState(false)
    const {event} = useEvent()
    const {client} = useOrganization()
    const [error, setError] = useState<string | null>(null)
    const [rules, setRules] = useState<Rule[]>([])
    const [emoji, setEmoji] = useState<string>('')
    const {visible: ruleConfigVisible, toggle: toggleRuleConfig} = useRuleConfig()

    const submit = (data: {appendage_text: string, appendage_emoji: string, rules: Rule[]}) => {
        setSubmitting(true)
        data.rules = rules
        data.appendage_emoji = emoji
        const url = api(`/events/${event.slug}/name-appendage/create`)
        client
            .post<NameAppendage>(url, data)
            .then((nameAppendage) => {
                props.setNameAppendages([...props.nameAppendages, nameAppendage])
            })
            .finally(() => {
                props.onClose()
                setSubmitting(false)
            })
    }

    const updateRules = () => (value: Rule[]) => setRules(value)

    return (
        <>
            <RuleConfig
                visible={true}
                onChange={updateRules()}
                rules={rules}
                description={"Appendage will be added when"}
            >
                <></>
            </RuleConfig>
            <form onSubmit={handleSubmit(submit)}>
                <TextField
                    name="appendage_text"
                    label="Appendage Text"
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
                    defaultValue={""}
                    disabled={submitting}
                    label="Appendage emoji"
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
                        Add name appendage
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