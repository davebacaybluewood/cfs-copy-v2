import { RouteProps } from "react-router-dom";
import US_STATES from "./statesAndLocation";
import InvalidRoutePage from "pages/SingleBlogPage/InvalidRoutePage";
import AboutUs from "pages/AboutUs/AboutUs";
import AgentSupport from "pages/AgentSupport/AgentSupport";
import BlogPage from "pages/BlogPage/BlogPage";
import BusinessProtection from "pages/BusinessProtection/BusinessProtection";
import ContactPage from "pages/ContactPage/ContactPage";
import FamilyProtection from "pages/FamilyProtection/FamilyProtection";
import Home from "pages/Home/Home";
import SingleBlogPage from "pages/SingleBlogPage/SingleBlogPage";
import Solutions from "pages/Solutions/Solutions";
import { adminRoutes } from "admin/constants/constants";
import { paths } from "./routes";
import PortalRegistration from "pages/PortalRegistration/PortalRegistration";
import Events from "pages/Events/Events";
import InvalidRoute from "layout/InvalidRoute/InvalidRoute";
import LandingPages from "pages/LandingPages/LandingPages";
import Agents from "pages/Agents/Agents";
import { ToastOptions } from "react-toastify";
import Calculator from "admin/pages/CommissionSimulation/Calculator";
import AgentWebinar from "pages/Agents/AgentWebinar";
import AgentAppointment from "pages/Agents/AgentAppointment";
import Portal from "pages/Portal/Portal";
import TestimonialForm from "pages/TestimonialForm/TestimonialForm";
import PreLicensing from "pages/Contract/components/PreLicensing";
import Annuity from "pages/Contract/components/Annuity";
import Pricing from "pages/Pricing/Pricing";
import Subscribe from "pages/Subscribers/Subscribe";
import SubscribeSuccess from "pages/Subscribers/SubscribeSuccess";
import RSVPForm from "pages/RSVP/RSVPForm";
import MessagePage from "pages/ThanksPage/MessagePage";
import PortalArticle from "pages/PortalArticle/PortalArticle";
import TreeDiagram from "admin/pages/TreeDiagram/TreeDiagram";
import Registration from "events/mission/Registration/Registration";
import Missions from "events/mission/Mission/Missions";
import AgentMissionModal from "events/mission/components/modal/AgentMissionModal";
import Rewards from "events/mission/Rewards/Rewards";
import NATIONALITIES from "./nationalities";
import MyWebPage from "pages/MyWebPage/MyWebPage";
import AALogin from "../events/mission/AALogin/AALogin";
import ClaimReward from "events/mission/ClaimReward/ClaimReward";
import WebinarPage from "pages/MyWebPage/components/WebinarPage";
import ContactEmailForm from "pages/ContactEmailForm/ContactEmailForm";
import HomeV2 from "pages/Home/HomeV2";
import SubscriberRegistration from "pages/LandingPages/pages/SubscriberRegistration/SubscriberRegistration";
import SuccessPage from "pages/LandingPages/pages/RegistrationSuccessPage/SuccessPage";

type ReactRoutesType = RouteProps & {
  showFooter?: boolean;
  showNavbar?: boolean;
  showHeadline?: boolean;
  theme?: "SKY" | "RED" | "NAVY" | "WHITE";
  showPartners?: boolean;
};

const COMPANY_NAME = "Comfort Financial Solutions";

//const MAIN_LOCALHOST = "https://www.comfortfinancialsolutions.com";
const MAIN_LOCALHOST = "http://lcoalhost:3000";

const SOCIAL_MEDIA_LINKS = {
  FACEBOOK: "https://www.facebook.com/gocfspro",
  TWITTER: "https://twitter.com/goCFSpro",
  INSTAGRAM: "https://www.instagram.com/gocfspro/",
  LINKEDIN: "https://www.linkedin.com/company/gocfspro",

  /*These Links are dummy, actual links are to be followed by the marketing team */
  PINTEREST: "https://www.pinterest.ph/",
  TIKTOK: "https://www.tiktok.com/en/",
  YOUTUBE: "https://www.youtube.com/",
};

const COMPANY_CONTACT_INFO = {
  EMAIL: "support@gocfs.pro",
  PHONE: "+1 (702) 900-5666",
  STATE_NV: "Las Vegas, NV",
  STATE_CA: "Los Angeles, CA",
  STATE_NY: "New York, NY",
};

const MAIN_IMAGES = {
  WHITE_LOGO: "/assets/images/logos/logo-white.png",
  MAIN_LOGO: "/assets/images/logos/cfs-main-logo.png",
};

const AGENT_MISSION_IMAGES = {
  BACKGROUND: "/assets/images/agent-mission/modal-bg.png",
  AGENT: "/assets/images/agent-mission/agent.png",
  USER: "/assets/images/agent-mission/circle-user-solid.png",
};

const CFS_STATES = US_STATES.map((data) => {
  return {
    label: data.name,
    value: data.name,
  };
});

const CFS_NATIONALITIES = NATIONALITIES.map((data) => {
  return {
    label: data.Nationality,
    value: data.Nationality,
  };
});

const NOTIFICATION_ENUMS = {
  WEBINARS: {
    WEBINAR_REQUEST: "WEBINAR_REQUEST",
    WEBINAR_DECLINED: "WEBINAR_DECLINED",
    WEBINAR_APPROVED: "WEBINAR_APPROVED",
  },
  APPOINTMENTS: {
    APPOINTMENT_CANCELLED: "APPOINTMENT_CANCELLED",
    APPOINTMENT_NEW: "APPOINTMENT_NEW",
  },
  BLOGS: {
    BLOGS_REQUEST: "BLOGS_REQUEST",
    BLOGS_DRAFT: "BLOGS_DRAFT",
    BLOGS_PUBLISHED: "BLOGS_PUBLISHED",
    BLOGS_DECLINED: "BLOGS_DECLINED",
  },
};
const CURRENT_DOMAIN = window.location.origin;

const AGENT_SPECIALTIES = [
  "Wealth Builder",
  "Financial Freedom",
  "Long Term Care",
  "Legacy Builder",
];

const BLANK_VALUE = "—";

const eventSteps = [
  {
    title: "01",
    subTitle: "Pick a Event",
    description: "",
  },
  {
    title: "02",
    subTitle: "Submit a form",
    description: "",
  },
  {
    title: "03",
    subTitle: "Get the reference ID",
    description: "",
  },
  {
    title: "04",
    subTitle: "Mark your calendars!",
    description: "",
  },
];

export const toastConfigs: ToastOptions<{}> | undefined = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
};

const filteredAdminRoutes: ReactRoutesType[] = adminRoutes.map((data) => {
  return {
    ...data,
    showFooter: false,
    showHeadline: false,
    showNavbar: false,
  };
});

const REACT_ROUTES: ReactRoutesType[] = [
  ...filteredAdminRoutes,
  {
    element: <Home key="main-index" />,
    path: paths.index,
    showPartners: true,
  },
  {
    element: <Home key="index" />,
    path: paths.home,
    showPartners: true,
  },
  // {
  //   element: <HomeV2 key="main-index" />,
  //   path: paths.index,
  //   showPartners: true,
  // },
  // {
  //   element: <Home key="index" />,
  //   path: paths.home,
  //   showPartners: true,
  // },
  {
    element: <HomeV2 key="main-index" />,
    path: paths.index,
    showPartners: false,
    showHeadline: false,
    theme: "WHITE",
  },
  {
    element: <HomeV2 key="index" />,
    path: paths.home,
    showPartners: false,
    showHeadline: false,
    theme: "WHITE",
  },
  {
    element: <PortalArticle />,
    path: paths.portalArticle,
    showHeadline: false,
    showFooter: true,
  },
  {
    element: (
      <AgentMissionModal
        openModal={true}
        showModal={() => {}}
        onClick={() => {}}
        agentName="Black Noir"
      />
    ),
    path: paths.tmpModal,
    showFooter: false,
    showHeadline: false,
    showNavbar: false,
  },
  {
    element: <Rewards />,
    path: paths.rewards,
    showFooter: false,
    showHeadline: false,
    showNavbar: false,
  },
  {
    element: <ClaimReward />,
    path: paths.aaClaimReward,
    showFooter: false,
    showHeadline: false,
    showNavbar: false,
  },
  {
    element: <TreeDiagram />,
    path: paths.treeDiagram,
    showHeadline: false,
    showFooter: false,
    showNavbar: false,
  },
  {
    element: <FamilyProtection />,
    path: paths.family_protection,
  },
  {
    element: <BusinessProtection />,
    path: paths.individual_protection,
    showHeadline: false,
    theme: "SKY",
  },
  {
    element: <AgentSupport />,
    path: paths.join_our_team,
    showHeadline: false,
    theme: "RED",
  },
  {
    element: <BlogPage />,
    path: paths.resources,
  },
  {
    element: <AboutUs />,
    path: paths.about_us,
  },
  {
    element: <Solutions />,
    path: paths.solutions,
  },
  {
    element: <Events />,
    path: paths.events,
    showHeadline: true,
  },
  {
    element: <ContactPage />,
    path: paths.contact_us,
  },
  {
    element: <SingleBlogPage />,
    path: paths.single_blog,
    showNavbar: true,
    showHeadline: false,
    showFooter: true,
  },
  {
    element: <PortalRegistration />,
    path: paths.portalRegistration,
    showNavbar: false,
    showHeadline: false,
    showFooter: false,
  },
  {
    path: paths.cfsPages,
    element: <LandingPages key="main" />,
    showNavbar: false,
    showHeadline: false,
    showFooter: false,
  },
  {
    path: paths.cfsPagesWithAgent,
    element: <LandingPages key="agent" />,
    showNavbar: false,
    showHeadline: false,
    showFooter: false,
  },
  {
    path: paths.agent_with_id,
    element: <Agents />,
  },
  {
    path: paths.webinarAppointment,
    element: <AgentAppointment showForm={false} />,
  },
  {
    path: paths.webinarForm,
    element: <AgentWebinar showCalendly={false} />,
  },
  {
    element: <Calculator />,
    path: "/calculator",
    showHeadline: false,
    showFooter: false,
    showNavbar: false,
  },
  {
    element: <PreLicensing />,
    path: "/pre-licensing",
    showHeadline: false,
    showFooter: false,
    showNavbar: false,
  },
  {
    element: <Annuity />,
    path: "/annuity",
    showHeadline: false,
    showFooter: false,
    showNavbar: false,
  },
  {
    element: <Portal />,
    path: paths.portal,
  },
  {
    element: <TestimonialForm />,
    path: paths.testimonialForm,
    showHeadline: false,
    showFooter: false,
    showNavbar: false,
  },
  {
    element: <ContactEmailForm />,
    path: paths.contactEmailForm,
    showHeadline: false,
    showFooter: false,
    showNavbar: false,
  },
  {
    element: <RSVPForm />,
    path: paths.rsvpForm,
    showHeadline: false,
    showFooter: false,
    showNavbar: false,
  },
  {
    element: <Pricing />,
    path: paths.pricing,
    showHeadline: false,
    showFooter: true,
    showNavbar: true,
  },
  {
    element: <Subscribe />,
    path: paths.subscriberRegistration,
    showHeadline: false,
    showFooter: false,
    showNavbar: false,
  },
  {
    element: <SubscribeSuccess />,
    path: paths.subscribeSuccess,
    showHeadline: false,
    showFooter: false,
    showNavbar: false,
  },
  {
    element: <MessagePage />,
    path: paths.unsubscribe,
    showHeadline: true,
    showFooter: true,
    showNavbar: true,
  },
  {
    element: <InvalidRoutePage />,
    path: paths.invalid,
    showHeadline: false,
    showFooter: true,
  },
  {
    element: <InvalidRoute />,
    path: "*",
    showNavbar: true,
    showHeadline: false,
    showFooter: true,
  },
  /* Mission MicroPages */
  {
    element: <Registration />,
    path: paths.registrationMission,
    showNavbar: false,
    showHeadline: false,
    showFooter: false,
  },
  {
    element: <Missions />,
    path: paths.missions,
    showNavbar: false,
    showHeadline: false,
    showFooter: false,
  },

  /* My Web Page */
  {
    element: <MyWebPage />,
    path: paths.myWebPage,
    showNavbar: false,
    showHeadline: false,
    showFooter: false,
  },
  {
    element: <WebinarPage />,
    path: paths.webinarPage,
    showNavbar: true,
    showHeadline: false,
    showFooter: true,
  },
  {
    element: <AALogin />,
    path: paths.aaLogin,
    showNavbar: false,
    showHeadline: false,
    showFooter: false,
  },
  {
    element: <SubscriberRegistration />,
    path: paths.subRegLandingPage,
    showNavbar: true,
    showHeadline: false,
    showFooter: true,
  },
  {
    element: <SuccessPage />,
    path: paths.regSuccessPage,
    showNavbar: true,
    showHeadline: false,
    showFooter: true,
  },
];

const CALENDLY = {
  CONSULTATION: "https://calendly.com/gocfs/cfs-consultation",
  WEEKLY: "https://calendly.com/gocfs/one-time-weekly-meeting",
};

const SUPPORT_TYPE = { FEATURE: "feature", BUG: "bug", OTHER: "other" };
const SUPPORT_STATUS = { PENDING: "PENDING", RESOLVED: "RESOLVED" };

const DEFAULT_AA_AVATAR = "/assets/images/agent-mission/agent-black.png";

const TWITTER_LOGO = ({
  width,
  height,
  viewBox,
  reactX,
  reactY,
  reactWidth,
  reactHeight,
  reactFill,
  pathFill,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox={viewBox}
    >
      <rect
        x={reactX}
        y={reactY}
        width={reactWidth}
        height={reactHeight}
        fill={reactFill}
        stroke="none"
      />
      <path
        fill={pathFill}
        d="M18.205 2.25h3.308l-7.227 8.26l8.502 11.24H16.13l-5.214-6.817L4.95 21.75H1.64l7.73-8.835L1.215 2.25H8.04l4.713 6.231l5.45-6.231Zm-1.161 17.52h1.833L7.045 4.126H5.078L17.044 19.77Z"
      />
    </svg>
  );
};
export {
  COMPANY_NAME,
  SOCIAL_MEDIA_LINKS,
  MAIN_IMAGES,
  CFS_STATES,
  CFS_NATIONALITIES,
  AGENT_SPECIALTIES,
  CURRENT_DOMAIN,
  NOTIFICATION_ENUMS,
  BLANK_VALUE,
  REACT_ROUTES,
  CALENDLY,
  COMPANY_CONTACT_INFO,
  eventSteps,
  MAIN_LOCALHOST,
  SUPPORT_TYPE,
  SUPPORT_STATUS,
  TWITTER_LOGO,
  DEFAULT_AA_AVATAR,
  AGENT_MISSION_IMAGES,
};
