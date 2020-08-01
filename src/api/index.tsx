const baseUrl = 'https://hacker-news.firebaseio.com/v0';

export const api = {
  async fetchInitialStories(): Promise<number[]> {
    const res = await fetch(`${baseUrl}/newstories.json`);
    return await res.json();
  },

  async fetchStory(id: number): Promise<Story> {
    const res = await fetch(`${baseUrl}/item/${id}.json`);
    const story = await res.json();

    // Normalize the returned data for simpler handling in the UI code
    // This gives "Ask HN" stories a url property
    if (!story.url && story.type === 'story') {
      story.url = `https://news.ycombinator.com/item?id=${story.id}`;
    }

    return story;
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
