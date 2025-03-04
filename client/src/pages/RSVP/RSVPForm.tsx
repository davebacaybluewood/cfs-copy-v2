import { Container, Grid } from "@mui/material";
import SimpleNavbar from "layout/SimpleNavbar/SimpleNavbar";
import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import FormikTextInput from "library/Formik/FormikInput";
import * as Yup from "yup";
import Button from "library/Button/Button";
import Spinner from "library/Spinner/Spinner";
import "./RSVPForm.scss";
import { FaClock } from "react-icons/fa";
import agent from "api/agent";
import adminAgent from "admin/api/agent";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Event from "admin/models/eventModel";
import { formatISODateOnly } from "helpers/date";
import ErrorText from "pages/PortalRegistration/components/ErrorText";
import { Skeleton } from "@mui/material";
import { paths } from "constants/routes";

const RSVPForm: React.FC = () => {
  const { eventId } = useParams();
  const search = useLocation().search;
  const navigate = useNavigate();
  const recruiterUserGuid = new URLSearchParams(search).get("userGuid");
  const initialValues = {
    emailAddress: "",
    firstName: "",
    lastName: "",
    remarks: "",
    phoneNumber: "",
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required("First name field is required."),
    lastName: Yup.string().required("Last name field is required."),
    emailAddress: Yup.string()
      .email("Invalid email address")
      .required("Email Address field is required."),
    phoneNumber: Yup.string().required("Phone Number field is required."),
  });

  const [loading, setLoading] = useState(false);
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);
  const [event, setEvent] = useState<Event | undefined>();
  const [error, setError] = useState("");
  const [agentInfo, setAgentInfo] = useState<any>({});

  useEffect(() => {
    const getSingleEvent = async () => {
      const res = await adminAgent.Events.getSingleEvent(eventId ?? "");
      setEvent(res);
    };

    getSingleEvent();
  }, [eventId]);

  useEffect(() => {
    const getAgentInfo = async () => {
      const res = await adminAgent.Agents.agentInformation(
        recruiterUserGuid ?? ""
      );

      setAgentInfo(res);
    };

    if (recruiterUserGuid) getAgentInfo();
  }, [recruiterUserGuid]);

  return (
    <div className="rsvp-form-container">
      <SimpleNavbar />

      <Container className="form-main-container">
        <Grid container style={{ height: "100%" }}>
          <Grid sm={12} md={4} lg={4}>
            <div className="form-information">
              <img
                className="cfs-logo"
                src="/assets/images/logos/small-logo.png"
                alt="small-cfs"
              />
              <h5>Comfort Financial Solutions</h5>
              {event ? (
                <React.Fragment>
                  {event?.thumbnail ? (
                    <img src={event?.thumbnail} alt="event-img" />
                  ) : null}
                  <h2>{event?.title}</h2>

                  <ul className="basic-info">
                    <li>
                      <FaClock />
                      <span>{formatISODateOnly(event?.eventDate ?? "")}</span>
                    </li>
                  </ul>

                  <p>{event?.shortDescription}</p>
                </React.Fragment>
              ) : (
                <>
                  <Skeleton
                    variant="rectangular"
                    width={200}
                    height={130}
                    sx={{ marginBottom: "1rem" }}
                  />
                  <Skeleton
                    variant="rectangular"
                    width={150}
                    height={30}
                    sx={{ marginBottom: "1rem" }}
                  />
                  <Skeleton
                    variant="rectangular"
                    width={150}
                    height={25}
                    sx={{ marginBottom: "1rem" }}
                  />
                  <Skeleton
                    variant="rectangular"
                    width={150}
                    height={25}
                    sx={{ marginBottom: "1rem" }}
                  />
                </>
              )}
            </div>
          </Grid>
          <Grid sm={12} md={4} lg={6}>
            <div
              className={`user-form ${
                isDataSubmitted ? "success-stage rsvp" : ""
              }`}
            >
              <React.Fragment>
                <h2>Enter Details</h2>

                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={async (data) => {
                    setLoading(true);
                    const req: any = await agent.RSVP.submitRSVP(
                      data.firstName,
                      data.lastName,
                      data.emailAddress,
                      data.phoneNumber,
                      data.remarks,
                      eventId ?? "",
                      recruiterUserGuid || ""
                    );

                    if (req.status == "error") {
                      setError(req.message);
                    } else {
                      const successPgUrl = `${paths.regSuccessPage
                        .replace(":regSrc", "bop_rsvp")
                        .replace(":userGuid", recruiterUserGuid ?? "")}`;

                      navigate(successPgUrl);
                    }

                    setLoading(false);
                  }}
                >
                  {({ values, handleSubmit }) => {
                    return (
                      <React.Fragment>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={12} md={6} lg={6}>
                            <div className="form-control">
                              <h5>First Name (Required)</h5>
                              <FormikTextInput
                                name="firstName"
                                placeholder="Enter your first name here"
                                value={values.firstName}
                                variant="outlined"
                              />
                            </div>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            sm={12}
                            md={6}
                            lg={6}
                            paddingTop={0}
                          >
                            <div className="form-control">
                              <h5>Last Name (Required)</h5>
                              <FormikTextInput
                                name="lastName"
                                placeholder="Enter your last name here"
                                value={values.lastName}
                                variant="outlined"
                              />
                            </div>
                          </Grid>
                          <Grid item xs={12} sm={12} lg={12} paddingTop={0}>
                            <div className="form-control">
                              <h5>Email Address (Required)</h5>
                              <FormikTextInput
                                name="emailAddress"
                                placeholder="Enter your email address here"
                                value={values.emailAddress}
                                variant="outlined"
                              />
                            </div>
                          </Grid>
                          <Grid item xs={12} sm={12} lg={12} paddingTop={0}>
                            <div className="form-control">
                              <h5>Phone Number (Required)</h5>
                              <FormikTextInput
                                name="phoneNumber"
                                placeholder="Enter your phone number here"
                                value={values.phoneNumber}
                                variant="outlined"
                              />
                            </div>
                          </Grid>
                          <Grid item xs={12} sm={12} lg={12}>
                            <div className="form-control">
                              <h5>Remarks</h5>
                              <FormikTextInput
                                name="remarks"
                                placeholder="Enter your remarks here"
                                value={values.remarks}
                                variant="outlined"
                                isTextArea
                              />
                            </div>
                          </Grid>
                        </Grid>
                        <ErrorText isError={error !== ""} text={error} />
                        <Button variant="danger" onClick={() => handleSubmit()}>
                          RSVP
                        </Button>
                      </React.Fragment>
                    );
                  }}
                </Formik>
              </React.Fragment>
            </div>
          </Grid>
        </Grid>
      </Container>
      {loading ? <Spinner variant="fixed" /> : null}
    </div>
  );
};

export default RSVPForm;
