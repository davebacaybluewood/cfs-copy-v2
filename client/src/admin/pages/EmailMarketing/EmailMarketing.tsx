import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  Tooltip,
  Typography,
} from "@mui/material";
import { CrumbTypes } from "admin/pages/Dashboard/types";
import { paths } from "constants/routes";
import Wrapper from "admin/components/Wrapper/Wrapper";
import { Formik } from "formik";
import Spinner from "library/Spinner/Spinner";
import * as Yup from "yup";
import React, { useContext, useEffect, useRef, useState } from "react";
import "./EmailMarketing.scss";
import FormikTextInput from "library/Formik/FormikInput";
import Button from "library/Button/Button";
import ErrorText from "pages/PortalRegistration/components/ErrorText";
import { ClearIndicatorStyles } from "library/MultiSelectInput/MultiSelectInputV2";
import agent from "admin/api/agent";
import { UserContext } from "admin/context/UserProvider";
import CreatableSelect from "react-select/creatable";
import { toast } from "react-toastify";
import DrawerBase, { Anchor } from "library/Drawer/Drawer";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { BsPlusCircle } from "react-icons/bs";
import { useLocation } from "react-router-dom";
import { EmailTemplateParameter } from "admin/models/emailMarketing";
import nameFallback from "helpers/nameFallback";
import { formatISODateOnly } from "helpers/date";
import { AiFillCheckCircle } from "react-icons/ai";
import EmailEditor from "react-email-editor";
import ReactHtmlParser from "html-react-parser";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export const emailOptions = [
  { value: "dave.bacay.vc@gmail.com", label: "dave.bacay.vc@gmail.com" },
  { value: "dave.bacay@gocfs.pro", label: "dave.bacay@gocfs.pro" },
];

const ContractForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const emailEditorRef = useRef<any>(null);
  const [design, setDesign] = useState<any>();
  const [expanded, setExpanded] = React.useState<string | false>(false);
  const [saveTemplateError, setSaveTemplateError] = useState<string>("");

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const crumbs: CrumbTypes[] = [
    {
      title: "Comfort Financial Solutions",
      url: paths.dashboard,
      isActive: false,
    },
    {
      title: "Email Marketing",
      url: paths.emailMarketing,
      isActive: true,
    },
  ];

  const [initialValues, setInitialValues] = useState({
    recipients: [],
    emailBody: "",
    subject: "",
    settings: [""],
  });
  const [templates, setTemplates] = useState<any>([]);
  const userCtx = useContext(UserContext) as any;
  const search = useLocation().search;
  const templateId = new URLSearchParams(search).get("templateId");
  const action = new URLSearchParams(search).get("action");
  const userGuid = userCtx?.user?.userGuid;

  const populateForm = (
    emailBody: string,
    subject: string,
    design: string,
    settings: string[]
  ) => {
    setInitialValues((prevState) => ({
      recipients: prevState.recipients,
      emailBody: emailBody,
      subject: subject,
      settings: settings,
    }));

    emailEditorRef.current?.loadDesign(JSON.parse(design));

    setOpenDrawer(false);
  };

  useEffect(() => {
    const fetchEmailTemplates = async () => {
      setLoading(true);
      const data = await agent.EmailMarketing.getEmailTemplates(userGuid);

      setTemplates(data);
    };

    if (userGuid) {
      fetchEmailTemplates();
      setLoading(false);
    }
  }, [userGuid]);

  const rows: GridRowsProp = templates?.map((template) => {
    return {
      id: template._id,
      createdBy: nameFallback(
        template.authorName,
        template.authorFirstname,
        template.authorLastname
      ),
      createdAt: formatISODateOnly(template.createdAt ?? ""),
      templateName: (
        <Tooltip
          title={<h1 style={{ color: "#fff" }}>Created by Marketing Team</h1>}
        >
          <div className="template-name-header">
            <span>{template.templateName}</span>
            {template.isAddedByMarketing ? <AiFillCheckCircle /> : null}
          </div>
        </Tooltip>
      ),
      actions: (
        <React.Fragment>
          <button
            className="select-btn"
            disabled={
              template.status === "DEACTIVATED" || template.status === "DRAFT"
            }
            onClick={() => {
              populateForm(
                template.templateBody,
                template.subject,
                template.design,
                template.settings
              );
            }}
          >
            <span>Import</span> <BsPlusCircle />
          </button>
        </React.Fragment>
      ),
    };
  });

  const columns: GridColDef[] = [
    {
      field: "templateName",
      headerName: "Template Name",
      width: 300,
      renderCell: (params) => params.value,
    },
    { field: "createdBy", headerName: "Created By", width: 100 },
    { field: "createdAt", headerName: "Date Created", width: 120 },
    {
      field: "actions",
      headerName: "",
      width: 300,
      align: "right",
      renderCell: (params) => params.value,
    },
  ];

  useEffect(() => {
    const fetchTemplateInfo = async () => {
      setLoading(true);
      const data = await agent.EmailMarketing.getSingleTemplate(
        userGuid,
        templateId || ""
      );
      setInitialValues({
        emailBody: data.templateBody,
        subject: data.subject,
        recipients: [],
        settings: data.settings,
      });
      setDesign(data.design);

      /** Load if edit mode */
      if (emailEditorRef.current) {
        // console.log(data);
        const test = JSON.parse(data.design || "");
        console.log({
          test,
          design: data.design,
        });
        emailEditorRef.current?.loadDesign(JSON.parse(data.design || ""));
      }
    };
    if (userGuid && templateId) {
      fetchTemplateInfo();
      setLoading(false);
    }
  }, [templateId, userGuid]);

  const saveTemplateHandler = async (data: EmailTemplateParameter) => {
    const unlayer = emailEditorRef.current?.editor;

    unlayer?.exportHtml(async (htmlData) => {
      const { design: updatedDesign, html } = htmlData;

      data.design = JSON.stringify(updatedDesign);
      data.templateBody = html;

      // check if fields not empty (only templateBody and templateName is needed to validate for this)
      const isNoEmptyFields = data.templateBody && data.templateName;

      if (isNoEmptyFields) {
        setSaveTemplateError("");
        setLoading(true);
        const response = await agent.EmailMarketing.createEmailTemplate(
          userGuid,
          data
        );

        if (response) {
          toast.info(`Email Template has been added.`, {
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
        }
      } else {
        setSaveTemplateError("Please complete all fields.");
        setLoading(false);
      }
    });
  };

  const validationSchema = Yup.object({
    emailBody: Yup.string().required("Email body is required."),
    subject: Yup.string().required("Subject is required."),
    recipients: Yup.array()
      .min(1, "Pick at least 1 recipients")
      .required("Recipients is required."),
  });
  return (
    <Wrapper
      breadcrumb={crumbs}
      error={false}
      loading={false}
      className="email-marketing-container"
    >
      <div className="email-marketing-form-container">
        {loading ? <Spinner variant="fixed" /> : null}
        <h2>Email Marketing</h2>
        <div className="email-marketing-form">
          <Formik
            initialValues={initialValues}
            enableReinitialize
            onSubmit={async (data, actions) => {
              const finalData: any = {
                ...data,
                userGuid: userCtx?.user?.userGuid,
              };
              setLoading(true);

              if (action !== "view") {
                const unlayer = emailEditorRef.current?.editor;
                unlayer?.exportHtml(async (htmlData) => {
                  const { design: updatedDesign, html } = htmlData;

                  finalData.design = updatedDesign;
                  finalData.emailBody = html;

                  const response = await agent.EmailMarketing.sendEmail(
                    finalData
                  );

                  if (response) {
                    setLoading(false);
                    toast.info(`Email has been submitted.`, {
                      position: "top-right",
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: "light",
                    });
                  } else {
                    setLoading(false);
                  }
                });
              } else {
                finalData.design = design;
                finalData.emailBody = initialValues.emailBody;

                const response = await agent.EmailMarketing.sendEmail(
                  finalData
                );

                if (response) {
                  setLoading(false);
                  toast.info(`Email has been submitted.`, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                  });
                } else {
                  setLoading(false);
                }
              }
            }}
            validationSchema={validationSchema}
          >
            {({ values, handleSubmit, setFieldValue, touched, setTouched }) => {
              return (
                <React.Fragment>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={12} lg={12}>
                      <label htmlFor="">Recipients (Required)</label>

                      <CreatableSelect
                        isMulti
                        options={emailOptions as any}
                        placeholder="Select a recipient item to add"
                        onChange={(e) => {
                          const modifiedValue = e?.map((val) => val.label);
                          setFieldValue("recipients", modifiedValue);
                        }}
                        onBlur={(e) => {
                          if (values.recipients.length === 0) {
                            setTouched({
                              ...touched,
                              recipients: [],
                            });
                          }
                        }}
                        styles={{
                          clearIndicator: ClearIndicatorStyles,
                          placeholder: (defaultStyles) => {
                            return {
                              ...defaultStyles,
                              color: "rgba(0, 0, 0, 0.3)",
                              zIndex: 9,
                            };
                          },

                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          control: (baseStyles, state) => {
                            return {
                              ...baseStyles,
                              fontSize: "13px",
                              paddingTop: "5px",
                              paddingBottom: "5px",
                              borderColor: "hsl(0, 0%, 80%)",
                            };
                          },
                        }}
                      />

                      <ErrorText
                        isError={
                          values.recipients.length === 0 && !!touched.recipients
                        }
                        text="Recipients field is required."
                      />
                    </Grid>
                    <Grid
                      item
                      sm={12}
                      md={12}
                      lg={12}
                      className="form-card-container"
                    >
                      <label>Email Subject (Required)</label>
                      <FormikTextInput
                        placeholder="Enter your subject here"
                        variant="outlined"
                        name="subject"
                        value={values.subject}
                      />
                    </Grid>
                    <Grid
                      item
                      sm={12}
                      md={12}
                      lg={12}
                      className="form-card-container"
                    >
                      {action !== "view" ? (
                        <React.Fragment>
                          <label>Email Body (Required)</label>

                          <EmailEditor
                            ref={emailEditorRef}
                            style={{
                              height: "500px",
                            }}
                          />
                        </React.Fragment>
                      ) : (
                        ReactHtmlParser(initialValues.emailBody)
                      )}
                    </Grid>
                    <Grid
                      item
                      sm={12}
                      md={12}
                      lg={12}
                      className="form-card-container"
                    >
                      <Accordion
                        expanded={expanded === "panel1"}
                        onChange={handleChange("panel1")}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1bh-content"
                          id="panel1bh-header"
                        >
                          <Typography
                            sx={{ fontSize: 15, width: "33%", flexShrink: 0 }}
                          >
                            Advanced Settings
                          </Typography>
                          <Typography
                            sx={{ fontSize: 13, color: "text.secondary" }}
                          >
                            Configure your email settings
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <FormGroup>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  name="BLOGS"
                                  checked={values.settings.includes("BLOGS")}
                                />
                              }
                              label="Show Blogs"
                              onChange={(e) => {
                                if (values.settings.includes("BLOGS")) {
                                  const filteredValues = values.settings.filter(
                                    function (item: string) {
                                      return item !== "BLOGS";
                                    }
                                  );

                                  setFieldValue("settings", filteredValues);
                                } else {
                                  const filteredValues = [
                                    ...values.settings,
                                    "BLOGS",
                                  ];
                                  setFieldValue("settings", filteredValues);
                                }
                              }}
                            />
                            <FormControlLabel
                              required
                              control={
                                <Checkbox
                                  name="REGISTER"
                                  checked={values.settings.includes(
                                    "REGISTER_BUTTONS"
                                  )}
                                />
                              }
                              label="Show Register Buttons"
                              onChange={(e) => {
                                if (
                                  values.settings.includes("REGISTER_BUTTONS")
                                ) {
                                  const filteredValues = values.settings.filter(
                                    function (item: string) {
                                      return item !== "REGISTER_BUTTONS";
                                    }
                                  );

                                  setFieldValue("settings", filteredValues);
                                } else {
                                  const filteredValues = [
                                    ...values.settings,
                                    "REGISTER_BUTTONS",
                                  ];
                                  setFieldValue("settings", filteredValues);
                                }
                              }}
                            />
                          </FormGroup>
                        </AccordionDetails>
                      </Accordion>
                    </Grid>
                  </Grid>
                  {saveTemplateError && (
                    <div className="save-template-error-text">
                      <span>{saveTemplateError}</span>
                    </div>
                  )}

                  <div className="form-actions">
                    {action !== "view" ? (
                      <div className="template-library-btn">
                        <button onClick={() => setOpenDrawer(true)}>
                          Template Library
                        </button>
                      </div>
                    ) : null}
                    <div className="actions">
                      {action !== "view" ? (
                        <React.Fragment>
                          <Button
                            variant="default"
                            onClick={async () =>
                              saveTemplateHandler({
                                templateName: values.subject,
                                templateBody: values.emailBody,
                                templateStatus: "DRAFT",
                                isAddedByMarketing: true,
                                subject: values.subject,
                                design: JSON.stringify(design),
                                settings: values.settings,
                              })
                            }
                          >
                            Save as draft
                          </Button>
                          <Button
                            variant="default"
                            onClick={async () =>
                              saveTemplateHandler({
                                templateName: values.subject,
                                templateBody: values.emailBody,
                                templateStatus: "ACTIVATED",
                                isAddedByMarketing: true,
                                subject: values.subject,
                                design: JSON.stringify(design),
                                settings: values.settings,
                              })
                            }
                          >
                            Save as template
                          </Button>
                        </React.Fragment>
                      ) : null}
                      <Button variant="danger" onClick={() => handleSubmit()}>
                        Send
                      </Button>
                    </div>
                  </div>
                  {/* <pre>{JSON.stringify(values, null, 2)}</pre> */}
                  {/* <pre>{JSON.stringify(errors, null, 2)}</pre> */}
                </React.Fragment>
              );
            }}
          </Formik>
        </div>
      </div>
      {loading ? <Spinner variant="fixed" /> : null}

      <DrawerBase
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        anchor={Anchor.Right}
        title="Email Library"
        className="drawer-email-library"
        footer={
          <React.Fragment>
            <Button variant="default" onClick={() => setOpenDrawer(false)}>
              Close
            </Button>
          </React.Fragment>
        }
      >
        <div className="datagrid-content">
          <DataGrid rows={rows} columns={columns} />
        </div>
      </DrawerBase>
    </Wrapper>
  );
};

export default ContractForm;
