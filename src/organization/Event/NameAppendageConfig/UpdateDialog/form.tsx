import React, {useEffect, useRef, useState} from 'react'
import {NameAppendage, useNameAppendages} from '../NameAppendageProvider'
import TextField from '@material-ui/core/TextField'
import {useForm} from 'react-hook-form'
import styled from 'styled-components'
import Button from '@material-ui/core/Button'
import {Rule} from 'Event/Dashboard/component-rules'
import {api} from 'lib/url'
import {useEvent} from 'Event/EventProvider'
import {useOrganization} from 'organization/OrganizationProvider'
import RuleConfig, {
  useRuleConfig,
} from 'Event/Dashboard/component-rules/RuleConfig'
import ConfigureRulesButton from 'Event/Dashboard/component-rules/ConfigureRulesButton'
import {GenerateTextForVisibilityRules} from 'organization/Event/NameAppendageConfig/Helpers/GenerateTextForVisibilityRules'
import {LabelPreview} from 'organization/Event/NameAppendageConfig/Helpers/LabelPreview'
import EmojiesSelector from 'organization/Event/NameAppendageConfig/EmojiSelector'
export default function NameAppendageUpdateForm(props: {
  onClose: () => void
  nameAppendage: NameAppendage | null
}) {
  const {event} = useEvent()
  const {client} = useOrganization()
  const [submitting, setSubmitting] = useState(false)
  const {register, handleSubmit, setValue, errors} = useForm()
  const [emoji, setEmoji] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [text, setText] = useState<string>('')
  const [rules, setRules] = useState<Rule[]>([])
  const updateRules = () => (value: Rule[]) => setRules(value)
  const mounted = useRef(true)
  const [confirmWithoutRules, setConfirmWithoutRules] = useState<boolean>(false)
  const {visible: ruleConfigVisible, toggle: toggleRuleConfig} = useRuleConfig()

  const {update} = useNameAppendages()

  useEffect(() => {
    if (mounted.current) {
      if (props.nameAppendage) {
        setRules(JSON.parse(props.nameAppendage.rules))
        setEmoji(props.nameAppendage.appendage_emoji)
        setText(props.nameAppendage.appendage_text)
      }
    }
  }, [mounted])

  if (!props.nameAppendage) {
    return null
  }

  const updateURL = api(
    `/events/${event.slug}/name-appendage/update/${props.nameAppendage.id}`,
  )
  const submit = (data: {
    appendage_text: string
    appendage_emoji: string
    confirmWithoutRuleText: string
    rules: Rule[]
  }) => {
    let pass = false

    setSubmitting(true)
    data.rules = rules
    data.appendage_emoji = emoji

    if (!data.appendage_emoji && !data.appendage_text) {
      setError('Enter at least your Label text OR select a Label emoji.')
      pass = false
    } else {
      setError(null)
      pass = true
    }

    if (!rules.length && pass) {
      if (data.confirmWithoutRuleText === 'YES') {
        pass = true
        setError(null)
      } else {
        pass = false
        setConfirmWithoutRules(true)
        setError(
          'WARNING: You have not set up visibility rules for this label.  That means that ALL attendees will have this Label at the end of their name in zoom.  If this was your intention, type YES in the box below, otherwise click cancel and add a visibility rule to this label.',
        )
      }
    }

    if (pass) {
      client
        .post<NameAppendage>(updateURL, data)
        .then((nameAppendage) => {
          update(nameAppendage)
        })
        .finally(() => {
          props.onClose()
          setSubmitting(false)
        })
    } else {
      setSubmitting(false)
    }
  }

  const onEmojiSelected = (emoji: string) => {
    setEmoji(emoji)
  }

  const ConfirmWithoutRules = () => {
    if (confirmWithoutRules) {
      return (
        <>
          <TextField
            name="confirmWithoutRuleText"
            label="Type YES to confirm"
            fullWidth
            disabled={submitting}
            inputProps={{
              ref: register(),
              'aria-label': 'confirmWithoutRuleText',
            }}
          />
        </>
      )
    } else {
      return <></>
    }
  }

  return (
    <>
      <RuleConfig
        visible={ruleConfigVisible}
        onChange={updateRules()}
        rules={rules}
        close={toggleRuleConfig}
        description={'Attendee label will be added when'}
      >
        <form onSubmit={handleSubmit(submit)}>
          <ConfigureRulesButton onClick={toggleRuleConfig} />

          <p>
            <b>Visibility Rules:</b>{' '}
            <GenerateTextForVisibilityRules rules={rules} />{' '}
          </p>
          <p>
            <b>Generated label:</b> <LabelPreview text={text} emoji={emoji} />
          </p>

          <TextField
            name="appendage_text"
            label="Label Text"
            onChange={(e) => setText(e.target.value)}
            value={text}
            fullWidth
            disabled={submitting}
            inputProps={{
              ref: register(),
              'aria-label': 'Appendage Text',
            }}
          />

          <EmojiesSelector selected={emoji} callback={onEmojiSelected} />

          <div>
            <Error>{error}</Error>
            <br />
            <ConfirmWithoutRules />
            <SaveButton
              variant="contained"
              color="primary"
              fullWidth
              disabled={submitting}
              type="submit"
              aria-label="save action"
            >
              Update attendee label
            </SaveButton>
          </div>
        </form>
      </RuleConfig>
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
