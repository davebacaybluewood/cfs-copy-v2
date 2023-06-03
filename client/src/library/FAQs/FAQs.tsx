import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import React from "react";
import { FaAngleDown } from "react-icons/fa";
import { FAQstype } from "./FAQsModel";
import "./FAQs.scss";

interface FAQsProps {
  title: string;
  description?: string;
  faqs: FAQstype[];
}
const FAQs: React.FC<FAQsProps> = (props) => {
  return (
    <div className="faqs">
      <Container>
        <div className="section__title">
          <h3>{props.title}</h3>
          <p>{props.description}</p>
        </div>
        <Grid container spacing={2}>
          {props.faqs.map((faq) => {
            return (
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <Accordion key={faq.id} className="accordion__container">
                  <AccordionSummary
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    expandIcon={<FaAngleDown />}
                  >
                    <Typography variant="h4" className="faq__title">
                      {faq.title}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography className="faq__description" variant="h5">
                      {faq.description}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </div>
  );
};

export default FAQs;
