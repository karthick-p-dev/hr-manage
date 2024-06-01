import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import Birthday from "../feature/birthday/Birthday";

const { createStore } = require("redux");

let container: any = null;
let root: any = null;

const store: any = createStore((innerState: any) => innerState, {});
describe("axios", () => {
    container = document.createElement("div");
    container.setAttribute("id", "root");
    document.body.appendChild(container);
    root = ReactDOM.createRoot(container);
    act(() => {
        root.render(<Provider store={store}>
            <Router>
                <Birthday />
            </Router>
        </Provider>, container);
    });
    it("should be enabled when enter a page and check title", () => {
       // const { getByTestId } = tree();
        const title = screen.getByText("Birthdays");
        expect(title).toBeInTheDocument();
      });
});
