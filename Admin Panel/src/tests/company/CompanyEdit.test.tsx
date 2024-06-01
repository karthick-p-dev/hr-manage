import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { act } from "react-dom/test-utils";
import ReactDOM from "react-dom/client";
import "@testing-library/jest-dom";
import axios from "axios";
import CompanyEdit from "../../feature/company/CompanyEdit";
import { BASE_URL } from "../../config/config";
import ENDPOINT from "../../helpers/Api";
import companyService from "../../helpers/Services/company.service";
import { store } from "../../app/redux/store/store-index";
import { onLogin } from "../../app/redux/actions/action";

let container: any = null;
let root: any = null;

function compareKeys(a: any, b: any) {
    const aKeys = Object.keys(a).sort();
    const bKeys = Object.keys(b).sort();
    return JSON.stringify(aKeys) === JSON.stringify(bKeys);
}
// const store: any = createStore((innerState: any) => innerState, {});
describe("Test Company Edit", () => {
    container = document.createElement("div");
    container.setAttribute("id", "root");
    document.body.appendChild(container);
    root = ReactDOM.createRoot(container);
    act(() => {
        root.render(<Provider store={store}>
            <Router>
                <CompanyEdit />
            </Router>
        </Provider>, container);
    });
    it("successful mock axios request - check response data", async () => {
        const testValuekeys: any = {
            id: 1,
            companyName: "GIS..",
            companyAddress: "The infinity tower, 592/3B Thirupparankundram, Avaniyapuram main Rd, Madurai-625005",
            contactNumber: "89990001288",
            email: "hr@greatinnovus.com",
            noOfEmployees: 95,
            noOfLeaves: 14,
            fullDayTiming: 8,
            halfDayTime: 4,
            regularWorkIn: "09:00",
            regularWorkOut: "18:30",
            latitude: null,
            longitude: null,
            geofencing: null,
            singleLogin: false,
            createdAt: "2022-04-06T10:15:00.000Z",
            updateddAt: "2022-09-19T07:37:39.000Z",
        };
        const postData: any = {
            email: "saravanan.p@qagreatinnovus.com",
            password: "12345678",
            devicetype: "Web",
        };
        const getData = await store.dispatch(onLogin(postData));
        localStorage.setItem("UserToken", getData.payload.token);
        const url = BASE_URL + ENDPOINT.GET_COMPANY;
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
        const data = compareKeys(testValuekeys, reqP.data.data[0]);
        expect(data).toBe(true);
        const asyncMock = jest.spyOn(axios, "get").mockResolvedValueOnce(companyService.getCompany());
        expect(asyncMock).toHaveBeenCalledTimes(1);
        expect(asyncMock).toHaveBeenCalledWith(
`${BASE_URL}${ENDPOINT.GET_COMPANY}`,
            {
                headers: {
                    Accept: "application/json", contentType: "application/json",
                },
            },
);
    });
    it("click event for cancel and submit button", () => {
        expect(screen.getByText("Company Details")).toBeInTheDocument();
        const button = screen.getAllByTestId("cancelButton")[0];
        expect(button).toBeInTheDocument();
        expect(button).toBeEnabled();
        fireEvent.click(button);
        expect(window.location.pathname).toBe("/companies");
        const submitbutton = screen.getAllByTestId("submitButton")[0];
        expect(submitbutton).toBeInTheDocument();
        expect(submitbutton).toBeEnabled();
    });
    it("check field names", () => {
        const testValuekeys: any = {
            companyName: "Company Name*",
            companyAddress: "Company Address*",
            email: "Company Email*",
            contactNumber: "Company Number*",
            noOfEmployees: "No of Employees*",
            fullDayTiming: "Full Day Timing (8)*",
            halfDayTime: "Half Day Timing (4)*",
            regularWorkIn: "Regular Work In (9.00 AM)*",
            regularWorkOut: "Regular Work Out (6.30 PM)*",
            noOfLeaves: "No of Leaves*",
        };
        Object.values(testValuekeys).forEach((value) => {
            screen.getAllByText(`${value}`).forEach((text) => {
                expect(text).toBeInTheDocument();
            });
        });
    });
    it("checking fields type", async () => {
        const CompanyName = screen.getByLabelText(/Company Name*/i);
        const companyAddress = screen.getByLabelText(/Company Address*/i);
        const email = screen.getByLabelText(/Company Email*/i);
        const contactNumber = screen.getByLabelText(/Company Number*/i);
        const noOfEmployees = screen.getByLabelText(/No of Employees*/i);
        const fullDayTiming = screen.getByLabelText(/Full Day Timing (8)*/i);
        const halfDayTime = screen.getByLabelText(/Half Day Timing (4)*/i);
        const regularWorkIn = screen.getByLabelText(/Regular Work In (9.00 AM)*/i);
        const regularWorkOut = screen.getByLabelText(/Regular Work Out (6.30 PM)*/i);
        const noOfLeaves = screen.getByLabelText(/No of Leaves*/i);

        // field validation
        expect((CompanyName as HTMLInputElement).type).toBe("text");
        expect((companyAddress as HTMLInputElement).type).toBe("text");
        expect((email as HTMLInputElement).type).toBe("text");
        expect((contactNumber as HTMLInputElement).type).toBe("text");
        expect((noOfEmployees as HTMLInputElement).type).toBe("text");
        expect((fullDayTiming as HTMLInputElement).type).toBe("text");
        expect((halfDayTime as HTMLInputElement).type).toBe("text");
        expect((regularWorkIn as HTMLInputElement).type).toBe("time");
        expect((regularWorkOut as HTMLInputElement).type).toBe("time");
        expect((noOfLeaves as HTMLInputElement).type).toBe("text");
    });
    it("submit button event and fields validation", async () => {
        const values = {
            companyInfo: {
                companyAddress: "",
                companyName: "",
                contactNumber: 0,
                fromDate: "2022-10-07T06:32:59.320Z",
                toDate: "2022-10-07T06:32:59.320Z",
                email: "",
                fullDayTiming: 0,
                geofencing: null,
                halfDayTime: 0,
                latitude: null,
                longitude: null,
                noOfEmployees: 0,
                noOfLeaves: 0,
                singleLogin: false,
                regularWorkIn: "0.00 AM",
                regularWorkOut: "0.00 PM",
            },
            id: 1,
            companyName: "GIS...",
            companyAddress: "The infinity tower, 592/3B Thirupparankundram, Avaniyapuram main Rd, Madurai-625005",
            contactNumber: "89990001288",
            email: "hr@greatinnovus.com",
            noOfEmployees: 95,
            noOfLeaves: 14,
            fullDayTiming: 8,
            halfDayTime: 4,
            regularWorkIn: "09:00",
            regularWorkOut: "18:30",
            latitude: null,
            longitude: null,
            geofencing: null,
            singleLogin: false,
            createdAt: "2022-04-06T10:15:00.000Z",
            updateddAt: "2022-10-07T06:32:52.000Z",
        };
        const submitbutton = screen.getAllByTestId("submitButton")[0];
        expect(submitbutton).toBeInTheDocument();
        expect(submitbutton).toBeEnabled();
        const CompanyName = screen.getByLabelText(/Company Name*/i);
        const companyAddress = screen.getByLabelText(/Company Address*/i);
        const email = screen.getByLabelText(/Company Email*/i);
        const contactNumber = screen.getByLabelText(/Company Number*/i);
        const noOfEmployees = screen.getByLabelText(/No of Employees*/i);
        const fullDayTiming = screen.getByLabelText(/Full Day Timing (8)*/i);
        const halfDayTime = screen.getByLabelText(/Half Day Timing (4)*/i);
        const regularWorkIn = screen.getByLabelText(/Regular Work In (9.00 AM)*/i);
        const regularWorkOut = screen.getByLabelText(/Regular Work Out (6.30 PM)*/i);
        const noOfLeaves = screen.getByLabelText(/No of Leaves*/i);

        await waitFor(() => {
            fireEvent.change(CompanyName, {
                target: {
                    value: "Michaux",
                },
            });
        });
        await waitFor(() => {
            fireEvent.change(companyAddress, {
                target: {
                    value: "Michaux",
                },
            });
        });
        await waitFor(() => {
            fireEvent.change(email, {
                target: {
                    value: "Michaux@gmail.com",
                },
            });
        });
        await waitFor(() => {
            fireEvent.change(contactNumber, {
                target: {
                    value: "9988776655",
                },
            });
        });
        await waitFor(() => {
            fireEvent.change(noOfEmployees, {
                target: {
                    value: "Michaux",
                },
            });
        });
        await waitFor(() => {
            fireEvent.change(fullDayTiming, {
                target: {
                    value: "Michaux",
                },
            });
        });
        await waitFor(() => {
            fireEvent.change(halfDayTime, {
                target: {
                    value: "Michaux",
                },
            });
        });
        await waitFor(() => {
            fireEvent.change(regularWorkIn, {
                target: {
                    value: "09:00",
                },
            });
        });
        await waitFor(() => {
            fireEvent.change(regularWorkOut, {
                target: {
                    value: "09:00",
                },
            });
        });
        await waitFor(() => {
            fireEvent.change(noOfLeaves, {
                target: {
                    value: "10",
                },
            });
        });
        // field validation
        expect((CompanyName as HTMLInputElement).value).not.toBe("");
        expect((companyAddress as HTMLInputElement).value).not.toBe("");
        expect((email as HTMLInputElement).value).not.toBe("");
        expect((contactNumber as HTMLInputElement).value).not.toBe("");
        expect((noOfEmployees as HTMLInputElement).value).not.toBe("");
        expect((fullDayTiming as HTMLInputElement).value).not.toBe("");
        expect((halfDayTime as HTMLInputElement).value).not.toBe("");
        expect((regularWorkIn as HTMLInputElement).value).not.toBe("");
        expect((regularWorkOut as HTMLInputElement).value).not.toBe("");
        expect((noOfLeaves as HTMLInputElement).value).not.toBe("");

        // email regex
        expect(/\S+@\S+\.\S+/.test((email as HTMLInputElement).value)).toBe(true);
        expect((contactNumber as HTMLInputElement).value.length).toBe(10);

        await waitFor(() => { fireEvent.click(submitbutton); });
        const asyncMock = jest.spyOn(axios, "post").mockResolvedValueOnce(companyService.editCompany(values));
        expect(asyncMock).toHaveBeenCalledTimes(1);
        expect(asyncMock).toHaveBeenCalledWith(
`${BASE_URL}${ENDPOINT.UPDATE_COMPANY}`,
values,
{
                headers: {
                    Accept: "application/json", contentType: "application/json",
                },
            },
);

        expect(window.location.pathname).toBe("/companies");
    });
});
