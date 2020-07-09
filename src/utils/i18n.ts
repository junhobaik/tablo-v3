import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      days: 'days',
      hours: 'hours',
      // Setting
      'setting-theme': 'Theme',
      'setting-open_link_title': 'How to Open Links',
      'setting-link': 'Link',
      'setting-collection': 'Collection',
      'setting-post': 'Post',
      'setting-feed': 'Feed',
      'setting-new_tab': 'New tab',
      'setting-current_tab': 'Current tab',
      'setting-new_window': 'New window',
      'setting-current_window': 'Current window',
      'setting-posts_title': 'Posts (Feed)',
      'setting-hide_post_title': 'Hide old posts',
      'setting-post_no_hide': 'No Hide',
      'setting-reload_post-title': 'Reload cycle of feed posts',
      forced_reload: 'Forced reload',
      'setting-submit_msg': 'Changes take effect after up to 5 seconds.',

      // AddFeed
      'add_feed-first': 'Please enter the RSS-Feed URL. It must start with https:// or http://.',
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
  ko: {
    translation: {
      days: '일',
      hours: '시간',

      // Setting
      'setting-theme': '테마',
      'setting-open_link_title': '링크 열기 방식',
      'setting-link': '링크',
      'setting-collection': '콜렉션',
      'setting-post': '게시물',
      'setting-feed': '피드 사이트',
      'setting-new_tab': '새 탭',
      'setting-current_tab': '현재 탭',
      'setting-new_window': '새 창',
      'setting-current_window': '현재 창',
      'setting-posts_title': '게시물 (Feed)',
      'setting-hide_post_title': '오래된 게시물 숨기기',
      'setting-post_no_hide': '숨기지 않음',
      'setting-reload_post-title': '게시물 목록 갱신 시간',
      forced_reload: '강제 새로고침',
      'setting-submit_msg': '변경 사항은 최대 5초 후 적용됩니다.',

      // AddFeed
      'add_feed-first': 'RSS-Feed URL을 입력해주세요. 반드시 https:// 또는 http:// 로 시작해야합니다.',
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
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ko',
    keySeparator: false,

    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['navigator'],
      caches: ['cookie'],
      excludeCacheFor: ['cimode'],
      cookieMinutes: 10,
      cookieDomain: 'myDomain',
    },
  });

export default i18n;
