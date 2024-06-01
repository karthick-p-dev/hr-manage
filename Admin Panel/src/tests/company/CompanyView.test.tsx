import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { fireEvent, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { act } from "react-dom/test-utils";
import ReactDOM from "react-dom/client";
import "@testing-library/jest-dom";
import axios from "axios";
import CompanyView from "../../feature/company/CompanyView";
import { BASE_URL } from "../../config/config";
import ENDPOINT from "../../helpers/Api";
import companyService from "../../helpers/Services/company.service";
import { store } from "../../app/redux/store/store-index";
import { onLogin } from "../../app/redux/actions/action";

function compareKeys(a: any, b: any) {
    const aKeys = Object.keys(a).sort();
    const bKeys = Object.keys(b).sort();
    return JSON.stringify(aKeys) === JSON.stringify(bKeys);
}

let container: any = null;
let root: any = null;

describe("Test Company View", () => {
    container = document.createElement("div");
    container.setAttribute("id", "root");
    document.body.appendChild(container);
    root = ReactDOM.createRoot(container);
    act(() => {
        root.render(<Provider store={store}>
            <Router>
                <CompanyView />
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
            Authorization: `Bearer ${token}`,
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
    it("button should be enabled when enter a page and click event and check title", () => {
        expect(screen.getByText("Company View")).toBeInTheDocument();
        const button = screen.getAllByTestId("editButton")[0];
        expect(button).toBeInTheDocument();
        expect(button).toBeEnabled();
        fireEvent.click(button);
        expect(window.location.pathname).toBe("/companies/edit");
    });
    it("check field names", () => {
        const testValuekeys: any = {
            companyName: "Company Name",
            companyAddress: "Company Address",
            email: "Email",
            contactNumber: "Contact Number",
            noOfEmployees: "No Of Employees",
            fullDayTiming: "Full Day Time",
            halfDayTime: "Half Day Time",
            regularWorkIn: "Punch In",
            regularWorkOut: "Punch Out",
            noOfLeaves: "No Of Leave",
        };
        Object.values(testValuekeys).forEach((value) => {
            expect(screen.getByText(`${value}`)).toBeInTheDocument();
        });
    });
});
