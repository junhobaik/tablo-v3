import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  ko: {
    translation: {
      'add_feed-first': 'RSS-Feed URL을 입력해주세요. 반드시 https:// 또는 http:// 로 시작해야합니다.',
      'add_feed-info': 'Enter the RSS-Feed URL.',
      'add_feed-http': 'URL must start with https:// or http://.',
      'add_feed-slash': "RSS-Feed URL format is not correct, check the number of'/'.",
      'add_feed-error': 'RSS-Feed address is not correct or it is a feed that is not supported.',
      'add_feed-success': 'The RSS-Feed address has been verified, please enter additional information.',
      'add_feed-already': 'This feed already exists.',
      'add_feed-success-add': 'feed was added normally.',
      'add-feed-unknown-error': 'An unknown error occurred, please check the URL again.',
    },
  },
  en: {
    translation: {
      'add_feed-first': 'Please enter the RSS-Feed URL. It must start with https:// or http://.',
      'add_feed-info': 'RSS-Feed URL을 입력하세요.',
      'add_feed-http': 'URL은 반드시 https:// 또는 http:// 로 시작해야합니다.',
      'add_feed-slash': "RSS-Feed URL 형식이 맞지 않습니다, '/'의 개수를 확인하세요.",
      'add_feed-error': 'RSS-Feed 주소가 올바르지 않거나, 지원하지 않는 형식의 RSS-Feed입니다.',
      'add_feed-success': 'RSS-Feed 주소가 확인되었습니다, 추가 정보를 입력하세요.',
      'add_feed-already': '이미 존재하는 피드입니다.',
      'add_feed-success-add': '피드가 정상적으로 추가되었습니다.',
      'add-feed-unknown-error': '알 수 없는 오류가 발생했습니다, URL Check를 다시 해주세요.',
    },
  },
};

i18n.on('languageChanged', function (lng) {
  console.log(lng);
});

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    keySeparator: false,

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
