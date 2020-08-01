const baseUrl = 'https://hacker-news.firebaseio.com/v0';

export const api = {
  async fetchStories(): Promise<number[]> {
    const res = await fetch(`${baseUrl}/newstories.json`);
    return res.json();
  },
};

export interface Story {
  id: number;
  deleted: boolean;
  type: 'story';
  time: number;
  text: string;
  dead: boolean;
  url: string;
  score: number;
  title: string;
  descendants: number; // comment count
}
