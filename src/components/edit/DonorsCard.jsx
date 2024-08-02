import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Alert, Card, Col, Row } from 'react-bootstrap'
import LocalizedString from '../shared/LocalizedString'
import LanguageContext from '../shared/LanguageContext'

import styles from './DonorsCard.module.css'

function ColorBox ({ color, onClick, current }) {
  return (
    <div className={styles.colorBox} id={color} style={{ backgroundColor: color, boxShadow: current === color ? '0px 0px 7px 2px #0099FF' : null }} onClick={(e) => onClick(e, color)} />
  )
}

function ColorPicker ({ current, setColor }) {
  const [color, setColorState] = useState(current)

  return (
    <div id={current} className={styles.colorPicker} style={{ boxShadow: current === color ? '0px 0px 7px 2px #0099FF' : null }}>
      <input id={current} type='color' value={current} onChange={(e) => { setColorState(e.target.value); setColor(e, e.target.value) }} />
      <p>Custom</p>
    </div>
  )
}

ColorPicker.propTypes = {
  current: PropTypes.string.isRequired,
  setColor: PropTypes.func.isRequired
}

ColorBox.propTypes = {
  color: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  current: PropTypes.string.isRequired
}

function DonorsCard ({ values, errors, handleChange }) {
  const setColor = (e, color) => {
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
                <div className={styles.colorBoxes}>
                  <ColorBox current={values.nameColor} color={'#000000'} onClick={setColor} />
                  <ColorBox current={values.nameColor} color={'#14d314'} onClick={setColor} />
                  <ColorBox current={values.nameColor} color={'#FFD700'} onClick={setColor} />
                  <ColorBox current={values.nameColor} color={'#0959de'} onClick={setColor} />
                  <ColorBox current={values.nameColor} color={'#ff3515'} onClick={setColor} />
                  <ColorBox current={values.nameColor} color={'#a81bc4'} onClick={setColor} />
                  <ColorPicker current={values.nameColor} setColor={setColor} />
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
