import axios, { AxiosResponse } from "axios";
import { LandingPageData } from "admin/models/landingPageModels";
import getUserToken from "helpers/getUserToken";
import { RegisteredUserData } from "admin/pages/LandingPage/LandingPageInfo";
import { AgentData } from "admin/models/agentModels";
import { ContractingData } from "admin/models/contractingModel";
import {
  EmailMarketingData,
  EmailTemplateData,
  EmailTemplateDataSubscriber,
  EmailTemplateParameter,
} from "admin/models/emailMarketing";

import { AgentSubscriberData } from "admin/models/agentSubscribersModel";
import {
  LoginUsingCodeData,
  LoginUsingEmailData,
} from "admin/models/loginModel";
import {
  MerchandiseBody,
  MerchandiseData,
  MerchandiseResData,
  MerchandiseRedeemBody,
} from "admin/models/merchandiseModel";
import { PointsData } from "admin/models/pointsModels";
import { SubscriberMainData } from "admin/models/subscriberModel";
import { OrdersData } from "admin/models/ordersModels";
import Event, { EventBody, ResponseMessage } from "admin/models/eventModel";
import { RSVPData } from "admin/models/rsvpModel";
import { Contacts as ContactsData } from "admin/models/contactsModel";
import { SubscriptionData } from "admin/models/subscriptionModel";
import Channels from "./channelServices/channelServices";
import Categories from "./categoryServices/categoryService";

const sleep = (delay: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};

axios.interceptors.response.use(async (response) => {
  try {
    await sleep(1000);
    return response;
  } catch (err) {
    console.log(err);
    return await Promise.reject(err);
  }
});

axios.interceptors.request.use((config) => {
  const token = getUserToken();
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

export const requests = {
  get: <T>(url: string) => axios.get<T>(url).then(responseBody),
  post: <T>(url: string, body: {}) =>
    axios.post<T>(url, body).then(responseBody),
  put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
  del: <T>(url: string) => axios.delete<T>(url).then(responseBody),
};

const LandingPage = {
  list: () => requests.get<LandingPageData[] | undefined>("/api/landing-page"),
  listDetail: (pageId: string) =>
    requests.get<LandingPageData | undefined>(`/api/landing-page/${pageId}`),
};

const LandingPageRegisteredUsers = {
  listAllRegisteredUsers: () =>
    requests.get<RegisteredUserData[] | undefined>(
      `/api/landing-page-registered-users/`
    ),
  list: (pageId: string) =>
    requests.get<RegisteredUserData[] | undefined>(
      `/api/landing-page-registered-users/${pageId}`
    ),
  activate: (pageId: string, userGuid: string) => {
    requests.post(
      `/api/landing-page-registered-users/${userGuid}/${pageId}/activate`,
      {}
    );
  },
  deactivate: (pageId: string, userGuid: string) => {
    requests.post(
      `/api/landing-page-registered-users/${userGuid}/${pageId}/deactivate`,
      {}
    );
  },
};

const Agents = {
  agentInformation: (userGuid: string) =>
    requests.get<AgentData | undefined>(`/api/agents/${userGuid}`),
  deleteAgent: (userGuid: string) =>
    requests.del<string>(`/api/agents/${userGuid}`),
};

const Contracting = {
  requestContract: (body: ContractingData) => {
    axios.interceptors.request.use((config) => {
      const token = getUserToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
        config.headers["Content-Type"] = "multipart/form-data";
      }
      return config;
    });
    const res = requests.post<string>("/api/contracting/", body);

    return res;
  },
};

const Profile = {
  forgotPassword: (emailAddress: string) => {
    const res = requests.post<AgentSubscriberData[] | undefined>(
      `/api/users/email-check/account`,
      { emailAddress }
    );

    return res;
  },
  unsubscribe: (userGuid: string, password: string) =>
    requests.put<string>("/api/users/unsubscribe", {
      userGuid,
      password,
    }),

  changePassword: (
    passwordId: string,
    password: string,
    confirmPassword: string
  ) => {
    const res = requests.post<string>(`/api/users/change-password/account`, {
      password,
      passwordId,
      confirmPassword,
    });

    return res;
  },
};

const AgentSubscribers = {
  getAgentSubscriber: () => {
    const res = requests.get<AgentSubscriberData[] | undefined>(
      `/api/subscriberaccounts/`
    );

    return res;
  },
  deleteAgentSubsriber: (userGuid: string) => {
    const res = requests.del(`/api/subscriberaccounts/user/${userGuid}`);

    return res;
  },
};

const EmailMarketing = {
  sendEmail: (body: EmailMarketingData) => {
    const res = requests.post<string>("/api/email-marketing/", body);

    return res;
  },
  getEmailTemplates: (userGuid: string) => {
    const res = requests.get<EmailTemplateData[] | undefined>(
      `/api/email-marketing/template/${userGuid}`
    );

    return res;
  },
  getEmailTemplatesBySubscriber: (userGuid: string) => {
    const res = requests.get<EmailTemplateDataSubscriber | undefined>(
      `/api/email-marketing/template/subscriber/${userGuid}?status=ACTIVATED`
    );

    return res;
  },
  updateEmailTemplate: (
    userGuid: string,
    templateId: string | null,
    params: EmailTemplateParameter
  ) => {
    const res = requests.put<string>(
      `/api/email-marketing/template/${userGuid}/${templateId}`,
      {
        templateName: params.templateName,
        templateBody: params.templateBody,
        templateStatus: params.templateStatus,
        isAddedByMarketing: params.isAddedByMarketing,
        subject: params.subject,
        design: params.design,
        settings: params.settings,
        categories: params.categories,
      }
    );

    return res;
  },
  createEmailTemplate: (userGuid: string, params: EmailTemplateParameter) => {
    const res = requests.post<string>(
      `/api/email-marketing/template/${userGuid}/`,
      {
        templateName: params.templateName,
        templateBody: params.templateBody,
        templateStatus: params.templateStatus,
        isAddedByMarketing: params.isAddedByMarketing,
        subject: params.subject,
        design: params.design,
        settings: params.settings,
        categories: params.categories,
      }
    );
    return res;
  },
  getSingleTemplate: (userGuid: string, templateId: string) => {
    const res = requests.get<EmailTemplateData>(
      `/api/email-marketing/template/${userGuid}/${templateId}`
    );

    return res;
  },
};

const Login = {
  loginUsingEmail: async (emailAddress: string) => {
    const endpoint = "/api/backOffice/login-email";

    try {
      const res = await requests.post<LoginUsingEmailData>(endpoint, {
        emailAddress,
      });

      return res;
    } catch (error) {
      return false;
    }
  },

  loginUsingCode: async (
    emailAddress: string,
    agentCode: string,
    verificationCode: string
  ) => {
    const endpoint = "/api/backOffice/login-code";

    try {
      const res = await requests.post<LoginUsingCodeData>(endpoint, {
        emailAddress,
        verificationCode,
        agentCode,
      });

      return res;
    } catch (error) {
      return false;
    }
  },
};

const Merchandise = {
  getAllMerchandise: () => {
    const res = requests.get<MerchandiseData[] | undefined>(
      `/api/merchandise/`
    );

    return res;
  },
  getSingleMerchandiseById: (id: string) => {
    const res = requests.get<MerchandiseData | undefined>(
      `/api/merchandise/${id}`
    );

    return res;
  },
  addMerchandise: (body: MerchandiseBody) => {
    axios.interceptors.request.use((config) => {
      const token = getUserToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
        config.headers["Content-Type"] = "multipart/form-data";
      }
      return config;
    });

    const res = requests.post<MerchandiseData | undefined>(
      `/api/merchandise/`,
      body
    );

    return res;
  },
  editMerchandise: (id: string, body: MerchandiseBody) => {
    axios.interceptors.request.use((config) => {
      const token = getUserToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
        config.headers["Content-Type"] = "multipart/form-data";
      }
      return config;
    });

    const res = requests.put<MerchandiseData>(
      `/api/merchandise/details/${id}`,
      body
    );

    return res;
  },
  deleteMerchandise: async (id: string) => {
    const res = await requests.del<MerchandiseResData>(
      `/api/merchandise/${id}`
    );

    if (res.success) {
      return res;
    } else {
      return false;
    }
  },
  submitMerchandise: async (
    merchandiseId: string,
    body: MerchandiseRedeemBody
  ) => {
    const res = await requests
      .post<MerchandiseResData>(
        `/api/merchandise/redeem-merch/${merchandiseId}`,
        body
      )
      .catch((error) => {
        return {
          message: error?.response?.data,
          success: false,
        };
      });

    return res;
  },
};

const Points = {
  getPointsByUserGuid: (userGuid: string) => {
    const res = requests.get<PointsData | undefined>(`/api/points/${userGuid}`);

    return res;
  },
  getSubscribersByUserGuid: (userGuid: string) => {
    const res = requests.get<SubscriberMainData | undefined>(
      `/api/points/subscribers/${userGuid}`
    );

    return res;
  },
};

const Orders = {
  getOrdersByUserGuid: (userGuid: string) => {
    const res = requests.get<OrdersData[] | undefined>(
      `/api/orders/${userGuid}`
    );

    return res;
  },
};

const RaiseSupport = {
  resolveTicket: (id: string, body: { status: string }) => {
    const res = requests.put<string>(`/api/raise-support/${id}`, body);
    return res;
  },
};

const TrialSubscription = {
  getTrialSubscriptions: () => {
    const res = requests.get<string>(`/api/portal-subscription/free-trial`);
    return res;
  },
  getTrialNumberOfDays: (userGuid: string) => {
    const res = requests.get<{
      remainingDays: number;
      expirationDate: string;
    }>(`/api/portal-subscription/free-trial/${userGuid}`);
    return res;
  },
};

const Subscriptions = {
  getAgentCode: (userGuid: string) => {
    const res = requests.get<SubscriptionData>(
      `/api/subscriptions/hierarchy-code/${userGuid}`
    );
    return res;
  },
};

const Events = {
  getEvents: (userGuid: string) => {
    try {
      const res = requests.get<Event[]>(`/api/events?userGuid=${userGuid}`);
      return res;
    } catch (error) {
      console.log(error);
    }
  },
  getSingleEvent: (eventId: string) => {
    const res = requests.get<Event | undefined>(`/api/events/${eventId}`);
    return res;
  },
  createEvent: (body: EventBody) => {
    axios.interceptors.request.use((config) => {
      const token = getUserToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
        config.headers["Content-Type"] = "multipart/form-data";
      }
      return config;
    });
    const res = requests.post<ResponseMessage>(`/api/events/`, body);
    return res;
  },
  updateEvent: (eventId: string, body: EventBody) => {
    axios.interceptors.request.use((config) => {
      const token = getUserToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
        config.headers["Content-Type"] = "multipart/form-data";
      }
      return config;
    });
    const res = requests.put<ResponseMessage>(`/api/events/${eventId}`, body);
    return res;
  },
  deleteEvent: (eventId: string) => {
    axios.interceptors.request.use((config) => {
      const token = getUserToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
        config.headers["Content-Type"] = "multipart/form-data";
      }
      return config;
    });
    const res = requests.del<ResponseMessage>(`/api/events/${eventId}`);
    return res;
  },
};

const RSVP = {
  getEventRsvps: (eventId: string) => {
    const res = requests.get<RSVPData[] | undefined>(
      `/api/rsvp-event/${eventId}`
    );
    return res;
  },
};

const Contacts = {
  getMailingList: async (userGuid: string) => {
    const res = await requests.get<ContactsData[]>(
      `/api/contacts/mailing-list/${userGuid}`
    );
    return res;
  },
  create: async (data: ContactsData) => {
    const res = axios.post(`/api/contacts/mailing-list/${data.userGuid}`, {
      emailAddress: data.emailAddress,
    });
    return res;
  },
  delete: async (contactId: string) => {
    const res = axios.delete(`/api/contacts/mailing-list/${contactId}`);
    return res;
  },
  getRecentContact: async (userGuid: string) => {
    const res = await axios.get(`/api/contacts/recent/${userGuid}`);
    return res.data;
  },
  addRecentContact: async (userGuid: string, label: string) => {
    try {
      const res = await axios.post(`/api/contacts/recent`, { userGuid, label });
      return res.data;
    } catch (error) {
      console.error(`Error adding recent contact for ${label}:`, error);
      throw error;
    }
  },
};

const agent = {
  ...Channels,
  ...Categories,
  LandingPage,
  LandingPageRegisteredUsers,
  Agents,
  Contracting,
  EmailMarketing,
  AgentSubscribers,
  Login,
  Merchandise,
  Profile,
  Points,
  Orders,
  RaiseSupport,
  TrialSubscription,
  Events,
  RSVP,
  Contacts,
  Subscriptions,
};

export default agent;
