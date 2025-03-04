import React from "react";
import { Container } from "@mui/system";
import { Typography, Grid } from "@mui/material";

import "./HelpSection.scss";

const HelpSection: React.FC = () => {
  return (
    <div className="help-section">
      <Container>
        <div className="content__container">
          <Grid container spacing={3} justifyContent="center">
            <Grid item sm={12} md={4} lg={4}>
              <div className="section__three-content">
                <img
                  src="/assets/images/home/inquiry-image1.png"
                  alt="/assets/images/home/inquiry-image1.png"
                />
                <Typography variant="h4">Insurance</Typography>
                <p>
                  CFS insures individuals <br /> and families
                </p>
              </div>
            </Grid>
            <Grid item sm={12} md={4} lg={4}>
              <div className="section__three-content ">
                <img
                  src="/assets/images/home/inquiry-image2.png"
                  alt="/assets/images/home/inquiry-image2.png"
                />
                <Typography variant="h4">Risk Management</Typography>
                <p>
                  CFS ensure coverage during <br /> challenging circumstances
                </p>
              </div>
            </Grid>
            <Grid item sm={12} md={4} lg={4}>
              <div className="section__three-content">
                <img
                  src="assets/images/home/inquiry-image3.png"
                  alt="assets/images/home/inquiry-image3.png"
                />
                <Typography variant="h4">Consultation</Typography>
                <p>
                  CFS agents are ready to find <br /> the perfect solution
                </p>
              </div>
            </Grid>
          </Grid>
        </div>
      </Container>
    </div>
  );
};

export default HelpSection;
