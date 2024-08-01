import React from 'react'
import PropTypes from 'prop-types'
import { Alert, Card, Col, Row } from 'react-bootstrap'
import LocalizedString from '../shared/LocalizedString'
import LanguageContext from '../shared/LanguageContext'


function ColorBox ({ color }) {
  return (
    <div style={{ backgroundColor: color, width: '48px', height: '48px', marginLeft: '8px', marginTop: '8px', borderRadius: '8px' }}>

    </div>
  )
}

ColorBox.propTypes = {
  color: PropTypes.string.isRequired
}

function DonorsCard ({ values, errors, handleChange }) {
  return (
    <LanguageContext.Helper.Consumer>
      {(lang) => (
        <Card className='mb-3' bg='secondary' text='white'>
          <Card.Header as='h5'><LocalizedString string='donators' /></Card.Header>
          <Card.Body>
            <Row className='mb-3'>
              <Col md={5}>
                <p><LocalizedString string='name_color' /></p>
                <div className='colorboxes' style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                  <ColorBox color={'#000000'} />
                  <ColorBox color={'#1cb41c'} />
                  <ColorBox color={'#FFD700'} />
                  <ColorBox color={'#0055DD'} />
                  <ColorBox color={'#d73216'} />
                  <ColorBox color={'#a81bc4'} />
                </div>
                {errors.overlay && (
                  <Alert className='mt-2 p-2' variant='danger'>
                    {errors.overlay}
                  </Alert>
                )}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}
    </LanguageContext.Helper.Consumer>
  )
}

DonorsCard.propTypes = {
  values: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired
}

export default DonorsCard
