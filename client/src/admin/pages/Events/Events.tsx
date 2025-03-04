import {
  Button,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import Title from "admin/components/Title/Title";
import Wrapper from "admin/components/Wrapper/Wrapper";
import { paths } from "constants/routes";
import React, { memo, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CrumbTypes } from "../Dashboard/types";
import {
  DataGrid,
  GridColDef,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import { BiFilterAlt } from "react-icons/bi";
import EventsData from "admin/models/eventModel";
import "./Events.scss";
import { UserContext } from "admin/context/UserProvider";
import useFetchEvents from "./hooks/useFetchEvents";
import { HiOutlineTrash } from "react-icons/hi";
import useFetchUserProfile from "admin/hooks/useFetchProfile";
import { PROFILE_ROLES } from "pages/PortalRegistration/constants";
import Spinner from "library/Spinner/Spinner";
import { formatISODateOnly } from "helpers/date";
import { MdOutlineRsvp } from "react-icons/md";
import { FaCopy, FaPen, FaShare } from "react-icons/fa";
import agent from "admin/api/agent";
import { toast } from "react-toastify";
import Event from "admin/models/eventModel";
import generateRandomChars from "helpers/generateRandomChars";
import { useCopyToClipboard } from "../../hooks/useCopyToClipboard";
import NoInformationToDisplay from "library/NoInformationToDisplay/NoInformationToDisplay";
import DocumentTitleSetter from "library/DocumentTitleSetter/DocumentTitleSetter";

const crumbs: CrumbTypes[] = [
  {
    title: "Comfort Financial Solutions",
    url: paths.dashboard,
    isActive: false,
  },
  {
    title: "Events",
    url: paths.newAdminEvents,
    isActive: true,
  },
];
const columns: GridColDef[] = [
  {
    field: "title",
    headerName: "Title",
    width: 200,
    renderCell: (params) => params.value,
  },
  {
    field: "eventDate",
    headerName: "Event Date",
    width: 200,
    renderCell: (params) => params.value,
    filterable: false,
  },
  {
    field: "authorName",
    headerName: "Author Name",
    width: 200,
    renderCell: (params) => params.value,
  },
  {
    field: "noOfAttendees",
    headerName: "Attendees",
    width: 200,
    renderCell: (params) => params.value,
    filterable: false,
  },
  {
    field: "status",
    headerName: "Status",
    width: 200,
    renderCell: (params) => params.value,
    filterable: false,
  },
  {
    field: "actions",
    headerName: "Actions",
    width: 500,
    renderCell: (params) => params.value,
    filterable: false,
  },
];

const Events: React.FC = () => {
  const navigate = useNavigate();
  const userCtx = useContext(UserContext) as any;
  const userGuid = userCtx?.user?.userGuid;
  const { profile } = useFetchUserProfile(userCtx?.user?.userGuid ?? "");
  const { eventRows } = useFetchEvents(userGuid);
  const [clipboardValue, setClipboardValue] = useCopyToClipboard();

  const [loading, setLoading] = useState<boolean>(false);
  const [dialogConfig, setDialogConfig] = useState({
    id: "",
    isOpen: false,
    message: "",
  });
  const [pageEventRows, setPageEventRows] = useState<Event[] | undefined>();

  const isAdmin = profile?.roles?.some((f) => {
    return f.value === PROFILE_ROLES.MASTER_ADMIN.ROLE_MASTER_ADMIN.value;
  });
  const isAgent = profile?.roles?.some((f) => {
    return (
      f.value === PROFILE_ROLES.AGENT.ROLE_ASSOCIATE.value ||
      f.value === PROFILE_ROLES.AGENT.ROLE_ASSOCIATE.value ||
      f.value === PROFILE_ROLES.AGENT.ROLE_EXECUTIVE_MARKETING_DIRECTOR.value ||
      f.value === PROFILE_ROLES.AGENT.ROLE_EXECUTIVE_VICE_PRESIDENT.value ||
      f.value === PROFILE_ROLES.AGENT.ROLE_MARKETING_DIRECTOR.value ||
      f.value === PROFILE_ROLES.AGENT.ROLE_SENIOR_ASSOCIATE.value ||
      f.value === PROFILE_ROLES.AGENT.ROLE_SENIOR_EXECUTIVE_MARKETING.value ||
      f.value === PROFILE_ROLES.AGENT.ROLE_SENIOR_MARKETING_DIRECTOR.value ||
      f.value === PROFILE_ROLES.AGENT.ROLE_TRAINING_ASSOCIATE.value
    );
  });

  const isSubscriber = profile?.roles?.some((f) => {
    return f.value === PROFILE_ROLES.SUBSCRIBER.ROLE_SUBSRIBER.value;
  });

  const isFreeTrial = profile?.roles?.some((f) => {
    return (
      f.value === PROFILE_ROLES.FREE_30DAYS_TRIAL.ROLE_FREE_30DAYS_TRIAL.value
    );
  });

  useEffect(() => {
    setLoading(true);
    const getEvents = async () => {
      const data = await agent.Events.getEvents(userGuid);
      setPageEventRows(data);
      setLoading(false);
    };

    getEvents();
  }, [userGuid]);

  const FilteredGridToolbar = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
      console.log(pageEventRows);
    };
    const handleFilterStatus = (status: string) => {
      const modifiedStatus = status.toUpperCase();

      setPageEventRows((prevState) => {
        const filteredData = eventRows?.filter(
          (data) => data.status.toUpperCase() === modifiedStatus
        );

        return status === "All" ? eventRows : filteredData;
      });
      setAnchorEl(null);
    };

    const status = [
      {
        text: "All",
        value: "All",
      },
      {
        text: "Active",
        value: "ACTIVE",
      },
      {
        text: "Coming Soon",
        value: "COMING_SOON",
      },
      {
        text: "Completed",
        value: "COMPLETED",
      },
    ];
    return (
      <GridToolbarContainer className="custom-toolbar">
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />

        <Button onClick={handleClick} className="filter-status-btn">
          <BiFilterAlt />
          Filter by Status
        </Button>

        <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
          {status.map((s, index) => {
            return (
              <MenuItem key={index} onClick={() => handleFilterStatus(s.value)}>
                {s.text}
              </MenuItem>
            );
          })}
        </Menu>
      </GridToolbarContainer>
    );
  };

  const eventDataRows = pageEventRows?.map((event) => {
    const modifiedData = {
      id: event._id,
      title: event.title,
      eventDate: formatISODateOnly(event.eventDate),
      content: event.content,
      design: event.design,
      status: (
        <span className="capitalize-first">
          {event.status === "COMING_SOON" ? "Coming Soon" : event.status}
        </span>
      ),
      authorName: event.authorFirstName + " " + event.authorLastName,
      noOfAttendees: event.rsvps.noOfAtendees,
    };

    const agentAndAdminRows = {
      ...modifiedData,
      actions: (
        <React.Fragment>
          {isAdmin ? (
            <button
              className="select-btn"
              onClick={() =>
                navigate(paths.rsvpLanding.replace(":eventId", event._id))
              }
            >
              <span>RSVPs</span> <MdOutlineRsvp />
            </button>
          ) : null}
          <button
            className="select-btn"
            onClick={() => {
              setClipboardValue(
                window.location.host +
                  paths.rsvpForm.replace(":eventId", event._id) +
                  `?userGuid=${userGuid}`
              );
              toast("Link copied to Clipboard");
            }}
          >
            <span>Copy Link</span> <FaCopy />
          </button>
          {isAdmin || isAgent ? (
            <React.Fragment>
              <button
                className="select-btn"
                disabled={isAgent && userGuid !== event.userGuid}
                onClick={() =>
                  navigate(
                    paths.newAdminEventsForm +
                      `?action=edit&eventId=${event._id}`
                  )
                }
              >
                <span>Edit</span> <FaPen />
              </button>
              <button
                className="select-btn danger"
                disabled={isAgent && userGuid !== event.userGuid}
                onClick={() =>
                  setDialogConfig({
                    id: event._id,
                    isOpen: true,
                    message: "Are you sure you want to delete this event?",
                  })
                }
              >
                <span>Delete</span> <HiOutlineTrash />
              </button>
            </React.Fragment>
          ) : null}
        </React.Fragment>
      ),
    };

    const subscriberRows = {
      ...modifiedData,
      actions: (
        <React.Fragment>
          <button
            className="select-btn"
            onClick={() => {
              setClipboardValue(
                window.location.host +
                  paths.rsvpForm.replace(":eventId", event._id) +
                  `?userGuid=${userGuid}`
              );
              toast("Link copied to Clipboard");
            }}
          >
            <span>Copy Link</span> <FaCopy />
          </button>
        </React.Fragment>
      ),
    };

    return isAdmin || isAgent || isFreeTrial
      ? agentAndAdminRows
      : isSubscriber
      ? subscriberRows
      : [];
  });

  const deleteHandler = async (eventId: string) => {
    setLoading(true);
    const res = await agent.Events.deleteEvent(dialogConfig.id);

    if (res) {
      setPageEventRows((prevState) =>
        prevState?.filter((data) => data._id !== eventId)
      );
      setLoading(false);
      setDialogConfig({
        id: "",
        isOpen: false,
        message: "",
      });
      toast.success(`Event has been deleted.`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  return (
    <Wrapper
      breadcrumb={crumbs}
      error={false}
      loading={false}
      className="event-admin-wrapper"
    >
      <DocumentTitleSetter title="Events | CFS Portal" />
      <div className="events-container">
        <Title title="Events" subtitle="List of amazing events">
          {isAdmin || isAgent ? (
            <Button
              onClick={() => navigate(paths.newAdminEventsForm + "?action=add")}
              variant="contained"
            >
              Add Event
            </Button>
          ) : null}
        </Title>

        <div className="events-table">
          <NoInformationToDisplay
            showNoInfo={!eventRows?.length}
            message="No information to display"
            title="No events available."
          >
            <DataGrid
              sx={{
                boxShadow: "0 4px 6px -1px #eee, 0 2px 4px -1px #eee",
                background: "white",
                p: 2,
              }}
              rows={eventDataRows ?? []}
              columns={columns}
              slots={{ toolbar: FilteredGridToolbar }}
            />
          </NoInformationToDisplay>
        </div>
      </div>
      {loading ? <Spinner variant="fixed" /> : null}
      <Dialog
        open={dialogConfig.isOpen}
        onClose={() =>
          setDialogConfig({
            id: "",
            isOpen: false,
            message: "",
          })
        }
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description" fontSize={15}>
            {dialogConfig.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setDialogConfig({
                id: "",
                isOpen: false,
                message: "",
              })
            }
            style={{ fontSize: "13px" }}
          >
            No
          </Button>
          <Button
            onClick={async () => await deleteHandler(dialogConfig.id)}
            autoFocus
            style={{ fontSize: "13px" }}
          >
            Yes, I want to delete this event
          </Button>
        </DialogActions>
      </Dialog>
    </Wrapper>
  )
};

export default memo(Events);
