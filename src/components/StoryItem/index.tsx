import { StoryState } from '../../reducer';
import React from 'react';

export const StoryItem = ({ storyState }: { storyState: StoryState }) => {
  if (
    !storyState ||
    storyState.status !== 'SUCCESS' ||
    storyState.data.deleted ||
    storyState.data.dead
  ) {
    return null;
  }

  const { title, url } = storyState.data;

  return (
    <li>
      <a href={url}>{title}</a>
    </li>
  );
};
