import { authInitialProps } from "../../lib/auth";
import { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

//Custom components
import NavDrawer from "../../components/navigation/NavDrawer";
import StockDetailsHeading from "../../components/stock_details/StockDetailsHeading";
import MarketPerformance from "../../components/stock_details/MarketPerformance";
import CompanyProfile from "../../components/stock_details/CompanyProfile";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  paper: {
    marginRight: theme.spacing(2),
  },
}));

const data = {
  ticker: "AAPL",
  exchangeShort: "NYSE", //server resource
  lastUpdate: "July 29, 2020", //Watchlist object
  sector: "Technology", //BasicCompanyCard
  company_name: "Apple Inc.", //BasicCompanyCard
  coverImageUrl:
    "https://g.foolcdn.com/image/?url=https%3A//g.foolcdn.com/editorial/images/578202/gettyimages-462756183.jpg&w=2000&op=resize", //BasicCompanyCard
  market_cap: "1.606T", //Unibit Financial Summary
  PriceReturnDaily_5D: -1.58476, //Finnhub Basic Financial Price Metric
  PriceReturnDaily_13W: 24.83964, //Finnhub Basic Financial Price Metric
  PriceReturnDaily_26W: 61.62685, //Finnhub Basic Financial Price Metric
  PriceReturnDaily_52W: 52.44095, //Finnhub Basic Financial Price Metric
  PriceReturnDaily_YTD: 62.8339, //Finnhub Basic Financial Price Metric
  //Unibit Company Profile
  address: "One Apple Park Way, Cupertino, CA 95014, United States",
  phone: "408-996-1010",
  website: "http://www.apple.com",
  employee_number: "100,000",
  company_description:
    "Apple Inc. designs, manufactures, and markets mobile communication and media devices, and personal computers. It also sells various related software, services, accessories, and third-party digital content and applications. The company offers iPhone, a line of smartphones; iPad, a line of multi-purpose tablets; and Mac, a line of desktop and portable personal computers, as well as iOS, macOS, watchOS, and tvOS operating systems. It also provides iTunes Store, an app store that allows customers to purchase and download, or stream music and TV shows; rent or purchase movies; and download free podcasts, as well as iCloud, a cloud service, which stores music, photos, contacts, calendars, mail, documents, and others. In addition, the company offers AppleCare support services; Apple Pay, a cashless payment service; Apple TV that connects to consumers' TVs and enables them to access digital content directly for streaming video, playing music and games, and viewing photos; and Apple Watch, a personal electronic device, as well as AirPods, Beats products, HomePod, iPod touch, and other Apple-branded and third-party accessories. The company serves consumers, and small and mid-sized businesses; and education, enterprise, and government customers worldwide. It sells and delivers digital content and applications through the iTunes Store, App Store, Mac App Store, TV App Store, Book Store, and Apple Music. The company also sells its products through its retail and online stores, and direct sales force; and third-party cellular network carriers, wholesalers, retailers, and resellers. Apple Inc. was founded in 1977 and is headquartered in Cupertino, California.", //BasicCompanyCard
};

const CompanyDetails = (props) => {
  const classes = useStyles();
  const ticker = props.ticker;

  useEffect(() => {
    if (ticker) {
      console.log(ticker);
    }
  }, []);

  return (
    <div>
      <NavDrawer {...props}>
        <StockDetailsHeading data={data} />
        <MarketPerformance data={data} />
        <CompanyProfile data={data} />
      </NavDrawer>
    </div>
  );
};

CompanyDetails.getInitialProps = authInitialProps(true);
export default CompanyDetails;
