
## 패키지

### 필요한 패키지 정리

     $yarn add react-router-dom
     $yarn add redux react-redux
     $yarn add react-slick
     $yarn add node-sass
     $yarn add @material-ui/core
     $yarn add immer
     $yarn add styled-components
     $yarn add axios
     $yarn add redux-devtools-extension
     $yarn add redux-saga
     &yarn add redux-devtools-extension
     &yarn add qs
     &yarn add redux-actions
    
### 스타일링 가이드 
##### SCSS Module , Styled Component 사용

   - 사이드 패딩 24px
   - 바텀 버튼 높이 73px (실 높이 60px 패딩바텀 13px)
   - 브랜딩 컬러 #007246
   - 기본 컬러 #999999
   - 헤더 높이 40px
   - max-width : 768px (아이패드x)
   - min-width : 320px


### 기본적인 최적화 전략

1. shouldComponentUpdate() 를 이용해 갱신체크 (이 프로젝트는 useEffect 사용)
2. React 내부에서 process.evnv.NODE_ENV가 스트링    'production'인지 여부에 따라 프로덕션 모드로 작동할 것인지, 개발 모드로 작동할 것인지 여부를 결정   
3. useCallback , useMemo , React.memo 활용 
4. SSR 해야할까..(?)
