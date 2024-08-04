import React from 'react'

const languages = {
  en: require('../../../locales/en.json'),
  en_uk: require('../../../locales/en_uk.json'),
  jp: require('../../../locales/jp.json'),
  hu: require('../../../locales/hu.json'),
  fr_fr: require('../../../locales/fr_fr.json'),
  ru: require('../../../locales/ru.json'),
  ua: require('../../../locales/ua.json')
}

const Helper = React.createContext('en')

export default {
  Helper,
  languages
}
