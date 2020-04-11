# Development Document

- npm, git init
- webpack, react 기반의 HMR이 가능한 보일러플레이트를 가져옴
- 가져온 보일러 플레이트를 수정
  - 폴더 구조 변경
  - sass 추가
- 타입스크립트 적용
  - import image 관련 오류 발생(모듈을 찾을 수 없습니다) d.ts 추가  
    (https://stackoverflow.com/questions/36148639/webpack-not-able-to-import-images-using-express-and-angular2-in-typescript/36151803#36151803)
- 차후 리덕스 사용을 위한 리덕스 스토어 및 루트 리듀서 작성
