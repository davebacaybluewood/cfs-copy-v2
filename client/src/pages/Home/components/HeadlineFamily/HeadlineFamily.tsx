import Button from "../../../../library/Button/Button";
import React from "react";
import MovingComponent from "react-moving-text";

import "./HeadlineFamily.scss";
import useScroll from "hooks/useScroll";
import { Typography } from "@mui/material";

const HeadlineFamily: React.FC = () => {
  useScroll();
  return (
    <div className="headline-family">
      <div className="captions">
        <MovingComponent
          type="fadeInFromBottom"
          duration="1000ms"
          delay="0s"
          direction="normal"
          timing="ease"
          iteration="1"
          fillMode="none"
        >
          <Typography variant="h2">
            Financial Comfort, <br /> Now and Tomorrow
          </Typography>
          <div className="headline-home__btn">
            <Button variant="danger">Free Consultation</Button>
            <Button variant="default">Learn More</Button>
          </div>
        </MovingComponent>
      </div>
    </div>
  );
};

export default HeadlineFamily;
