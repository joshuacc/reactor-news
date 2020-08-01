const baseUrl = 'https://hacker-news.firebaseio.com/v0';

const noop = () => {};

interface FetchStoryCallBacks {
  before?: (id: number) => void;
  after?: (story: Story) => void;
}
export const api = {
  async fetchInitialStories(): Promise<number[]> {
    const res = await fetch(`${baseUrl}/newstories.json`);
    return await res.json();
  },

  async fetchStory(
    id: number,
    { before = noop, after = noop }: FetchStoryCallBacks = {}
  ): Promise<Story> {
    before(id);
    const res = await fetch(`${baseUrl}/item/${id}.json`);
    const story = await res.json();

    const commentsUrl = `https://news.ycombinator.com/item?id=${story.id}`;
    story.commentsUrl = commentsUrl;

    // Normalize the returned data for simpler handling in the UI code
    // This gives "Ask HN" stories a url property
    if (!story.url && story.type === 'story') {
      story.url = commentsUrl;
    }

    after(story);

    return story;
  },

  fetchStories(
    ids: number[],
    callbacks: FetchStoryCallBacks = {}
  ): Promise<Story>[] {
    return ids.map((id) => this.fetchStory(id, callbacks));
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
  commentsUrl: string;
  score: number;
  title: string;
  descendants: number; // comment count
}
