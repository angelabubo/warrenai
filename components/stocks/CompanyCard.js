import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const MAX_CHAR = 115;

const useStyles = makeStyles({
  root: {
    maxWidth: 280,
    backgroundColor: "#364559",
    color: "#fff",
  },
});

const CompanyCard = ({ data }) => {
  const classes = useStyles();

  return (
    <Card className={classes.root} elevation={5}>
      <CardActionArea>
        <CardMedia
          component="img"
          alt={data.company_name}
          height="140"
          image={data.coverImageUrl}
          title={data.company_name}
        />
        <CardContent>
          <Typography variant="h5" component="h2">
            {data.company_name}
          </Typography>
          <Typography variant="caption" component="h2" gutterBottom paragraph>
            {`${data.exchangeShort} : ${data.ticker}`}
          </Typography>

          <Typography
            variant="body2"
            style={{ color: "#ebecf1" }}
            component="p"
            align="left"
          >
            {data.company_description.length > MAX_CHAR
              ? data.company_description.substring(0, MAX_CHAR) + " ..."
              : data.company_description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button
          target="_blank"
          href={data.website}
          size="small"
          color="secondary"
        >
          Website
        </Button>
        <Button href="/dashboard" size="small" color="secondary">
          Learn More
        </Button>
      </CardActions>
    </Card>
  );
};

export default CompanyCard;
