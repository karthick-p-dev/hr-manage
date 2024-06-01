import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { act } from "react-dom/test-utils";
import ReactDOM from "react-dom/client";
import "@testing-library/jest-dom";
import axios from "axios";
import EditHoliday from "../../feature/Holiday/EditHoliday";
import { BASE_URL } from "../../config/config";
import ENDPOINT from "../../helpers/Api";
import holidayService from "../../helpers/Services/holiday.service";
import { store } from "../../app/redux/store/store-index";
import { onLogin } from "../../app/redux/actions/action";

let container: any = null;
let root: any = null;

function compareKeys(a: any, b: any) {
    const aKeys = Object.keys(a).sort();
    const bKeys = Object.keys(b).sort();
    return JSON.stringify(aKeys) === JSON.stringify(bKeys);
}

describe("Test Edit Holiday", () => {
    container = document.createElement("div");
    container.setAttribute("id", "root");
    document.body.appendChild(container);
    root = ReactDOM.createRoot(container);
    act(() => {
        root.render(<Provider store={store}>
            <Router>
                <EditHoliday />
            </Router>
        </Provider>, container);
    });
    it("successful mock axios request - check response data", async () => {
        const testValuekeys: any = { status: true, statuscode: 200, data: [{ id: 52, date: "25-10-2022", shownotification: false, reason: "Diwali nextday", day: "Thursday", companyId: 1, createdAt: "2022-10-17T06:16:46.000Z", updateddAt: "2022-10-17T07:12:19.000Z" }], message: "success." };
        const postData: any = {
            email: "saravanan.p@qagreatinnovus.com",
            password: "12345678",
            devicetype: "Web",
        };
        const getData = await store.dispatch(onLogin(postData));
        localStorage.setItem("UserToken", getData.payload.token);
        const url = `${BASE_URL + ENDPOINT.GETALL_HOLIDAYSBYID}/${52}/${getData.payload.companyId}`;
        const token = localStorage.getItem("UserToken");
        let reqP: any;
        const headers = {
            Accept: "application/json",
            contentType: "application/json",
            // if(localStorage.getItem("UserToken")) {
            Authorization: `Bearer ${token}`,
            // }
        };
        try {
            reqP = await axios.get(url, { headers })
                .then((response: any) => response)
                .catch((error: any) => {
                    console.log("error::", error);
                });
        } catch (error) {
            console.error(error);
        }
        const data = compareKeys(testValuekeys.data[0], reqP.data.data[0]);

        expect(data).toBe(true);
        const asyncMock = jest.spyOn(axios, "get").mockResolvedValueOnce(holidayService.getHolidaybyID(52, getData.payload));
        expect(asyncMock).toHaveBeenCalledTimes(1);
        expect(asyncMock).toHaveBeenCalledWith(
`${BASE_URL + ENDPOINT.GETALL_HOLIDAYSBYID}/${52}/${getData.payload.companyId}`,
            {
                headers: {
                    Accept: "application/json", contentType: "application/json",
                },
            },
);
    });

    it("click event for cancel and update button", () => {
        expect(screen.getByText("Edit Holiday")).toBeInTheDocument();
        // Cancel
        const button = screen.getAllByTestId("cancelButton")[0];
        expect(button).toBeInTheDocument();
        expect(button).toBeEnabled();
        fireEvent.click(button);
        expect(window.location.pathname).toBe("/holidays");

        // Update
        const submitbutton = screen.getAllByTestId("updateButton")[0];
        expect(submitbutton).toBeInTheDocument();
        expect(submitbutton).toBeEnabled();
    });
    it("check field names", () => {
        const testValuekeys: any = {
            Date: "date",
            Reason: "Reason*",
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
    it("update button event and fields validation", async () => {
        const values = {
            date: "20-10-2022",
            day: "Thursday",
            reason: "testing",
            companyId: 1,
            shownotification: false,
        };
        const submitbutton = screen.getAllByTestId("updateButton")[0];
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
        const asyncMock = jest.spyOn(axios, "post").mockResolvedValueOnce(holidayService.updateHoliday(values));
        expect(asyncMock).toHaveBeenCalledTimes(1);
        expect(asyncMock).toHaveBeenCalledWith(
`${BASE_URL}${ENDPOINT.UPDATE_HOLIDAYS}`,
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
