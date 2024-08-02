import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { NextSeo } from 'next-seo'
import { withSession } from '@/lib/iron-session'
import prisma from '@/lib/db'
import EditYourMiiCard from '@/components/mii/EditYourMiiCard'
import ENV from '@/lib/constants/environmentVariables'
import LanguageContext from '@/components/shared/LanguageContext'

export const getServerSideProps = withSession(async ({ req }) => {
  const username = req.session?.username

  if (!username) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  const miiInfo = await prisma.user.findUnique({
    where: {
      username
    },
    select: {
      mii_type: true,
      mii_data: true,
      cmoc_entry_no: true
    }
  })

  return { props: { miiInfo } }
})

function MiiPage ({ miiInfo }) {
  return (
    <LanguageContext.Helper.Consumer>
      {(lang) => (
        <Container>
          <NextSeo
            title='My Mii'
            openGraph={{
              url: `${ENV.BASE_URL}/mii`
            }}
          />
          <Row>
            <Col>
              <EditYourMiiCard miiInfo={miiInfo} />
            </Col>
          </Row>
        </Container>
      )}
    </LanguageContext.Helper.Consumer>
  )
}

MiiPage.propTypes = {
  miiInfo: PropTypes.object.isRequired
}

export default MiiPage
