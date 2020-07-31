import React from "react";
import { render } from "@testing-library/react";
import { App } from "./App";

describe("App", () => {
  it("renders app title", () => {
    const { getByText } = render(<App />);
    expect(getByText(/Reactor News/)).toBeInTheDocument();
  });
});
