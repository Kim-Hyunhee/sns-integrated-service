# sns-integrated-service
> 원티드 프리온보딩 백엔드 인턴십에서 기술 과제로 요구사항을 받고 팀으로 진행한 프로젝트입니다. 단, 해당 프로젝트는 자유롭게 해석 및 구현이 가능했기 때문에 가상의 유저들이 지속적인 건강한 소비 습관을 생성하기 위한 목적을 가지고 일부 재해석하여 구현했습니다.

## 목차
#### [1. 개요](#개요)
##### [&nbsp;&nbsp;1-1. 실행 환경](#실행-환경)
##### [&nbsp;&nbsp;1-2. 기술 스택](#기술-스택)
##### [&nbsp;&nbsp;1-3. 프로젝트 관리](#프로젝트-관리)
#### 2. ERD 및 디렉토리 구조
##### &nbsp;&nbsp;2-1. ERD
##### &nbsp;&nbsp;2-2. 디렉토리 구조
#### [3. 기능구현](#기능구현)
</br>

## 개요
- 본 서비스는 유저 계정의 해시태그(”#dani”) 를 기반으로 `인스타그램`, `스레드`, `페이스북`, `트위터(X)` 등 복수의 SNS에 게시된 게시물 중 유저의 해시태그가 포함된 게시물들을 하나의 서비스에서 확인할 수 있는 통합 Feed 어플리케이션 입니다.
- 이를 통해 본 서비스의 고객은 하나의 채널로 유저(”#dani”), 또는 브랜드(”#danishop”) 의 SNS 노출 게시물 및 통계를 확인할 수 있습니다.

### 실행 환경
* .env 환경변수 파일 생성</br>
해당 프로젝트는 로컬 환경 실행이며, 아래 항목들이 환경변수 파일에 전부 존재해야 합니다.
```
DATABASE_HOST=
DATABASE_PORT=
DATABASE_USERNAME=
DATABASE_PASSWORD=
DATABASE_DATABASE=

JWT_SECRET_KEY=
```
* 로컬 실행시
```
npm run start
```

### 기술 스택
<img src="https://img.shields.io/badge/TypeScript-version 5-3178C6">&nbsp;
<img src="https://img.shields.io/badge/Nest.js-version 10-E0234E">&nbsp;
<img src="https://img.shields.io/badge/TypeORM-version 0.3-fcad03">&nbsp;
<img src="https://img.shields.io/badge/MySQL-version 8-00758F">&nbsp;

### 프로젝트 관리
프로젝트 시작 전 만들어야 할 API를 노션 보드에 티켓으로 작성하고</br> 
각각의 티켓 안에 요구사항들을 정리했으며, 티켓마다 이슈 생성하여 PR 생성하여 머지 진행
<details>
<summary>API 관리</summary>
<div markdown="1">
<img src="https://github.com/user-attachments/assets/f28b80c7-5e7a-4487-88c7-b3dfb1cded74">
</div>
</details>

<details>
<summary>이슈 관리</summary>
<div markdown="1">
<img src="https://github.com/user-attachments/assets/abc601da-aeee-48e4-ba63-b87977804cdd">
</div>
</details>

<details>
<summary>PR 관리</summary>
<div markdown="1">
<img src="https://github.com/user-attachments/assets/4f253223-e7ec-4143-a18e-d42a49eb00bb">
</div>
</details>

</br>

## ERD 및 디렉토리 구조

<details>
<summary><strong>ERD</strong></summary>
<div markdown="1">
 
<img src="https://github.com/user-attachments/assets/fa851c6c-bc09-482c-9e62-ca1a0957d1d6">
</div>
</details>

<details>
<summary><strong>디렉토리 구조</strong></summary>
<div markdown="1">
 
```bash
.
├── README.md
├── directory_structure.txt
├── docs
│   └── pull_request_template.md
├── nest-cli.json
├── package-lock.json
├── package.json
├── src
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   ├── config
│   │   └── database.config.ts
│   ├── main.ts
│   └── modules
│       ├── feed
│       │   ├── feed.controller.ts
│       │   ├── feed.entity.ts
│       │   ├── feed.module.ts
│       │   └── feed.service.ts
│       ├── user
│       │   ├── user.controller.ts
│       │   ├── user.entity.ts
│       │   ├── user.module.ts
│       │   └── user.service.ts
│       └── verification
│           ├── dto
│           │   └── sendCode.dto.ts
│           ├── verification.controller.ts
│           ├── verification.entity.ts
│           ├── verification.module.ts
│           └── verification.service.ts
├── test
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── tsconfig.build.json
└── tsconfig.json
```
</div>
</details>

</br>

## 기능구현
### 회원가입
* 이메일 중복체크 및 이메일 형식 유효성 체크
* 패스워드 BCrypt 암호화 처리 (패스워드 불일치 시 등록 불가능)

### 인증 코드 전송
* 이메일 형식 유효성 체크
* user 테이블에 해당 이메일이 존재하지 않으면 에러 처리]
  
### 사용자 가입 승인
* 인증 코드 동일 확인 및 만료 확인

### 로그인
* 이메일, 패스워드 일치 여부 유효성 체크
* 로그인 시 JWT(Json Web Token) 발급 -> 모든 API 요청시 JWT 인가

### 피드 목록 및 상세보기
* 피드의 검색 쿼리에 따라 피드 목록이 달라지게 구현

### 게시글 좋아요
* 게시글을 사용자가 좋아요를 누르면 해당 게시글의 좋아요 수가 1 더해지게 구현
  
### 게시글 좋아요
* 게시글을 사용자가 공유를 하면 해당 게시글의 공유 수가 1 더해지게 구현

### 통계
* 통계를 통해 보고 싶은 게시글 검색 구현 (쿼리 파라미터 적용)

</br>

## API 명세
|No| Title           | Method  | Path                       | Authorization |
|---|-----------------|:-------:|----------------------------|:-------------:|
|1|회원가입|`POST`|`/register`|X|
|2|로그인|`POST`|`/login`|X|
|3|사용자 프로필 확인|`GET`|`/profile`|O|
|4|인증코드 전송|`POST`|`/sendCode`|X|
|5|사용자 가입승인|`POST`|`/verify`|X|
|6|게시글 목록|`GET`|`/feeds`|O|
|7|게시글 상세보기|`GET`|`/feeds/:id`|O|
|8|게시글 좋아요|`PATCH`|`/feeds/:id/likeCount`|O|
|9|게시글 공유|`PATCH`|`/feeds/:id/shareCount`|O|
|10|통계|`GET`|`/stats`|O|
