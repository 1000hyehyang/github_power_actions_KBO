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

// 추천 영상 가져오기
async function getRecommendedVideo() {
  const today = new Date().toISOString().split("T")[0]; // 오늘 날짜
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1); // 어제 날짜
  const publishedAfter = yesterday.toISOString();

  // YouTube API 요청 URL
  const query = `LG 트윈스 하이라이트`;
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
    query
  )}&order=date&maxResults=5&publishedAfter=${publishedAfter}&key=${YOUTUBE_API_KEY}`;
  console.log(`YouTube API 요청 URL: ${url}`);

  try {
    const response = await fetch(url);
    console.log(`YouTube API 응답 상태 코드: ${response.status}`);

    if (!response.ok) {
      throw new Error(`YouTube API 요청 실패: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("YouTube API 응답 데이터:", data);

    if (data.items && data.items.length > 0) {
      // 랜덤으로 영상 선택
      const randomIndex = Math.floor(Math.random() * data.items.length);
      const video = data.items[randomIndex];
      const videoLink = `https://www.youtube.com/watch?v=${video.id.videoId}`;

      const body = `오늘의 추천 영상:\n\n[${video.snippet.title}](${videoLink})\n\n${video.snippet.description}`;
      await createGitHubIssue("오늘의 추천 영상", body);
    } else {
      console.log("LG 트윈스 하이라이트 영상을 찾을 수 없습니다.");
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
