import { Grid, Button as MUIButton } from "@mui/material";
import { CrumbTypes } from "admin/pages/Dashboard/types";
import { paths } from "constants/routes";
import Wrapper from "admin/components/Wrapper/Wrapper";
import { Formik } from "formik";
import Spinner from "library/Spinner/Spinner";
import * as Yup from "yup";
import React, { useContext, useEffect, useState } from "react";
import "./ContractForm.scss";
import FormikTextInput from "library/Formik/FormikInput";
import Select, { GroupBase, StylesConfig } from "react-select";
import { CFS_STATES } from "constants/constants";
import Button from "library/Button/Button";
import agent from "admin/api/agent";
import { toast } from "react-toastify";
import useFetchUserProfile from "admin/hooks/useFetchProfile";
import { UserContext } from "admin/context/UserProvider";
import ErrorText from "pages/PortalRegistration/components/ErrorText";
import MultiSelectInputV2 from "library/MultiSelectInput/MultiSelectInputV2";
import moment from "moment";
import DocumentTitleSetter from "library/DocumentTitleSetter/DocumentTitleSetter";
import useUserRole from "hooks/useUserRole";
import AccessIndicator from "admin/components/AccessIndicator/AccessIndicator";
import classnames from "classnames";

const LIFE_INSURANCE = [
  "Foresters",
  "F&G Life",
  "Mutual of Omaha",
  "Nationwide",
  "North American",
  "National Life Group",
  "Symetra",
];

const ANNUITIES = [
  "American Equity",
  "Athene",
  "F&G Annuities",
  "Global Atlantic",
  "Nassau RE",
];
const ContractForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const today = moment();

  const validationSchema = Yup.object({
    firstName: Yup.string().required("First name is required."),
    lastName: Yup.string().required("Last name is required."),
    email: Yup.string()
      .email("Invalid Email Address")
      .required("Email address is required."),
    state: Yup.string().required("State is required."),
    dateOfBirth: Yup.string().required("Date of birth is required"),
    phoneNumber: Yup.string().required("Phone number is required."),
    licenseNumber: Yup.string().required("License number is required."),
    eAndO: Yup.string().required("E&O is required."),
    ssnNumber: Yup.string()
      .required("SSN Number is required.")
      .length(9, "SSN Number should be 9 digits only"),
    carrier: Yup.array()
      .min(1, "Pick at least 1 Insurance Carrier")
      .required("Insurance Carrier is required."),
  });

  const crumbs: CrumbTypes[] = [
    {
      title: "Comfort Financial Solutions",
      url: paths.dashboard,
      isActive: false,
    },
    {
      title: "Contracting & Appointments",
      url: paths.contracting,
      isActive: true,
    },
  ];

  // React Select
  const reactSelectStyle:
    | StylesConfig<
        {
          value: string;
          label: string;
        },
        false,
        GroupBase<{
          value: string;
          label: string;
        }>
      >
    | undefined = {
    control: (styles) => ({
      ...styles,
      backgroundColor: "white",
      fontWeight: "400",
      fontFamily: '"Montserrat", sans-serif',
      padding: ".6rem",
      fontSize: "1.5rem",
      width: "100%",
      marginTop: "0.8rem",
    }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,
        backgroundColor: isDisabled ? "red" : "#fff",
        color: "black",
        fontWeight: "600",
        fontSize: "1.4rem",
        fontFamily: '"Montserrat", sans-serif',

        cursor: isDisabled ? "not-allowed" : "default",
      };
    },
    placeholder: (styles) => ({
      ...styles,
      fontSize: "1.5rem",
      color: "#5a7184",
      fontWeight: "400",
      opacity: "0.7",
      fontFamily: '"Montserrat", sans-serif',
    }),
  };

  const userCtx = useContext(UserContext) as any;
  const { profile, loading: profileLoading } = useFetchUserProfile(
    userCtx?.user?.userGuid ?? ""
  );
  const { isFreeTrial } = useUserRole();
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [eAndOPreview, setEAndOPreview] = useState({
    value: "",
    error: false,
  });
  const [initialValues, setInitialValues] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    state: CFS_STATES[1].value,
    email: "",
    remarks: "",
    phoneNumber: "",
    licenseNumber: "",
    ssnNumber: "",
    licensePic: "",
    eAndO: "",
    carrier: [],
    annuity: [],
    dateOfBirth: "",
  });

  useEffect(() => {
    setInitialValues({
      email: profile?.emailAddress ?? "",
      licenseNumber: profile?.licenseNumber ?? "",
      lastName: profile?.lastName ?? "",
      firstName: profile?.firstName ?? "",
      middleName: "",
      phoneNumber: profile?.phoneNumber ?? "",
      remarks: "",
      ssnNumber: "",
      state: profile?.state ?? "",
      licensePic: "",
      eAndO: "",
      carrier: [],
      annuity: [],
      dateOfBirth: "",
    });
  }, [profile]);

  const handleFocusBack = () => {
    setThumbnailPreview("");
    window.removeEventListener("focus", handleFocusBack);
  };
  const clickedFileInput = () => {
    window.addEventListener("focus", handleFocusBack);
  };

  const curr = new Date();
  curr.setDate(curr.getDate() + 3);
  const currentDate = curr.toISOString().substring(0, 10);

  const eAndOClassnames = classnames("eAndO-field", {
    error: eAndOPreview.error,
  });

  return (
    <Wrapper
      breadcrumb={crumbs}
      error={false}
      loading={false}
      className="users-container"
    >
      {isFreeTrial ? <AccessIndicator /> : null}
      <DocumentTitleSetter title="Contracting & Appointments | CFS Portal" />
      <div className="contract-form-container">
        {loading ? <Spinner variant="fixed" /> : null}
        <h2>Contracting & Appointments</h2>
        <p
          style={{
            fontSize: "1.4rem",
            textAlign: "center",
            color: "#fff",
            lineHeight: "2rem",
            marginTop: "2rem",
            fontWeight: 300,
          }}
        ></p>
        <div className="contract-form">
          <Formik
            initialValues={initialValues}
            enableReinitialize
            onSubmit={async (data) => {
              setLoading(true);
              try {
                console.log(data);
                const response = await agent.Contracting.requestContract(data);

                if (response) {
                  toast.info(`Contract request has been submitted.`, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                  });
                  setLoading(false);
                  console.log(response);
                }
              } catch (error) {
                setLoading(false);
              }
            }}
            validationSchema={validationSchema}
          >
            {({
              values,
              errors,
              handleSubmit,
              setFieldValue,
              touched,
              setTouched,
            }) => {
              return (
                <React.Fragment>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <label htmlFor="">First Name (Required)</label>
                      <FormikTextInput
                        placeholder="Enter your first name"
                        variant="outlined"
                        name="firstName"
                        value={values.firstName}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <label htmlFor="">Last Name (Required)</label>
                      <FormikTextInput
                        placeholder="Enter your last name"
                        variant="outlined"
                        name="lastName"
                        value={values.lastName}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <label htmlFor="">Middle Name (Optional)</label>
                      <FormikTextInput
                        placeholder="Enter your middle name"
                        variant="outlined"
                        name="middleName"
                        value={values.middleName}
                      />
                    </Grid>
                    <Grid item xs={12} md={12} lg={4}>
                      <label htmlFor="">Email (Required)</label>
                      <FormikTextInput
                        placeholder="Enter your Email"
                        variant="outlined"
                        name="email"
                        value={values.email}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <label htmlFor="">Phone Number (Required)</label>
                      <FormikTextInput
                        placeholder="Enter your Phone Number"
                        variant="outlined"
                        name="phoneNumber"
                        value={values.phoneNumber}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <label htmlFor="">Date of Birth (Required)</label>
                      <FormikTextInput
                        placeholder="Enter your Date of birth"
                        variant="outlined"
                        name="dateOfBirth"
                        value={values.dateOfBirth}
                        defaultValue={currentDate}
                        type="date"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <label htmlFor="">Resident State (Required)</label>
                      <Select
                        className="basic-single"
                        classNamePrefix="select"
                        name="state"
                        styles={reactSelectStyle}
                        defaultValue={CFS_STATES[1]}
                        isDisabled={false}
                        isLoading={false}
                        isClearable={true}
                        isSearchable={true}
                        options={CFS_STATES}
                        placeholder="Select a state"
                        onChange={(value) =>
                          setFieldValue("state", value?.value)
                        }
                      />
                    </Grid>
                    <Grid item xs={12} md={12} lg={4}>
                      <label htmlFor="">License Number (Required)</label>
                      <FormikTextInput
                        placeholder="Enter your License Number"
                        variant="outlined"
                        name="licenseNumber"
                        value={values.licenseNumber}
                      />
                    </Grid>
                    <Grid item xs={12} md={12} lg={4}>
                      <label htmlFor="">SSN Number (Required)</label>
                      <FormikTextInput
                        placeholder="Enter your SSN Number"
                        variant="outlined"
                        name="ssnNumber"
                        value={values.ssnNumber}
                      />
                    </Grid>
                    <Grid item xs={12} md={12} lg={12}>
                      <label htmlFor="">Life Insurance (Required)</label>
                      <MultiSelectInputV2
                        options={LIFE_INSURANCE.map((carrier) => {
                          return {
                            keyword: carrier,
                            label: carrier,
                            value: carrier,
                          };
                        })}
                        onChange={(e) => {
                          const modifiedValue = e?.map((val) => val.keyword);
                          setFieldValue("carrier", modifiedValue);
                        }}
                        onBlur={(e) => {
                          if (values.carrier.length === 0) {
                            setTouched({
                              ...touched,
                              carrier: [],
                            });
                          }
                        }}
                        error={
                          values.carrier.length === 0 && touched.carrier
                            ? true
                            : false
                        }
                        placeholder="Select a life insurance item to add"
                        value={values.carrier.map((data) => {
                          return {
                            keyword: data,
                            label: data,
                            value: data,
                          };
                        })}
                        closeMenuOnSelect={true}
                      />

                      <ErrorText
                        isError={
                          values.carrier.length === 0 && !!touched.carrier
                        }
                        text="Insurance carrier field is required."
                      />
                    </Grid>
                    <Grid item xs={12} md={12} lg={12}>
                      <label htmlFor="">Annuities (Optional)</label>
                      <MultiSelectInputV2
                        options={ANNUITIES.map((carrier) => {
                          return {
                            keyword: carrier,
                            label: carrier,
                            value: carrier,
                          };
                        })}
                        onChange={(e) => {
                          const modifiedValue = e?.map((val) => val.keyword);
                          setFieldValue("annuity", modifiedValue);
                        }}
                        onBlur={(e) => {
                          if (values.annuity.length === 0) {
                            setTouched({
                              ...touched,
                              annuity: [],
                            });
                          }
                        }}
                        error={false}
                        closeMenuOnSelect={true}
                        placeholder="Select a annuity item to add"
                        value={values.annuity.map((data) => {
                          return {
                            keyword: data,
                            label: data,
                            value: data,
                          };
                        })}
                      />
                    </Grid>
                    <Grid item xs={12} md={12} lg={12} marginTop={2}>
                      <label>Drivers License Copy (Optional)</label>
                      <br />
                      <MUIButton
                        variant="contained"
                        component="label"
                        className="primary-cfs-btn input-file-btn"
                        disabled={isFreeTrial}
                      >
                        Upload File
                        <input
                          type="file"
                          hidden
                          name="licensePic"
                          onChange={(event) => {
                            setFieldValue(
                              "licensePic",
                              event.currentTarget.files![0]
                            );
                            const fileReader = new FileReader();
                            fileReader.onload = () => {
                              if (fileReader.readyState === 2) {
                                setThumbnailPreview(
                                  fileReader.result?.toString() ?? ""
                                );
                              }
                            };
                            fileReader.readAsDataURL(event.target.files![0]);
                            window.removeEventListener(
                              "focus",
                              handleFocusBack
                            );
                          }}
                          onClick={clickedFileInput}
                        />
                      </MUIButton>
                      {thumbnailPreview ||
                      (typeof values.licensePic === "string" &&
                        values.licensePic) ? (
                        <div className="user-license-container">
                          <img
                            src={
                              typeof values.licensePic === "string"
                                ? values.licensePic
                                : thumbnailPreview
                            }
                            alt="user-license-pic"
                          ></img>
                        </div>
                      ) : null}
                    </Grid>
                    <Grid item xs={12} md={12} lg={12} marginTop={2}>
                      <label>E&O (Required)</label>
                      <br />
                      <MUIButton
                        variant="contained"
                        component="label"
                        className="primary-cfs-btn input-file-btn"
                        disabled={isFreeTrial}
                      >
                        Upload File
                        <input
                          type="file"
                          hidden
                          name="eAndO"
                          onChange={(event) => {
                            setFieldValue(
                              "eAndO",
                              event.currentTarget.files![0]
                            );
                            setEAndOPreview({
                              value: event.currentTarget.files![0]?.name,
                              error: false,
                            });
                          }}
                          onClick={() => {
                            setTouched({ ...touched, eAndO: true });
                            clickedFileInput();
                          }}
                        />
                      </MUIButton>
                      {eAndOPreview ||
                      (typeof values.eAndO === "string" && values.eAndO) ? (
                        <span className="eAndO-field">
                          {typeof values.eAndO === "string"
                            ? values.eAndO
                            : eAndOPreview.value}
                        </span>
                      ) : null}
                      {errors.eAndO && touched.eAndO ? (
                        <span className="eAndO-field error">
                          E&O field is required.
                        </span>
                      ) : null}
                    </Grid>
                    <Grid
                      item
                      sm={12}
                      md={12}
                      lg={12}
                      className="form-card-container"
                    >
                      <label>Remarks (Optional)</label>
                      <FormikTextInput
                        className="form-remarks"
                        placeholder="Enter your remarks here"
                        variant="outlined"
                        name="remarks"
                        value={values.remarks}
                        isTextArea
                      />
                    </Grid>
                  </Grid>
                  <Button
                    variant="danger"
                    onClick={() => handleSubmit()}
                    disabled={isFreeTrial}
                  >
                    Submit
                  </Button>
                  {/* <pre>{JSON.stringify(values, null, 2)}</pre>
                  <pre>{JSON.stringify(errors, null, 2)}</pre>
                  <pre>{JSON.stringify(touched, null, 2)}</pre> */}
                </React.Fragment>
              );
            }}
          </Formik>
        </div>
      </div>
      {loading ? <Spinner variant="fixed" /> : null}
    </Wrapper>
  );
};

export default ContractForm;
