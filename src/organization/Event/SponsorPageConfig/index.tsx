import styled from 'styled-components'
import React, {useEffect, useState} from 'react'
import Layout from 'organization/user/Layout'
import {Sponsor} from 'Event'
import {useSponsors} from 'Event/SponsorPage'
import {useOrganization} from 'organization/OrganizationProvider'
import {OrganizationActionsProvider} from 'Event/ActionsProvider'
import Page from 'organization/Event/Page'
import AddSponsorButton from 'organization/Event/SponsorPageConfig/AddSponsorButton'
import FieldEditDialog from 'organization/Event/SponsorPageConfig/FieldEditDialog'
import TitleField from 'organization/Event/SponsorPageConfig/TitleField'
import SponsorList from 'organization/Event/SponsorPageConfig/SponsorList'
import {PointsProvider} from 'Event/PointsProvider'
import ImageEditDialog from 'organization/Event/SponsorPageConfig/ImageEditDialog'
import QuestionIconUpload from 'organization/Event/SponsorPageConfig/QuestionIconUpload'

export default function SponsorPageConfig() {
  const {sponsors, add, update, remove, loading} = useSponsorList()
  const [fieldEditSponsor, setFieldEditSponsor] = useState<Sponsor | null>(null)
  const [imageEditSponsor, setImageEditSponsor] = useState<Sponsor | null>(null)

  const editFields = (sponsor: Sponsor) => setFieldEditSponsor(sponsor)
  const editImage = (sponsor: Sponsor) => setImageEditSponsor(sponsor)

  const handleAddedSponsor = (newSponsor: Sponsor) => {
    add(newSponsor)
    editFields(newSponsor)
  }

  const closeFieldDialog = () => setFieldEditSponsor(null)
  const closeImageDialog = () => setImageEditSponsor(null)

  const handleUpdatedSponsor = (target: Sponsor) => {
    update(target)
    closeFieldDialog()
    closeImageDialog()
  }

  const handleRemove = (sponsor: Sponsor) => {
    remove(sponsor)
    closeFieldDialog()
  }

  const loader = (
    <Layout>
      <Page>
        <div>loading...</div>
      </Page>
    </Layout>
  )

  if (loading) {
    return loader
  }

  return (
    <OrganizationActionsProvider loader={loader}>
      <PointsProvider>
        <>
          <FieldEditDialog
            sponsor={fieldEditSponsor}
            onClose={closeFieldDialog}
            onUpdate={handleUpdatedSponsor}
            onRemove={handleRemove}
          />
          <ImageEditDialog
            sponsor={imageEditSponsor}
            onClose={closeImageDialog}
            onUpdate={handleUpdatedSponsor}
          />
          <Layout>
            <Page>
              <TitleField />
              <StyledQuestionIconUpload />
              <StyledAddSponsorButton onAdd={handleAddedSponsor} />
              <SponsorList
                sponsors={sponsors}
                onEditField={editFields}
                onEditImage={editImage}
                onUpdate={handleUpdatedSponsor}
              />
            </Page>
          </Layout>
        </>
      </PointsProvider>
    </OrganizationActionsProvider>
  )
}

function useSponsorList() {
  const {client} = useOrganization()

  const {data: saved, loading} = useSponsors(client)

  const [sponsors, setSponsors] = useState<Sponsor[]>([])

  useEffect(() => {
    if (!saved) {
      return
    }

    setSponsors(saved)
  }, [saved])

  const add = (newSponsor: Sponsor) => {
    const added = [...sponsors, newSponsor]
    setSponsors(added)
  }

  const update = (target: Sponsor) => {
    const updated = sponsors.map((s) => {
      const isTarget = s.id === target.id
      if (isTarget) {
        return target
      }

      return s
    })

    setSponsors(updated)
  }

  const remove = (target: Sponsor) => {
    const removed = sponsors.filter((s) => s.id !== target.id)
    setSponsors(removed)
  }

  return {
    sponsors,
    add,
    update,
    remove,
    loading,
  }
}

const StyledAddSponsorButton = styled(AddSponsorButton)`
  margin-bottom: ${(props) => props.theme.spacing[8]}!important;
`

const StyledQuestionIconUpload = styled(QuestionIconUpload)`
  margin-bottom: ${(props) => props.theme.spacing[4]}!important;
`
