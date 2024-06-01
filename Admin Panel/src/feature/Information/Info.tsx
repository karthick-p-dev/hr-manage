import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Delete from "@mui/icons-material/Delete";
import Tooltip from "@mui/material/Tooltip";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import DataGridComponent from "../../common/datatable/DataGrid";
import { BASE_URL } from "../../config/config";
import { post } from "../../helpers/fetch-Service-Methods";
import informationService from "../../helpers/Services/information.service";

const Info = () => {
    const userinfo: any = useSelector((state: any) => state && state.signReducer && state.signReducer.entities);

const [info, setInfo] = useState<any>([]);
const [searchText, setSearchText] = useState("");

    const navigate = useNavigate();
    const inputHandler = (e:any) => {
        const lowerCase = e.target.value.toLowerCase();
        setSearchText(lowerCase);
      };

      const filteredData = info.filter((el:any) => {
        if (searchText === "") {
            return el;
        }

            return (String(el.index).toLowerCase().includes(searchText) || el.textContent.toLowerCase().includes(searchText));
    });

    async function getInformation() {
        const response = await informationService.getInformation(userinfo);
        if (response.status && response.data) {
          (response.data).map((information:any, index:any) => {
                information.index = index + 1;
                return information;
          });
          setInfo(response.data);
        }
    }
    useEffect(() => {
        getInformation();
      }, []);
    const columns: any = [
        {
          headerName: "No.",
          field: "index",
          editable: false,
        },
        {
          headerName: "Image",
          field: "imageName",
          editable: false,
          // width: 150
        },
        {
          headerName: "Text Content ",
          field: "textContent",
          editable: false,
        },
        {
            headerName: "Actions",
            renderCell: (row: any) => (row.id ? (
              <>
               <Tooltip title="Delete">
              <GridActionsCellItem
                icon={ <Delete />}
                label="Delete"
                onClick={async () => {
                 const reponse = await post(`${`${BASE_URL}/information/deleteinfo`}`, { id: row.id });
                 if (reponse.status) {
                  getInformation();
                //   setOpen(true);
                 }
                }}
                color="error"
              />
              </Tooltip>
              </>
            ) : null),
          },
        ];

return (
    <>
      <Card sx={{ display: "flex" }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent sx={{ flex: "1 0 auto" }}>
              <div style= {{ display: "flex", justifyContent: "space-between" }}>
                  <div>
            <p style={{ float: "left", fontSize: "22px", fontWeight: 500 }} className="fw-bolder" title = "Projects">Information</p></div>
            <div>
            <Button variant="contained" style={{ marginLeft: "-5px" }} onClick={() => { navigate("/information/add"); }}>Add information</Button>
            <br />
            <br />
            <br />
            <div className="search">
                    <TextField
                      id="outlined-basic"
                      onChange={inputHandler}
                      variant="outlined"
                      fullWidth
                      label="Search"

                    />
                </div>
            </div>
            </div>

{/*
            <Snackbar open={open} autoHideDuration={1000} onClose={handleClose}>
    <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
      This is a success message!
    </Alert>
  </Snackbar> */}

            <DataGridComponent columns={columns} items={filteredData}/>

            {/* <DataTable
              columns={columns}
              data={filteredData}
              highlightOnHover
              pagination
              paginationPerPage={10}
              paginationRowsPerPageOptions={[10, 25, 50, 100]}
              paginationComponentOptions={{
                rowsPerPageText: "Records per page:",
                rangeSeparatorText: "out of",
              }}
            /> */}
          </CardContent>
        </Box>
        </Card>
    </>
  );
        };
export default Info;
