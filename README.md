# **LG 트윈스 추천 영상 자동화 스크립트**

<p align="center">
  <img src="https://i.namu.wiki/i/B9hIQukP-418N9W-5o6WddUuxmemYuBIZ65-xMHmRK4hDhipAtFQikphYYlBJ7lr3z0POdWs4n1azM-KOHe3qQ.svg" alt="Logo" width="120" height="120">
</p>

<br>

## 📌 **프로젝트 개요**

이 프로젝트는 **LG 트윈스 관련 YouTube 하이라이트 영상을 자동으로 검색**하고, **GitHub Issues**에 매일 추천 영상을 게시하는 자동화 스크립트입니다.

- 최신 YouTube 영상을 검색하여 매일 **랜덤 추천**.
- **YouTube Data API**를 활용해 여러 페이지의 검색 결과를 가져옵니다.
- **GitHub Actions**를 사용해 매일 정해진 시간에 스크립트를 자동 실행합니다.

<br>

## 🛠 **기술 스택**

- **Node.js**: 스크립트 실행.
- **YouTube Data API v3**: 하이라이트 영상 검색.
- **GitHub REST API**: GitHub Issues 생성.
- **GitHub Actions**: 스케줄링 및 자동화.

<br>

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

<br>

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

<br>

## 💡 **기능 설명**

### **1. 추천 영상 검색**

- YouTube API를 사용해 다음 쿼리를 반복 실행하여 검색 결과를 수집

```
LG 트윈스 ${today}
LG 트윈스 하이라이트
LG 트윈스 명장면
LG 트윈스 최신 경기
```

- 검색 결과가 없는 경우를 대비해 여러 대체 쿼리를 순차적으로 실행.

- 날짜 범위 확장
  - 검색 결과를 더 풍부하게 하기 위해 일주일 전부터 오늘까지의 영상을 검색

```javascript
const lastWeek = new Date();
lastWeek.setDate(lastWeek.getDate() - 7); // 일주일 전
const publishedAfter = lastWeek.toISOString();
```

### **2. 다중 페이지 검색**

- YouTube API의 **`nextPageToken`**을 활용해 한 번의 요청으로 가져올 수 없는 **50개 이상의 결과를 페이징 처리**하여 수집.

### **3. 중복 방지**

- 중복된 영상(`videoId`)을 제거하여 고유한 결과만 수집.

### **4. GitHub Issues 생성**

- 선택된 영상의 제목, 설명, 썸네일을 포함한 추천 영상을 GitHub Issues에 게시합니다.

#### **예시**:

```markdown
<img src="https://i.namu.wiki/i/B9hIQukP-418N9W-5o6WddUuxmemYuBIZ65-xMHmRK4hDhipAtFQikphYYlBJ7lr3z0POdWs4n1azM-KOHe3qQ.svg" alt="icon" width="18" height="18">
오늘의 추천 영상:

<img src="https://img.youtube.com/vi/abcdef12345/hqdefault.jpg" alt="YouTube Thumbnail" width="320" height="180">

[LG 트윈스 vs 두산 베어스 하이라이트](https://www.youtube.com/watch?v=abcdef12345)

오늘 경기의 주요 장면을 확인하세요!
```

<br>

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

<br>

## 📅 **스케줄 설정 변경**

### 기본 스케줄

`workflow.yaml` 파일에서 `cron` 값을 변경하여 실행 시간을 설정할 수 있습니다.

- **예: 매일 한국 시간 정오(12:00)에 실행**
  ```yaml
  schedule:
    - cron: "0 3 * * *" # UTC 기준으로 오전 3시 = KST 정오
  ```

<br>

## 📝 **문제 해결**

1. **YouTube API 요청 실패**

   - 응답 상태 코드와 에러 메시지를 확인하세요.
   - API 키가 유효한지 확인하세요.
   - YouTube API 쿼터를 초과하지 않았는지 확인하세요.

2. **GitHub Issues 생성 실패**
   - `GH_TOKEN`의 권한을 확인하세요.
     - 필요한 권한: `repo`, `write:issues`.
   - GitHub Secrets에 올바른 값이 저장되었는지 확인하세요.

<br>

## 📎 **참고 자료**

- [YouTube Data API v3](https://developers.google.com/youtube/v3)
- [GitHub REST API - Issues](https://docs.github.com/en/rest/issues/issues)
- [GitHub Actions - Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
