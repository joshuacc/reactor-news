import React, { useEffect, useState } from "react";
import "./App.css";
import { api } from "./api";

export const App = () => {
  const [list, setList] = useState<number[]>([]);
  useEffect(() => {
    api.fetchStories().then((l) => setList(l));
  }, []);
  return (
    <div style={{ maxWidth: "80ch", margin: "auto" }}>
      <h1>Reactor News: A Hacker News Clone</h1>
      <ul>
        {list.map((n) => (
          <li>{n}</li>
        ))}
      </ul>
    </div>
  );
};
