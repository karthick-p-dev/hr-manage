import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { render, within } from "@testing-library/react";
import axios from "axios";
import { leaveHeaders, leaveData } from "./leavedata";
import { BASE_URL } from "../../../config/config";
import ENDPOINT from "../../../helpers/Api";
import leaveService from "../../../helpers/Services/leave.service";
import { store } from "../../../app/redux/store/store-index";
import { onLogin } from "../../../app/redux/actions/action";

const LeaveComponent = () => (
        <div data-testid="mock-datagrid">
        <DataGrid
            editMode="row"
            columns={leaveHeaders}
            rows={leaveData}
            experimentalFeatures={{ newEditingApi: true }}
        />
        </div>
    );

const createRender = () => render(<LeaveComponent />);

describe("Datagrid problem repro", () => {
    it("renders the datagrid", () => {
        const { getByTestId } = createRender();
        expect(getByTestId("mock-datagrid")).toBeInTheDocument();
    });
    it("Leave List Page - successful mock axios request", async () => {
        const postData: any = {
            email: "saravanan.p@qagreatinnovus.com",
            password: "12345678",
            devicetype: "Web",
        };
        const getData = await store.dispatch(onLogin(postData));
        const asyncMock = jest.spyOn(axios, "get").mockResolvedValueOnce(leaveService.getLeaveByUser(getData.payload));
        expect(asyncMock).toHaveBeenCalledTimes(1);
        expect(asyncMock).toHaveBeenCalledWith(
            `${BASE_URL + ENDPOINT.GET_LEAVE_BY_USERID}/${getData.payload.id}`,
            {
                headers: {
                    Accept: "application/json", contentType: "application/json",
                },
            },
        );
    });
    it("should render columns", () => {
        const { getByText } = createRender();
        expect(getByText("No.")).toBeInTheDocument();
        expect(getByText("Name")).toBeInTheDocument();
        expect(getByText("Leave Type")).toBeInTheDocument();
        // expect(getByText("From Date")).toBeInTheDocument();
        // expect(getByText('To Date')).toBeInTheDocument();
        // expect(getByText('Status')).toBeInTheDocument();
        // expect(getByText('Approved By')).toBeInTheDocument();
    });
    //   it('should render row', () => {
    //     const { getByText } = createRender();
    //     expect(getByText('id')).toBeInTheDocument();
    //   });
    it("Renders all columns", async () => {
        const { getAllByRole } = createRender();
        expect(within(getAllByRole("row")[0]).getAllByRole("columnheader")).toHaveLength(3);
    });
});
