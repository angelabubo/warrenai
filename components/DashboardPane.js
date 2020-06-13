import { Container } from "@material-ui/core";

export default function DashboardPane(props) {
  return (
    <Container>
      <h1>{props.message}</h1>
    </Container>
  );
}
