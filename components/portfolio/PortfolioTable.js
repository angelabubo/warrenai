import React, { useState, useEffect, forwardRef, Fragment } from "react";
import MaterialTable from "material-table";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import theme from "../../pages/theme";
import { addPortfolio, getPortfolio } from "../../lib/api";

//Custom Components
import GenericDialog from "../dialog/GenericDialog";
import StocksSearchBar from "../stocks/StocksSearchBar";

import { data1, data2 } from "./data";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import InputAdornment from "@material-ui/core/InputAdornment";

//Icons
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
  const userId = props.auth.user.id;

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
  const [openAddDlg, setOpenAddDlg] = useState(false);
  const [portfolio, setPortfolio] = useState({
    ticker: null,
    qty: null,
    cost_per_share: null,
  });

  const [refreshTable, setRefreshTable] = useState(false);

  useEffect(() => {
    getPortfolio(userId)
      .then((data) => {
        setData(data);
      })
      .catch((err) => {
        console.log(err.message);
        setData([]);
      });
  }, [refreshTable]);

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
          {rowData.change ? (
            <Fragment>
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
            </Fragment>
          ) : (
            <Grid
              item
              style={{
                color: "black",
              }}
            >
              Data not available
            </Grid>
          )}
        </Grid>
      </Fragment>
    );
  };

  const closeDialog = () => {
    setOpenAddDlg(false);
    setPortfolio({
      ticker: null,
      qty: null,
      cost_per_share: null,
    });
    setRefreshTable(!refreshTable);
  };

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setPortfolio((prevValue) => {
      return {
        ...prevValue,
        [name]: value,
      };
    });
  };

  const addPortfolio = () => {
    //Validate Data
    if (!portfolio.ticker) {
      return { error: "Specify ticker or company" };
    }

    if (!portfolio.qty || parseInt(portfolio.qty, 10) <= 0) {
      return { error: "Specify number of shares." };
    }

    if (
      !portfolio.cost_per_share ||
      parseFloat(portfolio.cost_per_share, 10) <= 0
    ) {
      return { error: "Specify cost of shares." };
    }

    //Call backend to add portfolio
    return addPortfolio(userId, portfolio)
      .then((data) => {
        return { error: null };
      })
      .catch((err) => {
        return { error: err.message };
      });
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
            render: (rowData) =>
              rowData.price ? rowData.price.toFixed(2) : "Data not available",
          },
          {
            title: "Date",
            field: "date",
            render: (rowData) =>
              rowData.date ? rowData.date : "Data not available",
          },
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
            onClick: (event) => setOpenAddDlg(true),
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

      {/* Add Portfolio Dialog */}
      <GenericDialog
        open={openAddDlg}
        btnDlgCancelName="Cancel"
        btnDlgConfirmName="Add"
        dlgTitle="Add Portfolio"
        confirmCallback={addPortfolio}
        onDlgCloseCallback={closeDialog}
      >
        <Grid
          container
          direction="column"
          justify="space-between"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item>
            <StocksSearchBar
              onSelectCallback={(option) =>
                setPortfolio((prevValue) => {
                  return {
                    ...prevValue,
                    ticker: option.ticker,
                  };
                })
              }
              maxWidth="inherit"
            />
          </Grid>
          <Grid item>
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="center"
              spacing={2}
            >
              <Grid item>
                <TextField
                  style={{ width: 250 }}
                  variant="outlined"
                  size="small"
                  label="Number of shares"
                  name="qty"
                  onChange={handleChange}
                  value={portfolio.qty}
                  autoComplete="off"
                />
              </Grid>
              <Grid item>
                <TextField
                  style={{ width: 250 }}
                  variant="outlined"
                  size="small"
                  label="Cost per share"
                  name="cost_per_share"
                  onChange={handleChange}
                  value={portfolio.cost_per_share}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                  autoComplete="off"
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </GenericDialog>
    </div>
  );
};

export default PortfolioTable;
