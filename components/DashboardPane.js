import { Container } from "@material-ui/core";
import React from "react";

export default function DashboardPane(props) {
  return (
    <Container>
      <h1>{props.message}</h1>
    </Container>
  );
}
