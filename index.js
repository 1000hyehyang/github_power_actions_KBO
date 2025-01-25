import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const GH_TOKEN = process.env.GH_TOKEN;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const OWNER = "1000hyehyang";
const REPO = "github_power_actions_KBO";

// GitHub Issue 생성 함수
async function createGitHubIssue(title, body) {
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/issues`;
  console.log(`GitHub Issue 생성 요청: ${title}`);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GH_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, body }),
  });

  console.log(`응답 상태 코드: ${response.status}`);
  if (response.ok) {
    console.log(`이슈 생성 성공: ${title}`);
  } else {
    const error = await response.json();
    console.error(`이슈 생성 실패: ${title}`, error);
  }
}

// 추천 영상 가져오기 (nextPageToken 활용 및 검색 쿼리 개선)
async function getRecommendedVideo() {
  const today = new Date().toISOString().split("T")[0]; // 오늘 날짜
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1); // 어제 날짜
  const publishedAfter = yesterday.toISOString();

  const baseQuery = `LG 트윈스 하이라이트`;
  const specificQuery = `LG 트윈스 ${today}`; // 오늘 날짜 포함 쿼리

  const baseUrl = (query) =>
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
      query
    )}&order=date&maxResults=50&publishedAfter=${publishedAfter}&key=${YOUTUBE_API_KEY}`;

  let nextPageToken = null;
  let allItems = new Set(); // 중복 결과 방지

  // API 요청 로직
  async function fetchVideos(query) {
    do {
      const url = nextPageToken
        ? `${baseUrl(query)}&pageToken=${nextPageToken}`
        : baseUrl(query);
      console.log(`YouTube API 요청 URL: ${url}`);

      const response = await fetch(url);
      console.log(`YouTube API 응답 상태 코드: ${response.status}`);

      if (!response.ok) {
        throw new Error(`YouTube API 요청 실패: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("YouTube API 응답 데이터:", data);

      if (data.items && data.items.length > 0) {
        data.items.forEach((item) => {
          // 중복 확인 후 추가
          const videoId = item.id.videoId;
          if (videoId && !allItems.has(videoId)) {
            allItems.add(item);
          }
        });
      }

      nextPageToken = data.nextPageToken || null; // 다음 페이지 토큰 갱신
    } while (nextPageToken);
  }

  try {
    // 1. 구체적인 쿼리 시도
    console.log("구체적인 쿼리 시도:", specificQuery);
    await fetchVideos(specificQuery);

    // 2. 검색 결과가 부족하면 기본 쿼리 시도
    if (allItems.size === 0) {
      console.log("기본 쿼리로 대체 시도:", baseQuery);
      await fetchVideos(baseQuery);
    }

    if (allItems.size > 0) {
      // 랜덤으로 하나의 영상 선택
      const allVideosArray = Array.from(allItems);
      const randomIndex = Math.floor(Math.random() * allVideosArray.length);
      const video = allVideosArray[randomIndex];
      const videoLink = `https://www.youtube.com/watch?v=${video.id.videoId}`;
      const videoThumbnail = `https://img.youtube.com/vi/${video.id.videoId}/hqdefault.jpg`;

      // 본문 구성
      const iconHtml = `<img src="https://i.namu.wiki/i/B9hIQukP-418N9W-5o6WddUuxmemYuBIZ65-xMHmRK4hDhipAtFQikphYYlBJ7lr3z0POdWs4n1azM-KOHe3qQ.svg" alt="icon" width="18" height="18">`;
      const body = `
${iconHtml} 오늘의 추천 영상:

<img src="${videoThumbnail}" alt="YouTube Thumbnail" width="320" height="180">

[${video.snippet.title}](${videoLink})

${video.snippet.description}
      `;
      await createGitHubIssue("오늘의 LG 트윈스 추천 영상", body);
    } else {
      console.log("LG 트윈스 관련 하이라이트 영상을 찾을 수 없습니다.");
    }
  } catch (error) {
    console.error(`추천 영상 가져오기 실패: ${error.message}`);
  }
}

// 실행
async function main() {
  console.log("오늘의 추천 영상 가져오기 시작...");
  await getRecommendedVideo();
}

main();
