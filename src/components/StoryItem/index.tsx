import { StoryState } from '../../reducer';
import React from 'react';

export const StoryItem = ({ storyState }: { storyState: StoryState }) => {
  if (
    !storyState ||
    storyState.status !== 'SUCCESS' ||
    storyState.data.deleted ||
    storyState.data.dead ||
    storyState.data.type !== 'story'
  ) {
    return null;
  }

  const { title, url, commentsUrl, descendants } = storyState.data;

  return (
    <li>
      <a href={url}>{title}</a>
      <br />
      <a href={commentsUrl}>
        {typeof descendants === 'number' && `${descendants} `}comments
      </a>
    </li>
  );
};
