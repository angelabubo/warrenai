import { authInitialProps } from "../../lib/auth";
import NavDrawer from "../../components/navigation/NavDrawer";

import { getWarrenAiTopCompaniesFromServer } from "../../lib/api";
import { useEffect, useState } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";

import React, { Fragment } from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import CompanyCard from "../../components/stocks/CompanyCard";

const dataTickerCard = [
  {
    ticker: "AAPL",
    //Unibit API - Company Profle
    company_name: "Apple Inc.",
    website: "https://www.apple.com",
    sector: "Technology",
    company_description:
      "Apple Inc. designs, manufactures, and markets mobile communication and media devices, and personal computers. It also sells various related software, services, accessories, and third-party digital content and applications. The company offers iPhone, a line of smartphones; iPad, a line of multi-purpose tablets; and Mac, a line of desktop and portable personal computers, as well as iOS, macOS, watchOS, and tvOS operating systems. It also provides iTunes Store, an app store that allows customers to purchase and download, or stream music and TV shows; rent or purchase movies; and download free podcasts, as well as iCloud, a cloud service, which stores music, photos, contacts, calendars, mail, documents, and others. In addition, the company offers AppleCare support services; Apple Pay, a cashless payment service; Apple TV that connects to consumers' TVs and enables them to access digital content directly for streaming video, playing music and games, and viewing photos; and Apple Watch, a personal electronic device, as well as AirPods, Beats products, HomePod, iPod touch, and other Apple-branded and third-party accessories. The company serves consumers, and small and mid-sized businesses; and education, enterprise, and government customers worldwide. It sells and delivers digital content and applications through the iTunes Store, App Store, Mac App Store, TV App Store, Book Store, and Apple Music. The company also sells its products through its retail and online stores, and direct sales force; and third-party cellular network carriers, wholesalers, retailers, and resellers. Apple Inc. was founded in 1977 and is headquartered in Cupertino, California.",
    //stocks_us
    exchangeShort: "NYSE",
    //coverImage array
    coverImageUrl:
      "https://www.tradingpedia.com/wp-content/uploads/2017/02/Apple-Logo.jpg",
  },
  {
    ticker: "MSFT",
    //Unibit API - Company Profle
    company_name: "Microsoft Inc.",
    website: "https://www.microsoft.com",
    sector: "Technology",
    company_description:
      "Microsoft. designs, manufactures, and markets mobile communication and media devices, and personal computers. It also sells various related software, services, accessories, and third-party digital content and applications. The company offers iPhone, a line of smartphones; iPad, a line of multi-purpose tablets; and Mac, a line of desktop and portable personal computers, as well as iOS, macOS, watchOS, and tvOS operating systems. It also provides iTunes Store, an app store that allows customers to purchase and download, or stream music and TV shows; rent or purchase movies; and download free podcasts, as well as iCloud, a cloud service, which stores music, photos, contacts, calendars, mail, documents, and others. In addition, the company offers AppleCare support services; Apple Pay, a cashless payment service; Apple TV that connects to consumers' TVs and enables them to access digital content directly for streaming video, playing music and games, and viewing photos; and Apple Watch, a personal electronic device, as well as AirPods, Beats products, HomePod, iPod touch, and other Apple-branded and third-party accessories. The company serves consumers, and small and mid-sized businesses; and education, enterprise, and government customers worldwide. It sells and delivers digital content and applications through the iTunes Store, App Store, Mac App Store, TV App Store, Book Store, and Apple Music. The company also sells its products through its retail and online stores, and direct sales force; and third-party cellular network carriers, wholesalers, retailers, and resellers. Apple Inc. was founded in 1977 and is headquartered in Cupertino, California.",
    //stocks_us
    exchangeShort: "NYSE",
    //coverImage array
    coverImageUrl:
      "data:image/jpeg;base64,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",
  },
  {
    ticker: "AAPL",
    //Unibit API - Company Profle
    company_name: "Apple Inc.",
    website: "https://www.apple.com",
    sector: "Technology",
    company_description:
      "Apple Inc. designs, manufactures, and markets mobile communication and media devices, and personal computers. It also sells various related software, services, accessories, and third-party digital content and applications. The company offers iPhone, a line of smartphones; iPad, a line of multi-purpose tablets; and Mac, a line of desktop and portable personal computers, as well as iOS, macOS, watchOS, and tvOS operating systems. It also provides iTunes Store, an app store that allows customers to purchase and download, or stream music and TV shows; rent or purchase movies; and download free podcasts, as well as iCloud, a cloud service, which stores music, photos, contacts, calendars, mail, documents, and others. In addition, the company offers AppleCare support services; Apple Pay, a cashless payment service; Apple TV that connects to consumers' TVs and enables them to access digital content directly for streaming video, playing music and games, and viewing photos; and Apple Watch, a personal electronic device, as well as AirPods, Beats products, HomePod, iPod touch, and other Apple-branded and third-party accessories. The company serves consumers, and small and mid-sized businesses; and education, enterprise, and government customers worldwide. It sells and delivers digital content and applications through the iTunes Store, App Store, Mac App Store, TV App Store, Book Store, and Apple Music. The company also sells its products through its retail and online stores, and direct sales force; and third-party cellular network carriers, wholesalers, retailers, and resellers. Apple Inc. was founded in 1977 and is headquartered in Cupertino, California.",
    //stocks_us
    exchangeShort: "NYSE",
    //coverImage array
    coverImageUrl:
      "https://www.tradingpedia.com/wp-content/uploads/2017/02/Apple-Logo.jpg",
  },
];

const useStyles = makeStyles({
  root: {
    padding: 25,
  },
  fonstyle: {
    letterSpacing: "2px",
  },
  grid: {
    paddingTop: 20,
  },
});

const WarrenAITopCo = (props) => {
  const classes = useStyles();
  const { auth } = props;
  const [topCoList, setTopCoList] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getWarrenAiTopCompaniesFromServer(auth.user.id).then((data) => {
      //setTopCoList(data);
      setTopCoList(dataTickerCard);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <NavDrawer {...props}>
        <Fragment>
          <Paper variant="outlined" className={classes.root} elevation={5}>
            <Typography
              align="left"
              gutterBottom
              variant="h4"
              className={classes.fonstyle}
            >
              WarrenAi Top Companies
            </Typography>
            <Typography
              align="left"
              gutterBottom
              variant="body1"
              color="textSecondary"
              component="h1"
            >
              This is a shortlist of companies WarrenAi detected as viable
              long-term investments. This list is updated daily.
            </Typography>
            <Grid
              container
              direction="row"
              justify="space-evenly"
              alignItems="flex-start"
              spacing={3}
              className={classes.grid}
            >
              {loading ? (
                <Grid item>
                  <CircularProgress size={70} style={{ color: "#26303e" }} />
                </Grid>
              ) : topCoList ? (
                topCoList.map((element, index) => {
                  return (
                    <Grid key={`warrenaitop-item${index}`} item>
                      <CompanyCard
                        key={`warrenaitop-tickerCard${index}`}
                        data={element}
                      />
                    </Grid>
                  );
                })
              ) : (
                <h1>
                  You must be subscribed to WarrenAi Premium to view WarrenAi
                  Top Companies.
                </h1>
              )}
            </Grid>
          </Paper>
        </Fragment>
      </NavDrawer>
    </div>
  );
};

WarrenAITopCo.getInitialProps = authInitialProps(true);
export default WarrenAITopCo;
