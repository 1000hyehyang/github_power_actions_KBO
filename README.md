# **LG 트윈스 추천 영상 자동화 스크립트**

![Logo](https://i.namu.wiki/i/B9hIQukP-418N9W-5o6WddUuxmemYuBIZ65-xMHmRK4hDhipAtFQikphYYlBJ7lr3z0POdWs4n1azM-KOHe3qQ.svg)

## 📌 **프로젝트 개요**

이 프로젝트는 **LG 트윈스와 관련된 YouTube 추천 영상을 매일 자동으로 검색**하고, **GitHub Issues**에 추천 영상을 게시하는 자동화 스크립트입니다.

- YouTube API를 활용하여 최신 추천 영상을 검색합니다.
- 검색된 영상 중 랜덤으로 하나를 선택하여 GitHub Issues에 게시합니다.
- GitHub Actions를 사용하여 매일 정해진 시간에 자동으로 실행됩니다.

---

## 🛠 **기술 스택**

- **Node.js**: 스크립트 실행.
- **YouTube Data API v3**: 추천 영상 검색.
- **GitHub REST API**: GitHub Issues 생성.
- **GitHub Actions**: 스케줄링 및 자동화.

---

## 🚀 **설치 및 실행**

### **1. 레포지토리 클론**

```bash
git clone https://github.com/1000hyehyang/github_power_actions_KBO.git
cd github_power_actions_KBO
```

### **2. 종속성 설치**

```bash
npm install
```

### **3. 환경 변수 설정**

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가합니다:

```plaintext
GH_TOKEN=your_personal_access_token
YOUTUBE_API_KEY=your_youtube_api_key
```

- **`GH_TOKEN`**: GitHub Personal Access Token ([생성 가이드](https://github.com/settings/tokens)).
- **`YOUTUBE_API_KEY`**: YouTube Data API v3 키 ([생성 가이드](https://console.cloud.google.com/)).

---

## 📋 **사용 방법**

### **1. 로컬에서 실행**

```bash
node index.js
```

- 실행 후, "오늘의 LG 트윈스 추천 영상" 이슈가 GitHub Issues에 게시됩니다.

### **2. GitHub Actions를 통한 자동화**

- GitHub Actions는 설정된 스케줄(`cron`)에 따라 매일 정해진 시간에 스크립트를 실행합니다.
- 기본 설정: **매일 정오(12:00 UTC)** 실행.

#### GitHub Actions 설정 확인:

`workflow.yaml` 파일:

```yaml
on:
  schedule:
    - cron: "0 12 * * *" # 매일 정오에 실행
```

---

## 💡 **기능 설명**

### **1. 추천 영상 검색**

- YouTube API를 사용하여 "LG 트윈스"를 검색합니다.
- 검색된 영상 중 랜덤으로 하나를 선택합니다.

### **2. GitHub Issues 생성**

- 선택된 영상의 제목, 설명, 썸네일을 포함한 추천 영상을 GitHub Issues에 게시합니다.
- 예시:

  ```markdown
  <img src="https://i.namu.wiki/i/B9hIQukP-418N9W-5o6WddUuxmemYuBIZ65-xMHmRK4hDhipAtFQikphYYlBJ7lr3z0POdWs4n1azM-KOHe3qQ.svg" alt="icon" width="18" height="18">
  오늘의 추천 영상:

  <img src="https://img.youtube.com/vi/abcdef12345/hqdefault.jpg" alt="YouTube Thumbnail" width="320" height="180">

  [LG 트윈스 vs 두산 베어스 하이라이트](https://www.youtube.com/watch?v=abcdef12345)

  오늘 경기의 주요 장면을 확인하세요!
  ```

---

## 🔧 **기여 방법**

### **1. 이슈 및 피드백**

- 문제가 발생하거나 새로운 기능을 제안하려면 [GitHub Issues](https://github.com/1000hyehyang/github_power_actions_KBO/issues)를 통해 알려주세요.

### **2. Pull Request**

1. 새로운 브랜치 생성:
   ```bash
   git checkout -b feature/새로운기능
   ```
2. 변경사항 커밋:
   ```bash
   git add .
   git commit -m "Add 새로운 기능"
   ```
3. 브랜치 푸시:
   ```bash
   git push origin feature/새로운기능
   ```
4. Pull Request 생성.

---

## 📅 **스케줄 설정 변경**

### 기본 스케줄

`workflow.yaml` 파일에서 `cron` 값을 변경하여 실행 시간을 설정할 수 있습니다.

- **예: 매일 한국 시간 정오(12:00)에 실행**
  ```yaml
  schedule:
    - cron: "0 3 * * *" # UTC 기준으로 오전 3시 = KST 정오
  ```

---

## 📝 **문제 해결**

1. **YouTube API 요청 실패**

   - 응답 상태 코드와 에러 메시지를 확인하세요.
   - API 키가 유효한지 확인하세요.

2. **GitHub Issues 생성 실패**
   - `GH_TOKEN`의 권한을 확인하세요.
     - 필요한 권한: `repo`, `write:issues`.
   - GitHub Secrets에 올바른 값이 저장되었는지 확인하세요.

---

## 📎 **참고 자료**

- [YouTube Data API v3](https://developers.google.com/youtube/v3)
- [GitHub REST API - Issues](https://docs.github.com/en/rest/issues/issues)
- [GitHub Actions - Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
