import React, { SetStateAction, useContext, useEffect, useState } from "react";
import Wrapper from "admin/components/Wrapper/Wrapper";
import { CrumbTypes } from "../Dashboard/types";
import { paths } from "constants/routes";
import Title from "admin/components/Title/Title";
import {
  Button as MUIButton,
  Drawer,
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  Menu,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRowParams,
  GridToolbar,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import { UserContext } from "admin/context/UserProvider";
import { formatISODateOnly } from "helpers/date";
import { toast } from "react-toastify";
import Spinner from "library/Spinner/Spinner";
import { useCopyToClipboard } from "../../hooks/useCopyToClipboard";
import useFetchSubscribers from "../RewardsHistory/useFetchSubscribers";
import NoInformationToDisplay from "library/NoInformationToDisplay/NoInformationToDisplay";
import DocumentTitleSetter from "library/DocumentTitleSetter/DocumentTitleSetter";
import useUserRole from "hooks/useUserRole";
import Pricing from "admin/components/Pricing/Pricing";
import { createSearchParams, useNavigate } from "react-router-dom";
import agent from "admin/api/agent";
import * as Papa from "papaparse";
import { saveAs } from "file-saver";
import "./AgentSubscribers.scss";
import HtmlTooltip from "library/HtmlTooltip/HtmlTooltip";
import capitalizeText from "../../../helpers/capitalizeText";
import ChannelDrawer from "admin/components/ChannelDrawer/ChannelDrawer";
import { BLANK_VALUE } from "constants/constants";
import Badge from "library/Badge/Badge";
import { BiCategory } from "react-icons/bi";
import { SubscribersData } from "admin/models/subscriberModel";
import { LeadsContext } from "admin/context/LeadsProvider";
import { LeadChannelData } from "admin/api/channelServices/channelModels";
import { ChannelContext } from "admin/context/ChannelProvider";

const crumbs: CrumbTypes[] = [
  {
    title: "Comfort Financial Solutions",
    url: paths.dashboard,
    isActive: false,
  },
  {
    title: "Leads",
    url: paths.myLeads,
    isActive: true,
  },
];

type ActiveChannelType = {
  channelName: string;
  channels: LeadChannelData[] | undefined;
  leadUserGuid: string;
};

const AgentSubscribers: React.FC = () => {
  const [leadDrawerOpen, setLeadDrawerOpen] = useState(false);
  const userCtx = useContext(UserContext) as any;
  const userGuid = userCtx?.user?.userGuid;
  const [clipboardValue, setClipboardValue] = useCopyToClipboard();
  const { loading, subscribers, setSubscribers, totalSubscribers } =
    useFetchSubscribers(userGuid, leadDrawerOpen);
  const { isFreeTrial, loading: roleLoading } = useUserRole();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeId, setActiveId] = useState("");
  const [activeChannel, setActiveChannel] = useState<ActiveChannelType>({
    channelName: "",
    channels: [],
    leadUserGuid: "",
  });
  const navigate = useNavigate();
  const { leads, setLeads } = useContext(LeadsContext);
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const [channelDrawerOpen, setChannelDrawerOpen] = useState(false);
  const { channels: _channels } = useContext(ChannelContext);

  useEffect(() => {
    setLeads(subscribers);
  }, [subscribers]);

  const columns: GridColDef[] = [
    {
      field: "type",
      headerName: "User Type",
      width: 150,
      renderCell: (params) => params.value,
    },
    {
      field: "isSubscribed",
      headerName: "Is Upgraded to Agent?",
      width: 200,
      renderCell: (params) => params.value,
    },
    { field: "firstName", headerName: "First Name", width: 200 },
    {
      field: "lastName",
      headerName: "Last Name",
      width: 200,
    },
    { field: "email", headerName: "Email Address", width: 200 },
    {
      field: "source",
      headerName: "Source",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "channels",
      headerName: "Channels",
      width: 350,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => params.value,
    },
    { field: "createdAt", headerName: "Date Created", width: 200 },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (params) => params.value,
      width: 400,
      headerAlign: "center",
      disableExport: true,
    },
  ];

  const downloadAsCSV = (data: any[], filename: string) => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    saveAs(blob, filename);
  };

  const handlers = {
    sendEmail: (userGuid: string) => {
      navigate({
        pathname: paths.emailMarketing,
        search: createSearchParams({
          leadUserGuid: userGuid,
        }).toString(),
      });
    },
    downloadAsCSV: (userGuid: string) => {
      const leadData = subscribers?.map((data) => {
        return {
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          source: data.source,
          userType:
            !data.isSubscribed && data.type === "SUBSCRIBER"
              ? "Subscriber"
              : !data.isSubscribed && data.type === "FREE 30DAYS TRIAL"
              ? "Free 30days Trial"
              : data.previousRole === "POSITION_FREE_30DAYS_TRIAL"
              ? "Free 30days Trial"
              : "Subscriber",
          createdAt: formatISODateOnly(data.createdAt ?? ""),
          id: data.userGuid,
          isUpgradeToAgent: data.isSubscribed ? "YES" : "NO",
        };
      });
      const filteredLeadData = leadData
        ?.filter((data) => data.id === userGuid)
        .map((s) => {
          return {
            ["First Name"]: s.firstName,
            ["Last Name"]: s.lastName,
            ["User Type"]: s.userType,
            ["Email Address"]: s.email,
            ["Source"]: s.source,
            ["Is Upgraded to Agent"]: s.isUpgradeToAgent,
            ["Date Created"]: s.createdAt,
          };
        });
      if (userGuid) {
        downloadAsCSV(filteredLeadData as any, "Leads.csv");
        toast.success("Lead Data sucessfully downloaded.");
      }
    },
    delete: async (userGuid: string) => {
      setOpen(false);
      setActiveId(userGuid);
      setIsLoading(true);
      await agent.AgentSubscribers.deleteAgentSubsriber(userGuid);
      setSubscribers(subscribers?.filter((data) => data.userGuid !== userGuid));
      setIsLoading(false);
      toast.success("Lead Sucessfully Deleted.");
    },
  };

  const filteredRows = leads?.map((subscriber) => {
    if (isLoading) {
      <Spinner variant="relative" />;
    }

    return {
      id: subscriber.userGuid,
      isSubscribed: subscriber.isSubscribed ? "YES" : "NO",
      firstName: subscriber.firstName,
      lastName: subscriber.lastName,
      email: subscriber.email,
      source: subscriber.source ?? BLANK_VALUE,
      channels: subscriber.channels?.length
        ? subscriber?.channels?.map((data) => {
            const channelName = _channels?.find(
              (c) => c.channelId === data.channelId
            )?.channelName;
            if (channelName) {
              return (
                <Badge>
                  <span>{channelName}</span>
                </Badge>
              );
            }
          })
        : BLANK_VALUE,
      channelsValue: subscriber?.channels
        ?.map((ch) => {
          return ch + "|";
        })
        .join(""),
      createdAt: formatISODateOnly(subscriber.createdAt ?? ""),
      type:
        !subscriber.isSubscribed && subscriber.type === "SUBSCRIBER"
          ? "Subscriber"
          : !subscriber.isSubscribed && subscriber.type === "FREE 30DAYS TRIAL"
          ? "Free 30days Trial"
          : subscriber.previousRole === "POSITION_FREE_30DAYS_TRIAL"
          ? "Free 30days Trial"
          : "Subscriber",
      actions: (
        <div className="cta-btns">
          <HtmlTooltip
            title={
              <div
                style={{
                  fontSize: "1.3rem",
                }}
              >
                View All Channels of this lead
              </div>
            }
          >
            <button
              onClick={() => {
                setActiveChannel({
                  channelName: subscriber.firstName + " " + subscriber.lastName,
                  leadUserGuid: subscriber.userGuid,
                  channels: subscriber.channels,
                });
                setLeadDrawerOpen(true);
              }}
            >
              Channels
            </button>
          </HtmlTooltip>
          <HtmlTooltip
            title={
              <div
                style={{
                  fontSize: "1.3rem",
                }}
              >
                Send Email to {subscriber.email}.
              </div>
            }
          >
            <button onClick={() => handlers.sendEmail(subscriber.userGuid)}>
              Send Email
            </button>
          </HtmlTooltip>
          <HtmlTooltip
            title={
              <div
                style={{
                  fontSize: "1.3rem",
                }}
              >
                Download Lead Data as CSV file.
              </div>
            }
          >
            <button onClick={() => handlers.downloadAsCSV(subscriber.userGuid)}>
              Download
            </button>
          </HtmlTooltip>
          <button
            onClick={() => {
              setOpen(true);
              setActiveId(subscriber.userGuid);
            }}
          >
            Delete
          </button>
        </div>
      ),
    };
  });

  function handleCopyToClipboard() {
    setClipboardValue(
      window.location.host +
        paths.subscriberRegistration +
        `?userGuid=${userGuid}`
    );
    toast("Link copied to Clipboard");
  }

  function handleCopyToClipboardTrial() {
    setClipboardValue(
      window.location.host + paths.portalRegistration + `?userGuid=${userGuid}`
    );
    toast("Link copied to Clipboard");
  }

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

    const filterCategoryHandler = (channelId: string) => {
      setLeads((prevState) => {
        let result = subscribers?.filter((cl) =>
          cl.channels?.some((c) => c.channelId === channelId)
        );

        if (channelId === "ALL") {
          return subscribers;
        } else {
          return result;
        }
      });
      setAnchorEl(null);
    };

    return (
      <GridToolbarContainer className="custom-toolbar">
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport csvOptions={{ allColumns: true }} />
        <Button onClick={categoriesFilterHandler} className="filter-status-btn">
          <BiCategory />
          Filter by Channels
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
            All Channels
          </MenuItem>
          {_channels?.map((data) => {
            if (data.channelName)
              return (
                <MenuItem
                  onClick={() => filterCategoryHandler(data?.channelId ?? "")}
                >
                  {data.channelName}
                </MenuItem>
              );
          })}
        </Menu>
      </GridToolbarContainer>
    );
  };

  return (
    <Wrapper breadcrumb={crumbs} error={false} loading={loading}>
      <DocumentTitleSetter title="Leads | CFS Portal" />
      <div className="agent-subscribers-container">
        <Title title="Leads" subtitle="List of your leads">
          <MUIButton
            onClick={() => setChannelDrawerOpen(true)}
            variant="contained"
            style={{ marginRight: 10 }}
          >
            Channels
          </MUIButton>
          <MUIButton
            onClick={() => handleCopyToClipboard()}
            variant="contained"
            style={{ marginRight: 10 }}
          >
            Copy Subscriber Registration Link
          </MUIButton>
          <MUIButton
            onClick={() => handleCopyToClipboardTrial()}
            variant="contained"
          >
            Copy Free 30 days Trial Registration Link
          </MUIButton>
        </Title>
        <div className="agent-subscribers-table">
          <div style={{ width: "100%" }}>
            <NoInformationToDisplay
              showNoInfo={!filteredRows?.length}
              title={
                isFreeTrial
                  ? "You don't have access in this page"
                  : "You don't have any leads yet"
              }
              message={
                isFreeTrial ? (
                  <button onClick={() => setOpenDrawer(true)}>
                    Click here to upgrade to agent pro
                  </button>
                ) : (
                  <p>
                    Generate leads by sending email templates or sharing events.
                  </p>
                )
              }
            >
              <DataGrid
                rows={filteredRows || []}
                columns={columns}
                slots={{ toolbar: FilteredGridToolbar }}
                isRowSelectable={(params: GridRowParams) =>
                  params.row.quantity < 1
                }
                initialState={{
                  columns: {
                    columnVisibilityModel: {
                      channelsValue: false,
                    },
                  },
                }}
              />
            </NoInformationToDisplay>
          </div>
        </div>
      </div>
      {loading || isLoading ? <Spinner variant="fixed" /> : null}
      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      >
        <Pricing />
      </Drawer>
      <div className="dialog-container">
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            <h2>Delete Confirmation</h2>
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <h2>Are you sure you want to delete this one?</h2>
              <i style={{ color: "#ed3e4b", fontSize: "11px" }}>
                Actions cannot be reverted once done.
              </i>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <button
              onClick={() => handlers.delete(activeId)}
              style={{
                border: "1px solid #000",
                width: "80px",
                background: "#1565d8",
                color: "#fff",
                padding: ".5rem ",
                borderRadius: "5px",
                margin: "1rem .5rem",
              }}
            >
              Yes
            </button>
            <button
              onClick={() => setOpen(false)}
              style={{
                border: "1px solid #000",
                width: "80px",
                background: "#ed3e4b",
                color: "#fff",
                padding: ".5rem ",
                borderRadius: "5px",
                margin: "1rem .5rem",
              }}
            >
              No
            </button>
          </DialogActions>
        </Dialog>
      </div>
      <React.Fragment>
        <ChannelDrawer
          title="Channels"
          subtitle="List of your channels"
          open={channelDrawerOpen}
          onClose={() => setChannelDrawerOpen(false)}
        />
        <ChannelDrawer
          type="DYNAMIC"
          title={activeChannel.channelName}
          leadUserGuid={activeChannel.leadUserGuid}
          channels={activeChannel.channels}
          subtitle="Channels of this lead"
          open={leadDrawerOpen}
          onClose={() => setLeadDrawerOpen(false)}
        />
      </React.Fragment>
    </Wrapper>
  );
};

export default AgentSubscribers;
