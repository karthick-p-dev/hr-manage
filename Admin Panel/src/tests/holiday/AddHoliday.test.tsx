import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { act } from "react-dom/test-utils";
import ReactDOM from "react-dom/client";
import "@testing-library/jest-dom";
import axios from "axios";
import AddHoliday from "../../feature/Holiday/AddHoliday";
import { BASE_URL } from "../../config/config";
import ENDPOINT from "../../helpers/Api";
import holidayService from "../../helpers/Services/holiday.service";
import { store } from "../../app/redux/store/store-index";

let container: any = null;
let root: any = null;

describe("Test Add Holiday", () => {
    container = document.createElement("div");
    container.setAttribute("id", "root");
    document.body.appendChild(container);
    root = ReactDOM.createRoot(container);
    act(() => {
        root.render(<Provider store={store}>
            <Router>
                <AddHoliday />
            </Router>
        </Provider>, container);
    });

    it("click event for cancel,back and submit button", () => {
        expect(screen.getByText("Holidays")).toBeInTheDocument();
        // Cancel
        const button = screen.getAllByTestId("cancelButton")[0];
        expect(button).toBeInTheDocument();
        expect(button).toBeEnabled();
        fireEvent.click(button);
        expect(window.location.pathname).toBe("/holidays");
        // Back
        const backbutton = screen.getAllByTestId("backButton")[0];
        expect(backbutton).toBeInTheDocument();
        expect(backbutton).toBeEnabled();
        fireEvent.click(backbutton);
        expect(window.location.pathname).toBe("/holidays");
        // Submit
        const submitbutton = screen.getAllByTestId("submitButton")[0];
        expect(submitbutton).toBeInTheDocument();
        expect(submitbutton).toBeEnabled();
    });
    it("check field names", () => {
        const testValuekeys: any = {
            Date: "Date",
            Reason: "Reason",
            sendNotification: "Send Notification",
        };
        Object.values(testValuekeys).forEach((value) => {
            screen.getAllByText(`${value}`).forEach((text) => {
                expect(text).toBeInTheDocument();
            });
        });
    });

    it("checking fields type and default value check", async () => {
        const Date = screen.getAllByLabelText(/Date/i)[0];
        const Reason = screen.getByLabelText(/Reason/i);
        const sendNotification = screen.getByLabelText(/Send Notification/i);

        // field validation
        expect((Date as HTMLInputElement).type).toBe("tel");
        expect((Reason as HTMLInputElement).type).toBe("text");
        expect((sendNotification as HTMLInputElement).type).toBe("checkbox");
        expect((sendNotification as HTMLInputElement).value).toBe("on");
    });
    it("submit button event and fields validation", async () => {
        const values = {
            date: "20-10-2022",
            day: "Thursday",
            reason: "testing",
            companyId: 1,
            shownotification: false,
        };
        const submitbutton = screen.getAllByTestId("submitButton")[0];
        expect(submitbutton).toBeInTheDocument();
        expect(submitbutton).toBeEnabled();

        const Date = screen.getAllByLabelText(/Date/i)[0];
        const Reason = screen.getByLabelText(/Reason/i);
        const sendNotification = screen.getByLabelText(/Send Notification/i);

        await waitFor(() => {
            fireEvent.change(Date, {
                target: {
                    value: "20-10-2022",
                },
            });
        });
        await waitFor(() => {
            fireEvent.change(Reason, {
                target: {
                    value: "General",
                },
            });
        });
        await waitFor(() => {
            fireEvent.change(sendNotification, {
                target: {
                    value: "on",
                },
            });
        });

        // field validation
        expect((Date as HTMLInputElement).value).not.toBe("");
        expect((Reason as HTMLInputElement).value).not.toBe("");
        expect((sendNotification as HTMLInputElement).value).not.toBe("");

        await waitFor(() => { fireEvent.click(submitbutton); });
        const asyncMock = jest.spyOn(axios, "post").mockResolvedValueOnce(holidayService.createHoliday(values));
        expect(asyncMock).toHaveBeenCalledTimes(1);
        expect(asyncMock).toHaveBeenCalledWith(
`${BASE_URL}${ENDPOINT.CREATE_HOLIDAYS}`,
values,
{
                headers: {
                    Accept: "application/json", contentType: "application/json",
                },
            },
);

        expect(window.location.pathname).toBe("/holidays");
    });
});
