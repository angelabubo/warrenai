import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";

import BusinessIcon from "@material-ui/icons/Business";
import PhoneIcon from "@material-ui/icons/Phone";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import LanguageIcon from "@material-ui/icons/Language";

const useStyles = makeStyles({
  root: {
    padding: 25,
    backgroundColor: "#386480",
    letterSpacing: "2px",
    color: "#fff",
  },
  logo: {
    width: 200,
  },
  divider: {
    backgroundColor: "#fff",
    marginTop: 25,
    marginBottom: 25,
  },
});

const CompanyDetail = ({ CustomIcon, Detail }) => {
  return (
    <Fragment>
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="center"
        spacing={1}
      >
        <Grid item style={{ color: "#fff" }}>
          <CustomIcon />
        </Grid>
        <Grid item>
          <Typography align="left" variant="h6" component="h2">
            {<Detail />}
          </Typography>
        </Grid>
      </Grid>
    </Fragment>
  );
};

const CompanyProfile = ({ data }) => {
  const classes = useStyles();
  const logoSource = data.website
    .replace("http://", "")
    .replace("https://", "")
    .split(/[/?#]/)[0];
  const logoUrl = `https://logo.clearbit.com/${logoSource}`;

  return (
    <Fragment>
      <div className={classes.root}>
        <Grid
          container
          direction="column"
          justify="flex-start"
          alignItems="flex-start"
          spacing={2}
        >
          <Grid item>
            <Typography align="left" variant="h4" component="p" gutterBottom>
              <strong>Company Information</strong>
            </Typography>
          </Grid>

          <Grid item>
            <Grid
              container
              direction="row"
              justify="flex-start"
              alignItems="flex-start"
              wrap="nowrap"
              spacing={3}
            >
              <Grid item>
                <img
                  className={classes.logo}
                  src={logoUrl}
                  alt="Company Logo"
                />
              </Grid>
              <Grid item>
                <Typography
                  align="left"
                  variant="h4"
                  component="p"
                  gutterBottom
                >
                  {data.company_name}
                </Typography>
                <Typography align="justify" variant="subtitle1" component="h2">
                  {data.company_description}
                </Typography>
                <Divider className={classes.divider} />
                <Grid
                  container
                  direction="column"
                  justify="flex-start"
                  alignItems="flex-start"
                  spacing={3}
                >
                  {/* Address */}
                  <Grid item>
                    <CompanyDetail
                      CustomIcon={() => {
                        return <BusinessIcon fontSize="large" />;
                      }}
                      Detail={() => {
                        return <Fragment>{data.address}</Fragment>;
                      }}
                    />
                  </Grid>

                  {/* Phone */}
                  <Grid item>
                    <CompanyDetail
                      CustomIcon={() => {
                        return <PhoneIcon fontSize="large" />;
                      }}
                      Detail={() => {
                        return <Fragment>{data.phone}</Fragment>;
                      }}
                    />
                  </Grid>
                  {/* Website */}
                  <Grid item>
                    <CompanyDetail
                      CustomIcon={() => {
                        return <LanguageIcon fontSize="large" />;
                      }}
                      Detail={() => {
                        return (
                          <Fragment>
                            <a
                              target="_blank"
                              href={data.website}
                              style={{ color: "#fff" }}
                            >
                              {data.website}
                            </a>
                          </Fragment>
                        );
                      }}
                    />
                  </Grid>

                  {/* Employees */}
                  <Grid item>
                    <CompanyDetail
                      CustomIcon={() => {
                        return <SupervisorAccountIcon fontSize="large" />;
                      }}
                      Detail={() => {
                        return (
                          <Fragment>{`${data.employee_number} employees`}</Fragment>
                        );
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </Fragment>
  );
};

export default CompanyProfile;
