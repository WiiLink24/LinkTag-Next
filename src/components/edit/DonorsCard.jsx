import React from 'react'
import PropTypes from 'prop-types'
import { Alert, Card, Col, Row } from 'react-bootstrap'
import LocalizedString from '../shared/LocalizedString'
import LanguageContext from '../shared/LanguageContext'

function ColorBox ({ color, onClick, current }) {
  return (
    <div id={color} style={{ backgroundColor: color, width: '48px', height: '48px', marginLeft: '8px', marginTop: '8px', boxShadow: current === color ? '0px 0px 7px 2px #0099FF' : null, borderRadius: '8px' }} onClick={(e) => onClick(e, color)} />
  )
}

ColorBox.propTypes = {
  color: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  current: PropTypes.string.isRequired
}

function DonorsCard ({ values, errors, handleChange }) {
  const setColor = (e, color) => {
    console.log('Set color to ' + color)
    values.nameColor = color
    handleChange(e)
  }

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
                  <ColorBox current={values.nameColor} color={'#000000'} onClick={setColor} />
                  <ColorBox current={values.nameColor} color={'#1cb41c'} onClick={setColor} />
                  <ColorBox current={values.nameColor} color={'#FFD700'} onClick={setColor} />
                  <ColorBox current={values.nameColor} color={'#0055DD'} onClick={setColor} />
                  <ColorBox current={values.nameColor} color={'#d73216'} onClick={setColor} />
                  <ColorBox current={values.nameColor} color={'#a81bc4'} onClick={setColor} />
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
