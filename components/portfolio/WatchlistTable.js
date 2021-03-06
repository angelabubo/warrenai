import React, { useState, useEffect, forwardRef, Fragment } from "react";
import MaterialTable from "material-table";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import theme from "../theme";
import { deleteWatchlist, addWatchlist, getWatchlist } from "../../lib/api";
import Link from "next/link";

import { dataWatchlist } from "./data";
//Custom Components
import GenericDialog from "../dialog/GenericDialog";
import StocksSearchBar from "../stocks/StocksSearchBar";

import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import InputAdornment from "@material-ui/core/InputAdornment";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";

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

const WatchlistTable = (props) => {
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
  const [loading, setLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [openAddDlg, setOpenAddDlg] = useState(false);
  const [ticker, setTicker] = useState("");

  const [refreshTable, setRefreshTable] = useState(false);

  const [openDelDlg, setOpenDelDlg] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);

  useEffect(() => {
    setLoading(true);
    getWatchlist(userId)
      .then((data) => {
        setLoading(false);
        setData(data);
      })
      .catch((err) => {
        console.log(err.message);
        setLoading(false);
        setData([]);
      });
    //setData(dataWatchlist);
  }, [refreshTable]);

  const renderChange = (rowData) => {
    const change = rowData.change ? rowData.change : null;
    const isNegative = change && Math.sign(change) === -1 ? true : false;
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
          {change ? (
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
              <Grid item>{`${change}`}</Grid>
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
    setOpenDelDlg(false);
    setRowToDelete(null);
    setTicker("");
    setRefreshTable(!refreshTable);
  };

  const addNewWatchlist = () => {
    //Validate Data
    if (!ticker) {
      return { error: "Specify ticker or company" };
    }
    //Call backend to add watchlist
    return addWatchlist(userId, ticker)
      .then((data) => {
        return { error: null };
      })
      .catch((err) => {
        if (err.response) {
          // client received an error response (5xx, 4xx)
          return { error: err.response.data };
        } else {
          return { error: err.message };
        }
      });
  };

  const deleteSelectedTicker = () => {
    //Call backend to delete portfolio
    return deleteWatchlist(userId, rowToDelete.ticker)
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
        title="My Watchlist"
        icons={tableIcons}
        columns={[
          {
            title: "Ticker",
            field: "ticker",
            render: (rowData) => {
              return (
                <Link href={`/company/details/${rowData.ticker}`}>
                  <a style={{ color: "inherit" }}>{rowData.ticker}</a>
                </Link>
              );
            },
          },
          {
            title: "Open",
            field: "open",
            render: (rowData) =>
              (rowData.open && rowData.open.toFixed(2)) || null,
          },
          {
            title: "High",
            field: "high",
            render: (rowData) =>
              (rowData.high && rowData.high.toFixed(2)) || null,
          },
          {
            title: "Low",
            field: "low",
            render: (rowData) =>
              (rowData.low && rowData.low.toFixed(2)) || null,
          },
          {
            title: "Close",
            field: "close",
            render: (rowData) =>
              (rowData.close && rowData.close.toFixed(2)) || null,
          },
          { title: "Volume", field: "volume" },
          { title: "Change", field: "change", render: renderChange },
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
            onClick: (event, rowData) => {
              setOpenDelDlg(true);
              setRowToDelete(rowData);
            },
          },
          {
            icon: tableIcons.Add,
            tooltip: "Add to Watchlist",
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
        localization={{
          body: {
            emptyDataSourceMessage: loading ? (
              <CircularProgress size={70} style={{ color: "#26303e" }} />
            ) : (
              <label
                style={{
                  textAlign: "center",
                }}
              >
                No records to display
              </label>
            ),
          },
        }}
      />
      {/* </MuiThemeProvider> */}

      {/* Add Watchlist Dialog */}
      <GenericDialog
        open={openAddDlg}
        btnDlgCancelName="Cancel"
        btnDlgConfirmName="Add"
        dlgTitle="Add Watchlist"
        confirmCallback={addNewWatchlist}
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
              onSelectCallback={(option) => setTicker(option.ticker)}
              maxWidth="inherit"
            />
          </Grid>
        </Grid>
      </GenericDialog>

      {/* Delete Watchlist Dialog */}
      <GenericDialog
        open={openDelDlg}
        btnDlgCancelName="Cancel"
        btnDlgConfirmName="Delete"
        dlgTitle="Delete from Watchlist"
        confirmCallback={deleteSelectedTicker}
        onDlgCloseCallback={closeDialog}
      >
        <Grid
          container
          direction="column"
          justify="flex-start"
          alignItems="stretch"
        >
          <Grid item>
            <Typography gutterBottom align="left">
              Are you sure you want to delete this ticker from your watchlist?
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h4" align="center">
              {rowToDelete && rowToDelete.ticker}
            </Typography>
          </Grid>
        </Grid>
      </GenericDialog>
    </div>
  );
};

export default WatchlistTable;
