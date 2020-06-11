import NavBar from "../components/NavBar";
import { authInitialProps } from "../lib/auth";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Typography } from "@material-ui/core";
import { Fragment } from "react";
const useStyles = makeStyles((theme) => ({
  title: {
    backgroundColor: "#26303e",
    color: "#fff",
    marginBottom: "5rem",
  },
  content: {
    margin: "5rem",
  },
  about: {
    color: "#26303e",
    marginBottom: "5rem",
  },
}));

const Index = (props) => {
  const classes = useStyles();
  return (
    <Fragment>
      {/* Title */}
      <Container maxWidth={false} className={classes.title}>
        <NavBar {...props} />
        <Typography className={classes.content}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
          consectetur ante quam, sit amet commodo nisi porta non. Etiam non
          velit iaculis lectus egestas pellentesque sit amet eget ante. Donec
          faucibus feugiat erat, a facilisis nibh consequat eu. Curabitur magna
          erat, hendrerit quis placerat vitae, iaculis nec mi. Donec enim urna,
          ultrices ac facilisis eu, gravida sit amet neque. Donec consequat
          lectus sit amet ipsum tincidunt tempus. Aliquam rhoncus lorem ut
          posuere finibus. Vivamus vitae ante libero. Etiam pellentesque
          eleifend condimentum. Donec dignissim arcu in nunc tempus laoreet.
          Duis in eleifend nunc. Donec non sollicitudin velit, quis faucibus
          dolor. Vivamus non lectus id arcu dictum pretium. Sed vitae dolor id
          tellus tempor dignissim ut id orci. Pellentesque pellentesque suscipit
          finibus. Sed ex erat, elementum in elementum vitae, ultrices id
          ligula. Aliquam at ante pharetra, posuere urna at, vestibulum dui.
          Vivamus condimentum nunc dui, non condimentum justo scelerisque in.
          Nam est orci, dictum a ipsum non, molestie pellentesque nulla.
          Suspendisse justo tortor, egestas ac leo et, cursus accumsan est.
          Nullam lacus urna, accumsan et blandit sed, maximus vel ipsum. Duis
          convallis arcu ac leo ullamcorper consequat. Phasellus at purus
          finibus, porttitor turpis id, luctus magna. Nunc id semper felis,
          vitae posuere nibh. Lorem ipsum dolor sit amet, consectetur adipiscing
          elit. Nulla convallis accumsan risus, ut tempus odio mollis sed.
          Suspendisse ut suscipit ante. Vivamus porta leo eros, ut sagittis mi
          consectetur eu.
        </Typography>
      </Container>
      {/* About */}
      <Container maxWidth={false} className={classes.about}>
        <Typography className={classes.content}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
          consectetur ante quam, sit amet commodo nisi porta non. Etiam non
          velit iaculis lectus egestas pellentesque sit amet eget ante. Donec
          faucibus feugiat erat, a facilisis nibh consequat eu. Curabitur magna
          erat, hendrerit quis placerat vitae, iaculis nec mi. Donec enim urna,
          ultrices ac facilisis eu, gravida sit amet neque. Donec consequat
          lectus sit amet ipsum tincidunt tempus. Aliquam rhoncus lorem ut
          posuere finibus. Vivamus vitae ante libero. Etiam pellentesque
          eleifend condimentum. Donec dignissim arcu in nunc tempus laoreet.
          Duis in eleifend nunc. Donec non sollicitudin velit, quis faucibus
          dolor. Vivamus non lectus id arcu dictum pretium. Sed vitae dolor id
          tellus tempor dignissim ut id orci. Pellentesque pellentesque suscipit
          finibus. Sed ex erat, elementum in elementum vitae, ultrices id
          ligula. Aliquam at ante pharetra, posuere urna at, vestibulum dui.
          Vivamus condimentum nunc dui, non condimentum justo scelerisque in.
          Nam est orci, dictum a ipsum non, molestie pellentesque nulla.
          Suspendisse justo tortor, egestas ac leo et, cursus accumsan est.
          Nullam lacus urna, accumsan et blandit sed, maximus vel ipsum. Duis
          convallis arcu ac leo ullamcorper consequat. Phasellus at purus
          finibus, porttitor turpis id, luctus magna. Nunc id semper felis,
          vitae posuere nibh. Lorem ipsum dolor sit amet, consectetur adipiscing
          elit. Nulla convallis accumsan risus, ut tempus odio mollis sed.
          Suspendisse ut suscipit ante. Vivamus porta leo eros, ut sagittis mi
          consectetur eu.
        </Typography>
      </Container>
    </Fragment>
  );
};

Index.getInitialProps = authInitialProps(true);
export default Index;

// import LoginForm from "../components/LoginForm";

// const signin = () => {
//   return <LoginForm />;
// };

// export default signin;
