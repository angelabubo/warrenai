import React from "react";
import Slider from "infinite-react-carousel";
import Slide from "./Slide";

import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

const useStyles = makeStyles({
  colorPrimary: {
    color: "white",
  },
});

const CustomArrow = (props) => {
  const classes = useStyles();
  const { className, onClick, left, right } = props;
  return (
    <div className={className}>
      <IconButton
        onClick={onClick}
        classes={{
          colorPrimary: classes.colorPrimary, // class name, e.g. `classes-nesting-root-x`
        }}
        color="primary"
      >
        {left && <ChevronLeftIcon fontSize="large" />}
        {right && <ChevronRightIcon fontSize="large" />}
      </IconButton>
    </div>
  );
};

const CustomSlider = (props) => {
  const data = props.data;
  const settings = {
    // autoplay: true,
    prevArrow: <CustomArrow left />,
    nextArrow: <CustomArrow right />,
    initialSlide: 0,
  };

  return (
    <div>
      <Slider {...settings}>
        {data &&
          data.map((element) => {
            return <Slide data={element} />;
          })}
      </Slider>
    </div>
  );
};

export default CustomSlider;
