import React, { useState, useEffect, forwardRef, Fragment } from "react";
import MaterialTable from "material-table";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import theme from "../../pages/theme";

import { data1, data2 } from "./data";
import Grid from "@material-ui/core/Grid";
import ArrowDownward from "@material-ui/icons/ArrowDownward";

import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";

import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";

import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";

import RefreshIcon from "@material-ui/icons/Refresh";
import PlaylistAddIcon from "@material-ui/icons/PlaylistAdd";

import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

const PortfolioTable = (props) => {
  const tableIcons = {
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    Refresh: forwardRef((props, ref) => <RefreshIcon {...props} ref={ref} />),
    Add: forwardRef((props, ref) => <PlaylistAddIcon {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => (
      <ChevronLeft {...props} ref={ref} />
    )),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => (
      <ArrowDownward {...props} ref={ref} />
    )),
  };

  const [data, setData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    setData(data2);
  }, []);

  const renderChange = (rowData) => {
    const isNegative =
      rowData.change && Math.sign(rowData.change) === -1 ? true : false;
    return (
      <Fragment>
        <Grid
          container
          direction="row"
          justify="flex-start"
          alignItems="center"
          style={{
            color: isNegative ? "red" : "green",
          }}
          wrap="nowrap"
        >
          <Grid item>
            {isNegative ? (
              <ArrowDropDownIcon
                style={{
                  marginBottom: "-5px",
                }}
              />
            ) : (
              <ArrowDropUpIcon
                style={{
                  marginBottom: "-5px",
                }}
              />
            )}
          </Grid>
          <Grid item>{`${rowData.change.toFixed(2)}%`}</Grid>
        </Grid>
        {/* <span
        style={{
          color: isNegative ? "red" : "green",
        }}
      >            
      </span> */}
      </Fragment>
    );
  };

  return (
    <div style={{ maxWidth: "100%" }}>
      {/* <MuiThemeProvider theme={theme}> */}
      <MaterialTable
        title="My Portfolio"
        icons={tableIcons}
        columns={[
          { title: "Ticker", field: "ticker" },
          { title: "Quantity", field: "qty" },
          {
            title: "Avg. Cost",
            field: "avgCost",
            render: (rowData) => rowData.avgCost.toFixed(2),
          },
          { title: "Change", field: "change", render: renderChange },

          {
            title: "Price",
            field: "price",
            render: (rowData) => rowData.price.toFixed(2),
          },
          { title: "Date", field: "date" },
        ]}
        data={data}
        actions={[
          {
            icon: tableIcons.Delete,
            tooltip: "Delete",
            onClick: (event, rowData) => alert("You delete " + rowData.name),
          },
          {
            icon: tableIcons.Add,
            tooltip: "Add to Portfolio",
            isFreeAction: true,
            onClick: (event) => alert("You want to add a new row"),
          },
        ]}
        onRowClick={(evt, selectedRow) =>
          setSelectedRow(selectedRow.tableData.id)
        }
        options={{
          actionsColumnIndex: -1,
          exportButton: true,
          headerStyle: {
            fontWeight: "bold",
          },
          rowStyle: (rowData) => ({
            fontSize: "1rem",
            backgroundColor:
              selectedRow === rowData.tableData.id ? "#EEE" : "#FFF",
          }),
        }}
      />
      {/* </MuiThemeProvider> */}
    </div>
  );
};

export default PortfolioTable;
