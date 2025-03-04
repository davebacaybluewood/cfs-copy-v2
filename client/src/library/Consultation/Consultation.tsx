import { Container, Grid, Typography } from "@mui/material";
import Button from "library/Button/Button";
import React, { useState } from "react";
import { CALENDLY } from "constants/constants";
import { PopupModal } from "react-calendly";
import "./Consultation.scss";

interface ConsultationProps {
  title: string;
  description1: string | JSX.Element;
  description2: string | JSX.Element;
  image: string;
  button: {
    text: string;
    onClick?: () => void;
  };
}
const Consultation: React.FC<ConsultationProps> = (props) => {
  const [openCalendlyModal, setOpenCalendlyModal] = useState(false);

  return (
    <div className="consultation">
      <Container className="section-five__content">
        <Grid container spacing={5} alignItems={"center"}>
          <Grid item xs={12} sm={12} md={6} lg={6} className="text__content">
            <div className="section__title">
              <Typography variant="h3">{props.title}</Typography>
            </div>
            <div className="section__text__content">
              <Typography>{props.description1}</Typography>
            </div>
            <div className="section__text__content">
              <Typography>{props.description2}</Typography>
            </div>

            <div className="section__btn">
              <Button
                variant="danger"
                onClick={() => setOpenCalendlyModal(true)}
              >
                {props.button.text}
              </Button>
            </div>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} className="section__image">
            <img src={props.image} alt={props.image} />
          </Grid>
        </Grid>
      </Container>
      <PopupModal
        url={CALENDLY.CONSULTATION}
        onModalClose={() => setOpenCalendlyModal(false)}
        open={openCalendlyModal}
        rootElement={document.getElementById("root") as any}
      />
    </div>
  );
};

export default Consultation;
