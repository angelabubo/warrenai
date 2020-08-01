import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles({
  table: {
    padding: 25,
  },
  headingStyle: {
    color: "#26303e",
    letterSpacing: "1px",
    fontSize: "23px",
    fontWeight: "bold",
  },
  rowStyle: {
    letterSpacing: "1px",
    fontSize: "23px",
  },
});

const createData = (pr5d, pr13w, pr26w, pr52w, prytd) => {
  return { pr5d, pr13w, pr26w, pr52w, prytd };
};

const MarketPerformanceTable = ({ data }) => {
  const classes = useStyles();

  const rows = [
    createData(
      data.PriceReturnDaily_5D,
      data.PriceReturnDaily_13W,
      data.PriceReturnDaily_26W,
      data.PriceReturnDaily_52W,
      data.PriceReturnDaily_YTD
    ),
  ];

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell className={classes.headingStyle}>5 Day</TableCell>
            <TableCell className={classes.headingStyle}>Quarter</TableCell>
            <TableCell className={classes.headingStyle}>Semi-Annual</TableCell>
            <TableCell className={classes.headingStyle}>Annual</TableCell>
            <TableCell className={classes.headingStyle}>YTD</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={`tablerowkey${index}`}>
              <TableCell
                className={classes.rowStyle}
                component="th"
                scope="row"
                style={{
                  color: Math.sign(row.pr5d) === -1 ? "red" : "#26303e",
                }}
              >
                {row.pr5d && row.pr5d.toFixed(2)}
              </TableCell>
              <TableCell
                component="th"
                scope="row"
                className={classes.rowStyle}
                style={{
                  color: Math.sign(row.pr13w) === -1 ? "red" : "#26303e",
                }}
              >
                {row.pr13w && row.pr13w.toFixed(2)}
              </TableCell>
              <TableCell
                component="th"
                scope="row"
                className={classes.rowStyle}
                style={{
                  color: Math.sign(row.pr26w) === -1 ? "red" : "#26303e",
                }}
              >
                {row.pr26w && row.pr26w.toFixed(2)}
              </TableCell>
              <TableCell
                component="th"
                scope="row"
                className={classes.rowStyle}
                style={{
                  color: Math.sign(row.pr52w) === -1 ? "red" : "#26303e",
                }}
              >
                {row.pr52w && row.pr52w.toFixed(2)}
              </TableCell>
              <TableCell
                component="th"
                scope="row"
                className={classes.rowStyle}
                style={{
                  color: Math.sign(row.prytd) === -1 ? "red" : "#26303e",
                }}
              >
                {row.prytd && row.prytd.toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MarketPerformanceTable;
