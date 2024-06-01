import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { screen, within } from "@testing-library/react";
import { Provider } from "react-redux";
import { act } from "react-dom/test-utils";
import ReactDOM from "react-dom/client";
import "@testing-library/jest-dom";
import axios from "axios";
import { DataGrid, GridActionsCellItem, GridColumns } from "@mui/x-data-grid";

import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import { BASE_URL } from "../../config/config";
import ENDPOINT from "../../helpers/Api";
import holidayService from "../../helpers/Services/holiday.service";
import { store } from "../../app/redux/store/store-index";
import Holiday from "../../feature/Holiday/Holiday";
import { onLogin } from "../../app/redux/actions/action";

let container: any = null;
let root: any = null;

const columns: GridColumns = [
    {
      headerName: "No.",
      field: "id",
      editable: false,

    },
    {
       headerName: "Date.",
      field: "date",
      editable: true,

    },
    {
       headerName: "Holiday.",
      field: "reason",
      editable: true,

    },
    {
      headerName: "Actions.",
      field: "action",
      renderCell: (row: any) => (row.id ? (
        <>
            {/* <Edit onClick={() => { navigate(`/edit-holiday/${row.id}`); }}/> */}
            <GridActionsCellItem
                icon={<Edit data-testid="editButton" />}
                label="Edit"
                color="primary"
            />
            <Delete data-testid="deleteButton" />
        </>
    ) : null),
    },
  ];

  function compareKeys(a: any, b: any) {
    const aKeys = Object.keys(a).sort();
    const bKeys = Object.keys(b).sort();
    return JSON.stringify(aKeys) === JSON.stringify(bKeys);
  }

describe("Test Holiday", () => {
    container = document.createElement("div");
    container.setAttribute("id", "root");
    document.body.appendChild(container);
    root = ReactDOM.createRoot(container);
    act(() => {
        root.render(<Provider store={store}>
            <Router>
                <Holiday />
            </Router>
        </Provider>, container);
    });

    it("check header", () => {
        expect(screen.getByText("Holidays")).toBeInTheDocument();
    });
    it("check datatable field names", async () => {
        const testValuedata: any = {
            status: true,
            statuscode: 200,
            data: [
                {
                    id: 60,
                    date: "24-10-2022",
                    shownotification: false,
                    reason: "Diwali",
                    day: "Monday",
                    companyId: 1,
                    createdAt: "2022-10-18T06:37:19.000Z",
                    updateddAt: "2022-10-18T06:37:19.000Z",
                },
                {
                    id: 61,
                    date: "25-10-2022",
                    shownotification: false,
                    reason: "Diwali Nextday.",
                    day: "Tuesday",
                    companyId: 1,
                    createdAt: "2022-10-18T06:37:45.000Z",
                    updateddAt: "2022-10-18T06:41:18.000Z",
                },
            ],
            message: "Listed successfully .",
        };

        const userinfo = {
            companyId: 1,
        };
        const postData: any = {
            email: "saravanan.p@qagreatinnovus.com",
            password: "12345678",
            devicetype: "Web",
        };
        const getData = await store.dispatch(onLogin(postData));
        localStorage.setItem("UserToken", getData.payload.token);
        const token = localStorage.getItem("UserToken");
        let reqP: any;
        const headers = {
            Accept: "application/json",
            contentType: "application/json",
            // if(localStorage.getItem("UserToken")) {
            Authorization: `Bearer ${token}`,
            // }
        };

        const url = `${BASE_URL + ENDPOINT.GETALL_HOLIDAYS}/${userinfo.companyId}`;
        // var getHoliday = await holidayService.getallHoliday(userinfo);
        try {
            reqP = await axios.get(url, { headers })
                .then((response: any) => response)
                .catch((error: any) => {
                    console.log("error::", error);
                });
        } catch (error) {
            console.error(error);
        }
        const data = compareKeys(testValuedata.data[0], reqP.data.data[0]);

        expect(data).toBe(true);
        const asyncMock = jest.spyOn(axios, "get").mockResolvedValueOnce(holidayService.getallHoliday(getData.payload));
        expect(asyncMock).toHaveBeenCalledTimes(1);
        expect(asyncMock).toHaveBeenCalledWith(
`${BASE_URL + ENDPOINT.GETALL_HOLIDAYS}/${userinfo.companyId}`,
            {
                headers: {
                    Accept: "application/json", contentType: "application/json",
                },
            },
);
       const RenderContainer = () => (
            <div data-testid="mock-datagrid">
        <DataGrid
            editMode="row"
            columns={columns}
            rows={reqP.data.data}
            experimentalFeatures={{ newEditingApi: true }}
        />
        </div>
        );

            container = document.createElement("div");
            container.setAttribute("id", "root");
            document.body.appendChild(container);
            root = ReactDOM.createRoot(container);
            act(() => {
                root.render(<RenderContainer />);
            });

        expect(screen.getByTestId("mock-datagrid")).toBeInTheDocument();

        const testValuekeys: any = {
            No: "No.",
            Date: "Date.",
            Holiday: "Holiday.",
            // Actions: "Actions.",
        };

        Object.values(testValuekeys).forEach((value) => {
            screen.getAllByText(`${value}`).forEach((text) => {
            expect(text).toBeInTheDocument();
            });
        });
        expect(within(screen.getAllByRole("row")[0]).getAllByRole("columnheader")).toHaveLength(3);
    });
});
