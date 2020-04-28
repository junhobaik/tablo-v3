# Development Document

## Todo

- 

## IceBox

- tab-item의 description 부분을 임시로 ellipsis 처리, 향후 마우스 오버시 슬라이드식으로 전체 내용을 보여줄 수 있도록 구현

## Log

- npm, git init
- webpack, react 기반의 HMR이 가능한 보일러플레이트를 가져옴
- 가져온 보일러 플레이트를 수정
  - 폴더 구조 변경
  - sass 추가
- 타입스크립트 적용
  - import image 관련 오류 발생(모듈을 찾을 수 없습니다) d.ts 추가  
    (https://stackoverflow.com/questions/36148639/webpack-not-able-to-import-images-using-express-and-angular2-in-typescript/36151803#36151803)
- 차후 리덕스 사용을 위한 리덕스 스토어 및 루트 리듀서 작성
- 웹팩 스타일 관련 수정, style-loader 대신 mini-css-extract-plugin로 대체
- HMR 관련 Warning 'react-🔥-dom patch is not detected. React 16.6+ features may not work.' 해결 (https://github.com/gaearon/react-hot-loader/issues/1227)
- redux에 연결한 reducer가 없어 생기는 오류 해결을 위해 tab 관련 add tab 추가
- Header, Feeds, Tabs 세 컴포넌트의 기본 화면의 위치 구현, 위 아래(아래의 좌우), 스크롤 관련 스타일 정의
- Theme-ui 설치 미 적용

