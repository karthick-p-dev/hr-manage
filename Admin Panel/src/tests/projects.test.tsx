import React from "react";
import ReactDOM from "react-dom/client";
// import {store} from "../app/redux/store/store-index"
import { BrowserRouter as Router } from "react-router-dom";
import { render, fireEvent, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import DataTable from "react-data-table-component";
import axios from "axios";
import Delete from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { GridActionsCellItem } from "@mui/x-data-grid";
import ENDPOINT from "../helpers/Api";
import { BASE_URL } from "../config/config";
import Projects from "../feature/control_menu/project/Projects";
import "@testing-library/jest-dom";
import projectService from "../helpers/Services/projects.service";
import { store } from "../app/redux/store/store-index";
import { onLogin } from "../app/redux/actions/action";

let container: any = null;
let root: any = null;
let reqP: any;
const userinfo = {
  companyId: 1,
};
function compareKeys(a: any, b: any) {
  const aKeys = Object.keys(a).sort();
  const bKeys = Object.keys(b).sort();
  return JSON.stringify(aKeys) === JSON.stringify(bKeys);
}
describe("axios", () => {
    container = document.createElement("div");
    container.setAttribute("id", "root");
    document.body.appendChild(container);
    root = ReactDOM.createRoot(container);
    act(() => {
        root.render(<Provider store={store}>
            <Router>
                <Projects />
            </Router>
        </Provider>, container);
    });
    it("Assign project button should be enabled", () => {
        const title = screen.getByText("Projects");
        expect(title).toBeInTheDocument();
        const inputNode = screen.getByLabelText("Search");
        expect(inputNode).toBeInTheDocument();
      });
      it("Assign project button click", () => {
        const button = screen.getByTestId("assignProject");
        expect(button).toBeInTheDocument();
        expect(button).toBeEnabled();
        fireEvent.click(button);
        expect(window.location.pathname).toBe("/projects/assign");
      });
      it("Add project button click", () => {
        const button1 = screen.getByTestId("addProject");
        expect(button1).toBeInTheDocument();
        expect(button1).toBeEnabled();
        fireEvent.click(button1);
        expect(window.location.pathname).toBe("/projects/add");
      });

it("successful mock axios request - check response data", async () => {
  const testValuekeys: any = {
    id: 3,
    companyId: 1,
    teamleaderId: 28,
    managerId: 28,
    name: "Business Central 1",
    code: "P003",
    start_date: "2020-09-20T00:00:00.000Z",
    end_date: "2020-03-20T00:00:00.000Z",
    status: false,
    createdAt: "2022-09-02T03:46:42.000Z",
    updatedAt: "2022-10-05T10:48:49.000Z",
    createdBy: 68,
    updatedBy: 3,
    teamleader: {
        id: 28,
        positionId: 6,
        firstName: "Nambiyar",
        lastName: "J",
        userName: "Nambiyar J",
        designation: "Technology Manager",
        email: "nambiyar.j@qagreatinnovus.com",
        password: "$2b$10$6Y0RKXS80.iyPQPzKncqZuWOXObe5CNh1kYsAewgiN/ocuXh5bQrS",
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5hbWJpeWFyLmpAZ3JlYXRpbm5vdnVzLmNvbSIsImlhdCI6MTY1NzE2NjQ2MiwiZXhwIjoxNjY0OTQyNDYyfQ.JgdTpTSWZo_64cKIdNObl0ciLZyO3IPc0h2Dd0D3nW4",
        deviceId: "77397aa70bebd3df",
        fcmToken: "",
        mobileNumber: "9894615490",
        resqueToken: "",
        isActive: true,
        DOB: "15-09-1981",
        dateOfJoining: "2020-01-01",
        dateOfExit: null,
        gender: "Male",
        roleId: 2,
        companyId: 1,
        employeeId: 292,
        profile: "img-1649307877883.png",
        userOtp: "",
        numberOfLeaves: "9.00",
        onshore: false,
        createdAt: "2022-04-07T05:04:39.000Z",
        updateddAt: "2022-04-07T05:04:39.000Z",
    },
    manager: {
        id: 28,
        positionId: 6,
        firstName: "Nambiyar",
        lastName: "J",
        userName: "Nambiyar J",
        designation: "Technology Manager",
        email: "nambiyar.j@qagreatinnovus.com",
        password: "$2b$10$6Y0RKXS80.iyPQPzKncqZuWOXObe5CNh1kYsAewgiN/ocuXh5bQrS",
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5hbWJpeWFyLmpAZ3JlYXRpbm5vdnVzLmNvbSIsImlhdCI6MTY1NzE2NjQ2MiwiZXhwIjoxNjY0OTQyNDYyfQ.JgdTpTSWZo_64cKIdNObl0ciLZyO3IPc0h2Dd0D3nW4",
        deviceId: "77397aa70bebd3df",
        fcmToken: "",
        mobileNumber: "9894615490",
        resqueToken: "",
        isActive: true,
        DOB: "15-09-1981",
        dateOfJoining: "2020-01-01",
        dateOfExit: null,
        gender: "Male",
        roleId: 2,
        companyId: 1,
        employeeId: 292,
        profile: "img-1649307877883.png",
        userOtp: "",
        numberOfLeaves: "9.00",
        onshore: false,
        createdAt: "2022-04-07T05:04:39.000Z",
        updateddAt: "2022-04-07T05:04:39.000Z",
    },
  };

  const url = `${BASE_URL + ENDPOINT.GETALL_PROJECT}/${userinfo.companyId}`;
        const postData: any = {
          email: "saravanan.p@qagreatinnovus.com",
          password: "12345678",
          devicetype: "Web",
      };

        const getData = await store.dispatch(onLogin(postData));
        localStorage.setItem("UserToken", getData.payload.token);
        const token = localStorage.getItem("UserToken");

        const headers = {
            Accept: "application/json",
            contentType: "application/json",
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
        const asyncMock = jest.spyOn(axios, "get").mockResolvedValueOnce(projectService.getAllProject(userinfo));
        expect(asyncMock).toHaveBeenCalledTimes(1);
        expect(asyncMock).toHaveBeenCalledWith(
`${BASE_URL + ENDPOINT.GETALL_PROJECT}/${userinfo.companyId}`,
            {
                headers: {
                    Accept: "application/json", contentType: "application/json",
                },
            },
);
});
it("check field names", async () => {
  const columns: any = [
    {
      name: "No.",
      selector: (row: any, index: any) => index + 1,
      grow: 0,
      // width: 150
    },
    {
      name: "Project Code",
      selector: (row: any) => <div>{row.code ? row.code : ""}</div>,
      // width: 150
    },
    {
      name: "Project Title",
      selector: (row: any) => <div>{row.name ? row.name : ""}</div>,
    },
    {
      name: "Start Date",
      selector: (row: any) => <div>{row.start_date ? (row.start_date).split("T")[0] : ""}</div>,
    },
    {
      name: "End Date",
      selector: (row: any) => <div>{row.end_date ? (row.end_date).split("T")[0] : ""}</div>,
    },
    {
      name: "Project Manager",
      selector: (row: any) => <div>{row.manager.email ? row.manager.email : ""}</div>,
      maxWidth: "1500",
    },
    {
      name: "Team Leader",
      selector: (row: any) => <div>{row.teamleader.email ? row.teamleader.email : ""}</div>,
    },
    {
      name: "Actions",
      button: true,
      cell: (row: any) => (row.id ? (
        <>
         <GridActionsCellItem
          icon={<EditIcon data-testid = "editButton"/>}
          label="Edit"
          onClick={() => { window.location.pathname = `/projects/edit/${row.id}`; }}
          color="primary"
        />
        <Delete data-testid = "deleteButton" />
        </>
      ) : null),
    },
  ];

  render(<DataTable
    columns={columns}
    data={reqP.data.data}
    highlightOnHover
    pagination
    paginationPerPage={5}
    paginationRowsPerPageOptions={[10, 25, 50, 100]}
    paginationComponentOptions={{
        rowsPerPageText: "Records per page:",
        rangeSeparatorText: "out of",
    }}
/>);
  const testValuekeys: any = {
      no: "No.",
      projectCode: "Project Code",
      projectTitle: "Project Title",
      startDate: "Start Date",
      endDate: "End Date",
      projectManager: "Project Manager",
      teamLeader: "Team Leader",
      actions: "Actions",
  };
  Object.values(testValuekeys).forEach((value) => {
      expect(screen.getByText(`${value}`)).toBeInTheDocument();
  });
  const editbutton = screen.getAllByTestId("editButton")[0];
  expect(editbutton).toBeInTheDocument();
  expect(editbutton).toBeEnabled();
  const deletebutton = screen.getAllByTestId("deleteButton")[0];
  expect(deletebutton).toBeInTheDocument();
  expect(deletebutton).toBeEnabled();
 });
});
