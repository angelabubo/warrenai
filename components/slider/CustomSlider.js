import React from "react";
import Carousel from "react-material-ui-carousel";
import Slide from "./Slide";

const CustomSlider = (props) => {
  const data = props.data;
  const settings = {
    navButtonsAlwaysVisible: true,
    autoPlay: true,
    timeout: 500,
  };

  return (
    <div>
      <Carousel {...settings}>
        {data ? (
          data.map((element, index) => {
            return <Slide key={index} data={element} />;
          })
        ) : (
          <Slide key={0} data={data} />
        )}
      </Carousel>
    </div>
  );
};

export default CustomSlider;
