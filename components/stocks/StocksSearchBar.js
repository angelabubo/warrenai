import React, { Fragment } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";

import { us_stock_symbols } from "../../data/stocks_us";

const StocksSearchBar = (props) => {
  const onChange = (event, value, reason) => {
    if (value && reason && reason === "select-option") {
      console.log(value);
    }
  };

  return (
    <Fragment>
      <Autocomplete
        style={{ maxWidth: 350, minWidth: 300 }}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        fullWidth={true}
        size={"small"}
        freeSolo={false}
        clearOnEscape={true}
        loadingText="Loading stock symbols..."
        noOptionsText="Ticker/company not supported"
        id="free-solo-2-demo"
        forcePopupIcon={false}
        options={us_stock_symbols}
        renderOption={(option) => `${option.ticker}:${option.companyName}`}
        getOptionLabel={(option) => {
          // Value selected with enter, right from the input
          if (typeof option === "string") {
            return option;
          }
          // Regular option
          return `${option.ticker}:${option.companyName}`;
        }}
        onChange={onChange}
        renderInput={(params) => (
          <TextField
            style={{ maxWidth: 300 }}
            {...params}
            label="Search Ticker or Company"
            margin="normal"
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />
        )}
      />
    </Fragment>
  );
};

export default StocksSearchBar;
