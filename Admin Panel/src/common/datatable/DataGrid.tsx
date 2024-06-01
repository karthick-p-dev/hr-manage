import React, { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";

function DataGridComponent(props: any) {
    useEffect(() => {
    });
    return (
            <div style={{ height: 550, width: "100%" }}>
                {props.disableColumnFilter ?
                 <DataGrid
                 pagination
                 editMode="row"
                 disableColumnFilter
                 disableColumnMenu={true}
                 // {props.disableColumnFilter && disableColumnFilter}
                 rows={props.items}
                 columns={props.columns}
                 experimentalFeatures={{ newEditingApi: true }}
             />:
             <DataGrid
                pagination
                editMode="row"
                disableColumnMenu={true}
                //disableColumnFilter
                // {props.disableColumnFilter && disableColumnFilter}
                rows={props.items}
                columns={props.columns}
                experimentalFeatures={{ newEditingApi: true }}
            />
             }
            </div>
    );
}
export default DataGridComponent;
