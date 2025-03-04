import React, { useContext, useEffect, useState } from "react";
import Wrapper from "admin/components/Wrapper/Wrapper";
import { CrumbTypes } from "../Dashboard/types";
import { paths } from "constants/routes";
import Title from "admin/components/Title/Title";
import {
  DataGrid,
  GridColDef,
  GridToolbar,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import { BsPlusCircle } from "react-icons/bs";
import { createSearchParams, useNavigate } from "react-router-dom";
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  Skeleton,
  Tooltip,
} from "@mui/material";
import agent from "admin/api/agent";
import { UserContext } from "admin/context/UserProvider";
import nameFallback from "helpers/nameFallback";
import { formatISODateOnly } from "helpers/date";
import { AiFillCheckCircle, AiOutlineCheckCircle } from "react-icons/ai";
import { toast } from "react-toastify";
import classNames from "classnames";
import { HiOutlineTrash } from "react-icons/hi";
import { RiExternalLinkFill } from "react-icons/ri";
import Spinner from "library/Spinner/Spinner";
import { BiCategory, BiFilterAlt } from "react-icons/bi";
import "./MailingLibrary.scss";
import DocumentTitleSetter from "library/DocumentTitleSetter/DocumentTitleSetter";
import { BLANK_VALUE } from "constants/constants";
import Badge from "library/Badge/Badge";

const crumbs: CrumbTypes[] = [
  {
    title: "Comfort Financial Solutions",
    url: paths.dashboard,
    isActive: false,
  },
  {
    title: "EmailPro Templates",
    url: paths.mailLibrary,
    isActive: true,
  },
];

const MailLibrary: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fixedLoading, setFixedLoading] = useState(false);
  const userCtx = useContext(UserContext) as any;
  const userGuid = userCtx?.user?.userGuid;
  const [templates, setTemplates] = useState<any>([]);
  const [originalTemplates, setOriginalTemplates] = useState<any>([]);

  const TextOverFlow = ({ value }) => {
    return (
      <Tooltip title={<h1 style={{ color: "#fff" }}>{value}</h1>}>
        <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
          {value}
        </span>
      </Tooltip>
    );
  };

  const columns: GridColDef[] = [
    {
      field: "templateName",
      headerName: "Template Name",
      width: 200,
      renderCell: (params) => params.value,
      filterable: false,
    },
    {
      field: "subject",
      headerName: "Subject",
      width: 200,
      renderCell: (params) => <TextOverFlow value={params.value} />,
    },
    {
      field: "categories",
      headerName: "Categories",
      width: 200,
      renderCell: (params) => <TextOverFlow value={params.value} />,
    },
    {
      field: "createdBy",
      headerName: "Created By",
      width: 200,
      renderCell: (params) => <TextOverFlow value={params.value} />,
    },
    {
      field: "createdAt",
      headerName: "Date Created",
      width: 200,
      renderCell: (params) => <TextOverFlow value={params.value} />,
    },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      renderCell: (params) => <TextOverFlow value={params.value} />,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 320,
      align: "right",
      renderCell: (params) => params.value,
      disableExport: true,
    },
  ];

  const activationHandler = async (
    templateName: string,
    templateBody: string,
    templateStatus: string,
    isAddedByMarketing: boolean,
    templateId: string,
    subject: string,
    design: string,
    settings: string[]
  ) => {
    setFixedLoading(true);
    const body = {
      templateName,
      templateBody,
      templateStatus,
      isAddedByMarketing,
      subject,
      design,
      settings,
    };

    try {
      const res = await agent.EmailMarketing.updateEmailTemplate(
        userGuid,
        templateId,
        body
      );
      if (res) {
        toast.info(`Template Updated`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setFixedLoading(false);

        setTemplates((prevRows) => {
          return prevRows.map((row, index) => {
            const newData =
              row._id === templateId
                ? {
                    ...row,
                    status: templateStatus,
                  }
                : row;

            console.log(newData);
            return newData;
          });
        });
      }
    } catch (error) {
      toast.error("Error updating status of template");
    } finally {
      setFixedLoading(false);
    }
  };

  useEffect(() => {
    const fetchEmailTemplates = async () => {
      setLoading(true);
      const data = await agent.EmailMarketing.getEmailTemplates(userGuid);

      setTemplates(data);
      setOriginalTemplates(data);
    };

    if (userGuid) {
      fetchEmailTemplates();
      setLoading(false);
    }
  }, [userGuid]);

  const templateList = templates?.map((template) => {
    const deactivateButtonIsDisabled = template.userGuid !== userGuid;
    const btnClassnames = classNames("select-btn", {
      danger: template.status === "ACTIVATED",
    });

    return {
      id: template._id,
      createdBy: nameFallback(
        template.authorName,
        template.authorFirstname,
        template.authorLastname
      ),
      createdAt: formatISODateOnly(template.createdAt ?? ""),
      templateValue: template.templateName,
      templateName: (
        <>
          <Tooltip
            title={<h1 style={{ color: "#fff" }}>{template.templateName}</h1>}
          >
            <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
              {template.templateName}
            </span>
          </Tooltip>
          {template.isAddedByMarketing ? (
            <Tooltip
              title={
                <h1 style={{ color: "#fff" }}>Created by Marketing Team</h1>
              }
            >
              <IconButton>
                <AiFillCheckCircle />
              </IconButton>
            </Tooltip>
          ) : null}
        </>
      ),
      subject: template.subject,
      categories: template.categories?.length
        ? template.categories?.map((data) => {
            if (data.label) {
              return (
                <Badge>
                  <span>{data.label}</span>
                </Badge>
              );
            } else {
              return BLANK_VALUE;
            }
          })
        : BLANK_VALUE,
      body: template.templateBody,
      status:
        template.status.charAt(0).toUpperCase() +
        template.status.slice(1).toLowerCase(),
      isAddedByMarketing: template.isAddedByMarketing,
      actions: (
        <React.Fragment>
          <button
            className="select-btn"
            disabled={
              template.status === "DEACTIVATED" || template.status === "DRAFT"
            }
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => {
              navigate({
                pathname: paths.emailMarketing,
                search: createSearchParams({
                  templateId: template._id,
                }).toString(),
              });
            }}
          >
            <span>Import</span> <BsPlusCircle />
          </button>
          <button
            className="select-btn"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => {
              navigate({
                pathname: paths.emailMarketing,
                search: createSearchParams({
                  action: "edit",
                  templateId: template._id,
                }).toString(),
              });
            }}
          >
            <span>View</span> <RiExternalLinkFill />
          </button>
          {template.status === "DEACTIVATED" ||
          (template.status === "DRAFT" && template.userGuid === userGuid) ? (
            <button
              className={classNames("select-btn", {
                danger: template.status === "ACTIVATED",
              })}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              }}
              onClick={() =>
                activationHandler(
                  template.templateName,
                  template.templateBody,
                  "ACTIVATED",
                  !!template.isAddedByMarketing,
                  template._id ?? "",
                  template.subject,
                  template.design,
                  template.settings
                )
              }
              disabled={deactivateButtonIsDisabled}
            >
              <span>Activate</span> <AiOutlineCheckCircle />
            </button>
          ) : (
            <button
              className={classNames("select-btn", {
                danger: template.status === "ACTIVATED",
              })}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              }}
              onClick={() =>
                activationHandler(
                  template.templateName,
                  template.templateBody,
                  "DEACTIVATED",
                  !!template.isAddedByMarketing,
                  template._id ?? "",
                  template.subject,
                  template.design,
                  template.settings
                )
              }
              disabled={deactivateButtonIsDisabled}
            >
              <span>Deactivate</span> <HiOutlineTrash />
            </button>
          )}
        </React.Fragment>
      ),
    };
  });

  const templateSkeleton = Array.from({ length: 5 }).map((row, index) => {
    return {
      id: index,
      templateName: <Skeleton variant="rectangular" width={180} height={20} />,
      subject: <Skeleton variant="rectangular" width={180} height={20} />,
      createdBy: <Skeleton variant="rectangular" width={180} height={20} />,
      createdAt: <Skeleton variant="rectangular" width={180} height={20} />,
      status: <Skeleton variant="rectangular" width={180} height={20} />,
    };
  });

  const filteredRows = templates.length > 0 ? templateList : templateSkeleton;

  // This will be refactor september
  const FilteredGridToolbar = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [openStatus, setOpenStatus] = useState(false);
    const [categoriesAnchorEl, setCategoriesAnchorEl] =
      useState<null | HTMLElement>(null);
    const [openCategories, setOpenCategories] = useState(false);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setOpenStatus(true);
      setAnchorEl(event.currentTarget);
    };

    const categoriesFilterHandler = (
      event: React.MouseEvent<HTMLButtonElement>
    ) => {
      setOpenCategories(true);
      setCategoriesAnchorEl(event.currentTarget);
    };

    const filterHandler = (status: string) => {
      setTemplates((prevState) => {
        const filteredData = originalTemplates?.filter(
          (data) => data.status === status
        );
        return status === "ALL" ? originalTemplates : filteredData;
      });
      setAnchorEl(null);
    };

    const filterCategoryHandler = (categoryValue: string) => {
      setTemplates((prevState) => {
        let result = originalTemplates.filter((cl) =>
          cl.categories?.some((c) => c.value == categoryValue)
        );

        return categoryValue === "ALL" ? originalTemplates : result;
      });
      setAnchorEl(null);
    };

    const categories = templates
      .map((data) => {
        const deepCategory = data.categories?.map((c) => {
          return {
            value: c?.value,
            label: c?.label,
            keyword: c?.label,
          };
        });

        return deepCategory;
      })
      .filter((data) => data)
      .filter((data) => data.length);

    const finalCategories = Object.values(categories)
      .filter((x) => Array.isArray(x))
      .flat()
      .filter((data: any) => data?.value);

    const uniqueCategories = finalCategories.filter(
      (v: any, i: any, a: any) =>
        a.findIndex((v2) => v.label === v2.label && v.value === v2.value) === i
    );

    return (
      <GridToolbarContainer className="custom-toolbar">
        <GridToolbar />
        <Button onClick={handleClick} className="filter-status-btn">
          <BiFilterAlt />
          Filter by Status
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={openStatus}
          onClose={() => {
            setAnchorEl(null);
            setOpenStatus(false);
          }}
        >
          <MenuItem onClick={() => filterHandler("ALL")}>All Status</MenuItem>
          <MenuItem onClick={() => filterHandler("ACTIVATED")}>
            Activated
          </MenuItem>
          <MenuItem onClick={() => filterHandler("DRAFT")}>Draft</MenuItem>
          <MenuItem onClick={() => filterHandler("DEACTIVATED")}>
            Deactivated
          </MenuItem>
        </Menu>

        <Button onClick={categoriesFilterHandler} className="filter-status-btn">
          <BiCategory />
          Filter by Categories
        </Button>
        <Menu
          anchorEl={categoriesAnchorEl}
          open={openCategories}
          onClose={() => {
            setCategoriesAnchorEl(null);
            setOpenCategories(false);
          }}
        >
          <MenuItem onClick={() => filterCategoryHandler("ALL")}>
            All Categories
          </MenuItem>
          {uniqueCategories?.map((data: any) => {
            return (
              <MenuItem onClick={() => filterCategoryHandler(data?.value)}>
                {data?.label}
              </MenuItem>
            );
          })}
        </Menu>
      </GridToolbarContainer>
    );
  };

  if (loading) {
    return <Spinner variant="relative" />;
  }

  return (
    <Wrapper breadcrumb={crumbs} error={false} loading={loading}>
      <DocumentTitleSetter title="EmailPro Templates | CFS Portal" />
      <div className="mailing-library-container">
        <Title title="EmailPro Templates" subtitle="">
          <Button
            onClick={() => navigate(paths.mailLibraryForm)}
            variant="contained"
          >
            Add Template
          </Button>
        </Title>

        <div className="mailing-library-table">
          <DataGrid
            sx={{
              boxShadow: "0 4px 6px -1px #eee, 0 2px 4px -1px #eee",
              background: "white",
              p: 2,
            }}
            rows={filteredRows}
            columns={columns}
            initialState={{
              columns: {
                columnVisibilityModel: {
                  templateValue: false,
                },
              },
            }}
            slots={{ toolbar: FilteredGridToolbar }}
          />
        </div>
      </div>
      {fixedLoading ? <Spinner variant="fixed" /> : null}
    </Wrapper>
  );
};

export default MailLibrary;
