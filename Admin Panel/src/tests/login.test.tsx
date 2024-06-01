import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { render, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import axios from "axios";
import Login from "../feature/login/Login";
import { BASE_URL } from "../config/config";
import ENDPOINT from "../helpers/Api";
import { onLogin } from "../app/redux/actions/action";
import { store } from "../app/redux/store/store-index";

jest.mock("axios");

  describe("Test login form", () => {
    function tree() {
      return render(
        <Provider store={store}>
          <Router>
            <Login />
          </Router>
        </Provider>,
      );
    }

    it("login check with wrong data", () => {
      const { getByTestId } = tree();
      const button = getByTestId("submitButton");
      const emailInput = getByTestId("email");
      const passwordInput = getByTestId("password");
      expect(passwordInput).not.toBe("");
      expect(emailInput).not.toBe("");
      expect(button).toHaveAttribute("disabled");
    });

    it("login check with right data", () => {
      const { getByTestId } = tree();
      const emailInput = getByTestId("email");
      const passwordInput = getByTestId("password");
      fireEvent.change(emailInput, { persist: jest.fn(), target: { value: "saravanan.p@qagreatinnovus.com" } });
      fireEvent.change(passwordInput, { persist: jest.fn(), target: { value: "12345678" } });
      fireEvent.submit(getByTestId("submitButton"));
      expect(passwordInput).not.toBeNull();
      expect(emailInput).not.toBeNull();
      expect((passwordInput as HTMLInputElement).value.length).toBeGreaterThan(7);
      const button = getByTestId("submitButton");
      expect(button).not.toHaveAttribute("disabled");
      expect(button).toBeEnabled();
    });
    it("Redirect to Dashboard Page", () => {
      const { getByTestId } = tree();
      const submitButton = getByTestId("submitButton");
      fireEvent.click(submitButton);
      expect(window.location.pathname).toEqual("/");
    });
    it("login check with redux flow", async () => {
        const postData: any = {
          email: "saravanan.p@qagreatinnovus.com",
          password: "12345678",
          devicetype: "Web",
        };

        const useDispatchMock = jest.spyOn(axios, "post").mockReturnValue(store.dispatch(onLogin(postData)));
        expect(useDispatchMock).toHaveBeenCalledTimes(1);
        expect(useDispatchMock).toHaveBeenCalledWith(
`${BASE_URL}${ENDPOINT.USER_SIGNIN}`,
postData,
        {
          headers: {
            Accept: "application/json", contentType: "application/json",
          },
        },
);
    });
  });
