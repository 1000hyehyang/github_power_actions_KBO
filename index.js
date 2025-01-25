import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const GH_TOKEN = process.env.GH_TOKEN;
const SPORTRADAR_API_KEY = process.env.SPORTRADAR_API_KEY;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const OWNER = "1000hyehyang";
const REPO = "github_power_actions_KBO";

// GitHub Issue 생성 함수
async function createGitHubIssue(title, body) {
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/issues`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GH_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, body }),
  });

  if (response.ok) {
    console.log(`이슈 생성 성공: ${title}`);
  } else {
    const error = await response.json();
    console.error(`이슈 생성 실패: ${title}`, error);
  }
}

// KBO 경기 결과 가져오기
async function getTodayGames() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  const url = `https://api.sportradar.com/baseball/trial/v7/en/games/${year}/${month}/${day}/schedule.json?api_key=${SPORTRADAR_API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok)
      throw new Error(`KBO API 요청 실패: ${response.statusText}`);

    const data = await response.json();
    let summary = `오늘의 KBO 경기 결과:\n\n`;

    data.games.forEach((game) => {
      summary += `${game.home.name} ${game.home.runs || 0} - ${
        game.away.runs || 0
      } ${game.away.name}\n`;
    });

    await createGitHubIssue(
      `오늘의 KBO 경기 결과 (${year}-${month}-${day})`,
      summary
    );
  } catch (error) {
    console.error(error.message);
  }
}

// 하이라이트 영상 가져오기
async function getHighlightVideos(team) {
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
    team
  )}+하이라이트&key=${YOUTUBE_API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok)
      throw new Error(`YouTube API 요청 실패: ${response.statusText}`);

    const data = await response.json();
    const video = data.items[0];

    if (video) {
      const videoLink = `https://www.youtube.com/watch?v=${video.id.videoId}`;
      const body = `오늘의 ${team} 하이라이트:\n\n[${video.snippet.title}](${videoLink})\n\n${video.snippet.description}`;
      await createGitHubIssue(`${team} 하이라이트`, body);
    } else {
      console.log(`${team} 하이라이트를 찾을 수 없습니다.`);
    }
  } catch (error) {
    console.error(error.message);
  }
}

// 선수 프로필 가져오기
async function getPlayerProfile(playerName) {
  const url = `https://api.sportradar.com/baseball/trial/v7/en/players/${encodeURIComponent(
    playerName
  )}/profile.json?api_key=${SPORTRADAR_API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok)
      throw new Error(`KBO API 요청 실패: ${response.statusText}`);

    const data = await response.json();
    const player = data.player;

    if (player) {
      const profile = `
이름: ${player.full_name}
팀: ${player.team.name}
포지션: ${player.primary_position}
최근 기록:
- 타율: ${player.statistics.batting.avg}
- 홈런: ${player.statistics.batting.hr}
- 타점: ${player.statistics.batting.rbi}
            `;
      await createGitHubIssue(`${player.full_name} 선수의 프로필`, profile);
    } else {
      console.log(`${playerName} 선수 정보를 찾을 수 없습니다.`);
    }
  } catch (error) {
    console.error(error.message);
  }
}

// 실행
async function main() {
  const team = process.argv[2] || "LG 트윈스";
  const playerName = process.argv[3] || "홍창기";

  await getTodayGames();
  await getHighlightVideos(team);
  await getPlayerProfile(playerName);
}

main();
