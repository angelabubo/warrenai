import React, { useState, useEffect, forwardRef, Fragment } from "react";
import MaterialTable from "material-table";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import theme from "../../pages/theme";
import { getCompaniesBySectorFromServer } from "../../lib/api";
import { sectors } from "../../data/sectors";

//Custom Components
import GenericDialog from "../dialog/GenericDialog";
import SubscriptionRequired from "../../components/SubscriptionRequired";

import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import InputAdornment from "@material-ui/core/InputAdornment";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

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

import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles({
  root: {
    padding: 25,
  },
  title: {
    letterSpacing: "2px",
  },
});

const ComboBox = ({ options, comboboxOnChange, disabled }) => {
  const onChange = (event, value, reason) => {
    if (value && reason && reason === "select-option" && comboboxOnChange) {
      comboboxOnChange(value);
    }
  };

  const onComboChange = (event, value, reason) => {
    if (reason && reason === "clear") {
      comboboxOnChange();
    }
  };
  return (
    <Autocomplete
      disabled={disabled}
      id="combo-sectors"
      options={options}
      style={{ width: 330 }}
      renderInput={(params) => (
        <TextField {...params} label="Select Sector" variant="outlined" />
      )}
      selectOnFocus
      // clearOnBlur
      handleHomeEndKeys
      size={"small"}
      clearOnEscape={true}
      noOptionsText="No data available"
      onChange={onChange}
      onInputChange={onComboChange}
    />
  );
};

const NotAvailable = () => {
  return (
    <Fragment>
      <Typography
        variant="caption"
        style={{
          color: "black",
        }}
      >
        Not Available
      </Typography>
    </Fragment>
  );
};

const RankBySectorTable = (props) => {
  const classes = useStyles();
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
  const [dataFromServer, setDataFromServer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [ticker, setTicker] = useState("");
  const [refreshTable, setRefreshTable] = useState(false);

  useEffect(() => {
    setLoading(true);
    getCompaniesBySectorFromServer(userId)
      .then((data) => {
        setLoading(false);
        setData(data);
        setDataFromServer(data);
      })
      .catch((err) => {
        console.log(err.message);
        setLoading(false);
        setData([]);
        setDataFromServer([]);
      });
  }, []);

  const onSectorSelect = (sector) => {
    if (sector) {
      //Filter data to selected sector
      const filteredData = dataFromServer
        ? dataFromServer.filter((element) => element.sector === sector)
        : [];
      setData(filteredData);
    } else {
      //Display all data from server
      setData(dataFromServer ? dataFromServer : []);
    }
  };

  const renderEarningYield = (rowData) => {
    const ey = rowData.earnings_yield ? rowData.earnings_yield : null;
    const isNegative = ey && Math.sign(ey) === -1 ? true : false;
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
          {ey ? (
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
              <Grid item>{`${ey.toFixed(2)}%`}</Grid>
            </Fragment>
          ) : (
            <Grid item>
              <NotAvailable />
            </Grid>
          )}
        </Grid>
      </Fragment>
    );
  };

  return (
    <div style={{ maxWidth: "100%" }}>
      {/* <MuiThemeProvider theme={theme}> */}
      <Paper
        variant="outlined"
        classes={{
          root: classes.root,
          outlined: classes.outlined,
        }}
        elevation={5}
      >
        <Typography
          align="left"
          gutterBottom
          variant="h4"
          className={classes.title}
        >
          Rank Companies by Sector
        </Typography>
        <Grid
          container
          direction="row"
          justify="flex-start"
          alignItems="flex-start"
          spacing={3}
          style={{ paddingBottom: 24 }}
          wrap="nowrap"
        >
          <Grid item>
            <Typography
              align="left"
              gutterBottom
              variant="body1"
              color="textSecondary"
              component="h1"
              align="justify"
            >
              Companies in this shortlist have an altered WarrenAi rating. The
              rating in this scanner is calculated based on using the industry
              averages as the threshold for each screened fundamental. Select a
              sector using the menu to further narrowdown the shortlist.
            </Typography>
          </Grid>

          <Grid item>
            <ComboBox
              disabled={loading}
              options={sectors}
              comboboxOnChange={onSectorSelect}
            />
          </Grid>
        </Grid>

        <MaterialTable
          title="Company Financials"
          icons={tableIcons}
          columns={[
            { title: "Ticker", field: "ticker" },
            { title: "Company", field: "company_name" },
            { title: "Sector", field: "sector" },
            { title: "PE Ratio", field: "pe_ratio" },
            {
              title: "Stock Price",
              field: "price",
              render: (rowData) =>
                (rowData.price && "$" + rowData.price) || <NotAvailable />,
            },
            {
              title: "Earnings Yield",
              field: "earnings_yield",
              render: renderEarningYield,
            },
            {
              title: "Dividend Yield(TTM)",
              field: "dividendYieldTTM",
              render: (rowData) =>
                (rowData.dividendYieldTTM &&
                  rowData.dividendYieldTTM.toFixed(2) + "%") || (
                  <NotAvailable />
                ),
            },
            {
              title: "Dividend Yield(5Y)",
              field: "dividendYield5Y",
              render: (rowData) =>
                (rowData.dividendYield5Y &&
                  rowData.dividendYield5Y.toFixed(2) + "%") || <NotAvailable />,
            },
          ]}
          data={data}
          onRowClick={(evt, selectedRow) =>
            setSelectedRow(selectedRow.tableData.id)
          }
          options={{
            exportButton: true,
            headerStyle: {
              fontWeight: "bold",
              backgroundColor: "#83AEC3",
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
              ) : dataFromServer ? (
                <label
                  style={{
                    textAlign: "center",
                  }}
                >
                  No records to display
                </label>
              ) : (
                <SubscriptionRequired feature="view WarrenAi ranked companies" />
              ),
            },
          }}
        />
      </Paper>
      {/* </MuiThemeProvider> */}
    </div>
  );
};

export default RankBySectorTable;
