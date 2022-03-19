import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { localGet } from "@/utils/auth.js"
import elementEnLocale from 'element-ui/lib/locale/lang/en' // element-ui lang
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN'// element-ui lang

import enLocale from './en'
import zhLocale from './zh'
import zhXzLocale from './xz'


Vue.use(VueI18n)

const messages = {
  en: {
    ...enLocale,
    ...elementEnLocale
  },
  zh: {
    ...zhLocale,
    ...elementZhLocale
  },
  xz: {
    ...zhXzLocale
  }
}
export function getLanguage() {
  // const chooseLanguage = localGet('language')
  const chooseLanguage = '';
  if (chooseLanguage) return chooseLanguage

  const language = (navigator.language || navigator.browserLanguage).toLowerCase()
  const locales = Object.keys(messages)
  for (const locale of locales) {
    if (language.indexOf(locale) > -1) {
      return locale
    }
  }
  return 'en'
}
const i18n = new VueI18n({
  locale: getLanguage(),
  messages
})

export default i18n
