import React from 'react'
import PropTypes from 'prop-types'
import { createOptionNodes } from '@/lib/utils/utils'
import { OVERLAYS } from '@/lib/constants/forms/overlays'
import { FLAGS } from '@/lib/constants/forms/flags'
import { COINS } from '@/lib/constants/forms/coins'
import { BACKGROUNDS } from '@/lib/constants/forms/backgrounds'
import SelectCoinModal from '@/components/edit/SelectCoinModal'
import { Alert, Card, Col, Form, Row } from 'react-bootstrap'
import SelectModal from './SelectModal'
import { Field } from 'formik'
import LocalizedString from '../shared/LocalizedString'
import LanguageContext from '../shared/LanguageContext'

const flags = createOptionNodes(FLAGS)

const backgrounds = BACKGROUNDS.map((background) => ({
  value: background,
  label: background
}))

function ImagesCard ({ values, errors, handleChange, username }) {
  return (
    <LanguageContext.Helper.Consumer>
      {(lang) => (
        <Card className='mb-3' bg='secondary' text='white'>
          <Card.Header as='h5'><LocalizedString string='images' /></Card.Header>
          <Card.Body>
            <Row className='mb-3'>
              <Col md={5}>
                <p><LocalizedString string='overlay' /></p>
                <SelectModal
                  btnTitle={LanguageContext.languages[lang].select_overlay}
                  title={LanguageContext.languages[lang].select_overlay}
                  img={(value) => `/img/overlay/${value}.png`}
                  name='overlay'
                  options={OVERLAYS}
                />
                {errors.overlay && (
                  <Alert className='mt-2 p-2' variant='danger'>
                    {errors.overlay}
                  </Alert>
                )}
              </Col>
              <Col md={7}>
                <img
                  alt='Overlay Preview'
                  className='img-thumbnail mx-auto d-block'
                  src={`/img/overlay/${values.overlay}.png`}
                />
              </Col>
            </Row>

            <Row className='mb-3'>
              <Col md={5} className='mb-3'>
                <p><LocalizedString string='background' /></p>
                <SelectModal
                  btnTitle={LanguageContext.languages[lang].select_background}
                  title={LanguageContext.languages[lang].select_background}
                  img={(value) => `/img/background/${value}`}
                  name='background'
                  options={backgrounds}
                />
                {errors.background && (
                  <Alert className='mt-2 p-2' variant='danger'>
                    {errors.background}
                  </Alert>
                )}
                <hr />
                <Form.Control
                  id="fileInput"
                  accept=".png"
                  name="file"
                  type="file"
                  onChange={(event) => {
                    const formData = new FormData()
                    formData.append('file', event.currentTarget.files[0])

                    values.background = `${username}.png`

                    return fetch('/api/account/background', {
                      method: 'POST',
                      body: formData
                    })
                  }}
                />
                <p>
                  <small className="text-muted">
                    Please ensure that your image is 1200x450 and is in PNG format.
                  </small>
                </p>
              </Col>
              <Col md={7}>
                <img
                  alt='Background Preview'
                  className='img-thumbnail mx-auto d-block'
                  src={!Number.isNaN(Number(values.background.replace(/.*\//, '').replace(/\.png$/, ''))) ? 'api/account/background' : `/img/background/${values.background}`}
                />
              </Col>
            </Row>

            <Row className='mb-3'>
              <Col md={5}>
                <p><LocalizedString string='coin' /></p>
                <Field name='coin' component={SelectCoinModal} options={COINS} />
                {errors.coin && (
                  <Alert className='mt-2 p-2' variant='danger'>
                    {errors.coin}
                  </Alert>
                )}
              </Col>
              {values.coin !== 'default' && (
                <Col md={7}>
                  <img
                    alt='Coin Preview'
                    className='img-fluid mx-auto d-block no-shadow mt-3'
                    src={`/img/coin/${values.coin}.png`}
                  />
                </Col>
              )}
            </Row>

            <Row>
              <Col md={5}>
                <Form.Group className='mb-3' controlId='flag'>
                  <Form.Label><LocalizedString string='flag' /></Form.Label>
                  <Form.Select
                    required
                    placeholder='Flag'
                    name='flag'
                    onChange={handleChange}
                    value={values.flag}
                    isInvalid={!!errors.flag}
                  >
                    {flags}
                  </Form.Select>
                  <Form.Control.Feedback type='invalid'>
                    {errors.flag}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={7}>
                <img
                  alt='Flag Preview'
                  className='img-fluid mx-auto d-block no-shadow mt-3'
                  src={`/img/flag/${values.flag}.png`}
                />
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}
    </LanguageContext.Helper.Consumer>
  )
}

ImagesCard.propTypes = {
  values: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired
}

export default ImagesCard
