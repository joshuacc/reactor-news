const baseUrl = "https://hacker-news.firebaseio.com/v0";

export const api = {
  async fetchStories(): Promise<number[]> {
    const res = await fetch(`${baseUrl}/newstories.json`);
    return res.json();
  },
};
