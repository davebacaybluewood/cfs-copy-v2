import Agents from "../models/agentModel.js";
import Webinars from "../models/webinarModel.js";
import expressAsync from "express-async-handler";
import cloudinary from "../utils/cloudinary.js";
import undefinedValidator from "./helpers/undefinedValidator.js";
import {
  AGENT_STATUSES,
  API_RES_FAIL,
  PROFILE_POSITIONS,
  ROLES,
} from "../constants/constants.js";
import User from "../models/userModel.js";
import { v4 as uuidv4 } from "uuid";
import agentRegistrationSuccess from "../emailTemplates/agent-registration-success.js";
import trialRegistrationSuccess from "../emailTemplates/trial-registration-success.js";
import sendEmail from "../utils/sendNodeMail.js";
import agentApproved from "../emailTemplates/agent-approved.js";
import PreProfile from "../models/preProfileModel.js";
import { AGENT_ROLES } from "../constants/constants.js";
import { registerUserHierarchyAndPoints } from "../services/userServices.js";
import PortalSubscription from "../models/portalSubscription.js";
import nodemailer from "nodemailer";
import EmailTemplate from "../models/emailTemplate.js";
import Hierarchy from "../models/hierarchyModel.js";
import generateString from "../utils/generateString.js";
import mongoose from "mongoose";

/**
 * @desc: Fetch all agents
 * @route: GET /api/agents
 * @acess: Private
 */
const getAgents = expressAsync(async (req, res) => {
  try {
    const status = req.query.status;

    const filteredAgentOptions = {
      role: ROLES.ROLE_AGENT,
      status: status ? status : undefined,
    };

    /** Remove the status key if status is falsy */
    for (let i in filteredAgentOptions) {
      if (!filteredAgentOptions[i]) {
        delete filteredAgentOptions[i];
      }
    }
    // const agents = await Agents.find(filteredAgentOptions);

    const agents = await Agents.find({
      status: status ? status : undefined,
      $or: [{ "roles.value": AGENT_ROLES[0].value }],
    });
    res.json(agents);
  } catch (err) {
    res.status(500).json(API_RES_FAIL(err));
  }
});

/**
 * @desc: Fetch all agent counts
 * @route: GET /api/agent-counts
 * @acess: Private
 */
const getAgentsCount = expressAsync(async (req, res) => {
  try {
    const activeAgents = await Agents.find({
      $or: [
        { "roles.value": AGENT_ROLES[0].value },
        { "roles.value": AGENT_ROLES[1].value },
        { "roles.value": AGENT_ROLES[2].value },
        { "roles.value": AGENT_ROLES[3].value },
        { "roles.value": AGENT_ROLES[4].value },
        { "roles.value": AGENT_ROLES[5].value },
        { "roles.value": AGENT_ROLES[6].value },
        { "roles.value": AGENT_ROLES[7].value },
      ],
      status: AGENT_STATUSES.ACTIVATED,
    });
    const declinedAgents = await Agents.find({
      $or: [
        { "roles.value": AGENT_ROLES[0].value },
        { "roles.value": AGENT_ROLES[1].value },
        { "roles.value": AGENT_ROLES[2].value },
        { "roles.value": AGENT_ROLES[3].value },
        { "roles.value": AGENT_ROLES[4].value },
        { "roles.value": AGENT_ROLES[5].value },
        { "roles.value": AGENT_ROLES[6].value },
        { "roles.value": AGENT_ROLES[7].value },
      ],
      status: AGENT_STATUSES.DECLINED,
    });
    const pendingAgents = await Agents.find({
      $or: [
        { "roles.value": AGENT_ROLES[0].value },
        { "roles.value": AGENT_ROLES[1].value },
        { "roles.value": AGENT_ROLES[2].value },
        { "roles.value": AGENT_ROLES[3].value },
        { "roles.value": AGENT_ROLES[4].value },
        { "roles.value": AGENT_ROLES[5].value },
        { "roles.value": AGENT_ROLES[6].value },
        { "roles.value": AGENT_ROLES[7].value },
      ],
      status: AGENT_STATUSES.PENDING,
    });
    const deactivatedAgents = await Agents.find({
      $or: [
        { "roles.value": AGENT_ROLES[0].value },
        { "roles.value": AGENT_ROLES[1].value },
        { "roles.value": AGENT_ROLES[2].value },
        { "roles.value": AGENT_ROLES[3].value },
        { "roles.value": AGENT_ROLES[4].value },
        { "roles.value": AGENT_ROLES[5].value },
        { "roles.value": AGENT_ROLES[6].value },
        { "roles.value": AGENT_ROLES[7].value },
      ],
      status: AGENT_STATUSES.DEACTIVATED,
    });
    res.json({
      activeAgents: activeAgents.length,
      declinedAgents: declinedAgents.length,
      pendingAgents: pendingAgents.length,
      deactivatedAgents: deactivatedAgents.length,
    });
  } catch (err) {
    res.status(500).json(API_RES_FAIL(err));
  }
});

/**
 * @desc: Fetch single agent
 * @route: GET /api/agents/:id
 * @acess: Private
 */
const getSingleAgent = expressAsync(async (req, res) => {
  try {
    const role = req.query.role;

    if (req.params.id) {
      if (role === ROLES.ROLE_MASTER_ADMIN) {
        const agent = await Agents.find({ userGuid: req.params.id });
        res.json(agent[0]);
      } else {
        const agent = await Agents.aggregate([
          {
            $match: {
              userGuid: req.params.id,
            },
          },
          {
            $project: {
              name: 1,
              userGuid: 1,
              avatar: 1,
              title: 1,
              bio: 1,
              phoneNumber: 1,
              emailAddress: 1,
              address: 1,
              twitter: 1,
              instagram: 1,
              linkedIn: 1,
              facebook: 1,
              password: 1,
              languages: 1,
              role: 1,
              roles: 1,
              status: 1,
              telNumber: 1,
              webinars: 1,
              specialties: 1,
              isDeclined: 1,
              createdAt: 1,
              updatedAt: 1,
              calendlyLink: 1,
              firstName: 1,
              lastName: 1,
              state: 1,
              licenseNumber: 1,
              displayCalendly: 1,
              testimonials: {
                $filter: {
                  input: "$testimonials",
                  cond: {
                    $eq: ["$$this.isDisplayed", true],
                  },
                },
              },
            },
          },
        ]);
        res.json(agent[0]);
      }
    } else {
      res.status(404);
      throw new Error("Agent not found.");
    }
  } catch (err) {
    res.status(500).json(API_RES_FAIL(err));
  }
});

// @desc    Delete a agent
// @route   DELETE /api/agents/:id
// @access  Private/Admin
const deleteAgent = expressAsync(async (req, res) => {
  try {
    const agent = await Agents.deleteOne({
      userGuid: req.params.id,
    });

    await User.deleteOne({
      userGuid: req.params.id,
    });

    if (agent) {
      res.json({ message: "Agent removed." });
    } else {
      res.status(404);
      throw new Error("Agent not found");
    }
  } catch (err) {
    res.status(500).json(API_RES_FAIL(err));
  }
});

// @desc    Update a agent
// @route   PUT /api/agents/update-agent
// @access  Private/Admin
const updateAgent = expressAsync(async (req, res) => {
  try {
    /** Upload avatar to cloudinary */
    let agentImgResult;
    try {
      agentImgResult = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "agent-avatars",
        use_filename: true,
      });
    } catch (error) {
      agentImgResult = req.body.avatar;
    }

    const agent = await Agents.findById(req.body.id);
    const user = await User.findById(agent?.userGuid);

    if (agent) {
      agent.name = undefinedValidator(agent.name, req.body.name);
      agent.bio = undefinedValidator(agent.bio, req.body.bio);
      agent.phoneNumber = undefinedValidator(
        agent.phoneNumber,
        req.body.phoneNumber
      );
      agent.emailAddress = undefinedValidator(
        agent.emailAddress,
        req.body.emailAddress
      );
      agent.address = undefinedValidator(agent.address, req.body.address);
      agent.calendlyLink = undefinedValidator(
        agent.calendlyLink,
        req.body.calendlyLink
      );
      agent.twitter = undefinedValidator(agent.twitter, req.body.twitter);
      agent.instagram = undefinedValidator(agent.instagram, req.body.instagram);
      agent.facebook = undefinedValidator(agent.facebook, req.body.facebook);
      agent.linkedIn = undefinedValidator(agent.linkedIn, req.body.linkedIn);
      agent.discordId = undefinedValidator(agent.discordId, req.body.discordId);
      agent.weChat = undefinedValidator(agent.weChat, req.body.weChat);
      agent.avatar =
        typeof req.body.avatar === "string"
          ? req.body.avatar
          : agentImgResult.secure_url
          ? agentImgResult.secure_url
          : agent.avatar;
      agent.avatar_cloudinary_id = agentImgResult.public_id
        ? agentImgResult.public_id
        : agent.avatar_cloudinary_id;

      console.log({
        req: req.body.emailAddress,
        agent: agent?.emailAddress,
      });
      user.email = req.body.emailAddress;

      const updatedAgent = await agent.save();
      const createdUser = await user.save();
      res.status(201).json(updatedAgent);
    } else {
      res.status(404);
      throw new Error("Agent not found");
    }

    await agent.save();
    res.json(agent);
  } catch (err) {
    console.log(err);
    res.status(404).json(err);
    throw new Error("Error occured in adding agent.");
  }
});

// @desc    Edit the status of the agent
// @route   PUT /api/agent-status/:userGuid
// @access  Private/Admin
const updateAgentStatus = expressAsync(async (req, res) => {
  const agent = await Agents.findById(req.params.id);
  const statusDesired = req.body.status;
  const isPending = statusDesired === AGENT_STATUSES.PENDING ? true : false;
  const calendlyLink = req.body.calendlyLink;

  if (agent) {
    agent.status = req.body.status;
    agent.isDeclined = isPending;
    agent.displayCalendly = req.body.displayCalendly;

    if (calendlyLink) {
      agent.calendlyLink = calendlyLink;
    }

    const user = new User({
      userGuid: agent.userGuid,
      name: agent.firstName + " " + agent.lastName,
      email: agent.emailAddress,
      password: agent.password,
      role: ROLES.ROLE_AGENT,
    });

    if (user && agent) {
      const updatedAgent = await agent.save();

      if (req.body.status === "DEACTIVATED") {
        await User.deleteOne({
          userGuid: agent.userGuid,
        });
      } else {
        await user.save();
      }
    }

    if (req.body.status === AGENT_STATUSES.ACTIVATED) {
      const mailSubject = "CFS Portal Activation";
      const mailContent = agentApproved(agent.emailAddress, agent.password);

      let sendHTMLEmail;
      try {
        sendHTMLEmail = sendEmail(
          agent?.emailAddress,
          mailSubject,
          mailContent,
          []
        )
          .then((request, response) => {
            response?.send(response.message);
          })
          .catch((error) => {
            res.status(500);
            console.log(error);
            throw new Error("Error occured in submission.");
          });
      } catch (error) {
        res.status(500);
        console.log(error);
        throw new Error("Error occured in submission.");
      }
    }
  } else {
    res.status(404);
    throw new Error("Agent not found");
  }

  await agent.save();
  res.json(agent);
});

/**
  @desc    Create a agent
  @route   POST /api/agents/
  @access  Private/Admin
*/
const createAgent = expressAsync(async (req, res) => {
  try {
    const userGuid = uuidv4();
    /** Check if the email is existing. */
    const emailIsExist = await User.findOne({ email: req.body.emailAddress });

    if (emailIsExist) {
      res.status(500);
      throw new Error("Email already exists.");
    }

    /** Upload image to cloudinary */
    let agentImgResult;
    try {
      agentImgResult = await cloudinary.v2.uploader.upload(req.file?.path, {
        folder: "agent-avatars",
        use_filename: true,
      });
    } catch (error) {
      agentImgResult = "";
    }

    const agent = new Agents({
      userGuid,
      firstName: req.body.firstName?.toString(),
      lastName: req.body.lastName?.toString(),
      state: req.body.state?.toString(),
      licenseNumber: req.body.licenseNumber?.toString(),
      title: req.body.title?.toString(),
      bio: req.body.bio?.toString(),
      phoneNumber: req.body.phoneNumber?.toString(),
      emailAddress: req.body.emailAddress?.toString(),
      address: req.body.address?.toString(),
      instagram: req.body.instagram?.toString(),
      facebook: req.body.facebook?.toString(),
      linkedIn: req.body.linkedIn?.toString(),
      twitter: req.body.twitter?.toString(),
      weChat: req.body.weChat?.toString(),
      discordId: req.body.discordId?.toString(),
      languages: req.body?.languages,
      specialties: req.body?.specialties,
      roles: req.body?.roles,
      firstName: req.body?.firstName,
      lastName: req.body?.lastName,
      role: ROLES.ROLE_AGENT,
      status: AGENT_STATUSES.ACTIVATED,
      telNumber: req.body?.telNumber,
      password: req.body?.password,
      avatar:
        typeof req.body?.avatar === "string"
          ? req.body?.avatar
          : agentImgResult.secure_url,
      avatar_cloudinary_id: agentImgResult.public_id,
      position: req.body?.position,
      zipCode: req.body?.zipCode,
      nationality: req.body?.nationality,
      birthDate: req.body?.birthDate,
    });

    if (agent) {
      await agent.save();
      const userData = {
        userGuid: userGuid,
        name: req.body.firstName + " " + req.body.lastName,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.emailAddress,
        password: req.body.password,
        isAdmin: false,
        roles: req.body.roles,
        position: req.body.position,
      };
      const user = new User(userData);
      await user.save();

      const { templateId } = req.body;

      await registerUserHierarchyAndPoints(req, res, userGuid, templateId);
      await PreProfile.deleteOne({
        emailAddress: req.body?.emailAddress,
      });

      const subscription = new PortalSubscription({
        userGuid: userGuid,
      });

      await subscription.save();

      if (
        req.body.position[0].value === PROFILE_POSITIONS.FREE_30DAYS_TRIAL.value
      ) {
        const mailSubject = "CFS - 30 Days Free-trial Registration";

        await sendEmail(
          req.body.emailAddress,
          mailSubject,
          trialRegistrationSuccess(subscription.userGuid, agent?.specialties),
          [],
          req.body.emailAddress //bcc
        ).then((resolve, reject) => {
          if (reject) console.log(reject + " Email not sent"); //update with application log here
        });
      }

      res.status(201).json(agent);
    } else {
      res.status(500);
      throw new Error("Invalid user data.");
    }
  } catch (err) {
    console.log(err);
    res.status(404);
    throw new Error("Error occured in adding agent.");
  }
});

// @desc    Send Email
// @route   POST /api/agents/:id/contact
// @access  Private
const sendContactEmail = expressAsync((req, res) => {
  try {
    const { subject, content, fromEmail, toEmail } = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_CONFIGS_EMAIL,
        pass: process.env.MAIL_CONFIGS_PASSWORD,
      },
    });

    // Email content
    const mailOptions = {
      from: fromEmail,
      to: toEmail,
      subject: subject,
      text: content + `\n\nSent by ${fromEmail}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.error(error);
      }
      res.send("Email sent: " + info.response);
    });
  } catch (err) {
    res.status(500).json(API_RES_FAIL(err));
  }
});

// @desc    Add new testimonial
// @route   POST /api/agents/:id/testimonials
// @access  Private
const addAgentTestimonial = expressAsync(async (req, res) => {
  try {
    const { name, title, comment, emailAddress } = req.body;
    const testimonialGuid = uuidv4();
    const agent = await Agents.findById(req.params.id);

    if (agent) {
      const testimonial = {
        name: name.toString(),
        title: title.toString(),
        comment: comment.toString(),
        emailAddress: emailAddress.toString(),
        testimonialGuid,
      };

      agent.testimonials.push(testimonial);

      await agent.save();
      res.status(201).json({ message: "Testimonial added" });
    } else {
      res.status(404);
      throw new Error("Testimonial not found");
    }
  } catch (err) {
    res.status(500).json(API_RES_FAIL(err));
  }
});

// @desc    Display the testimonial
// @route   PUT /api/agents/:id/testimonials/update
// @access  Private
const updateAgentTestimonial = expressAsync(async (req, res) => {
  try {
    const { testimonialGuid } = req.body;

    const agent = await Agents.findOne({ userGuid: req.params.id }).then(
      (agent) => {
        let testimonial = agent.testimonials.find(
          (t) => t.testimonialGuid === testimonialGuid
        );

        testimonial.isDisplayed = testimonial.isDisplayed ? false : true;
        return agent.save();
      }
    );

    if (Object.keys(agent).length !== 0) {
      res.status(200).json(agent.testimonials);
    } else {
      res.status(500).json("Bad Request");
    }
  } catch (err) {
    res.status(500).json(API_RES_FAIL(err));
  }
});

// @desc    Get all agent Testimonial
// @route   GET /api/agents/:id/testimonials/
// @access  Private
const getAgentTestimonials = expressAsync(async (req, res) => {
  try {
    const agent = await Agents.findOne({ userGuid: req.params.id });

    res.status(200).json(API_RES_OK(agent.testimonials));
  } catch (err) {
    res.status(500).json(API_RES_FAIL(err));
  }
});

const updateAgentWebinar = expressAsync(async (req, res) => {
  try {
    const webinarGuid = req.params.webinarGuid;
    const isAdd = req.body.mode;

    const webinarData = {
      userGuid: req.params.agentId,
      webinarGuid: req.params.webinarGuid,
      calendlyUrl: req.body.calendlyUrl,
      status: req.body.status,
    };

    if (!isAdd) {
      const agent = await Agents.findOne({ userGuid: req.params.agentId }).then(
        (agent) => {
          let webinar = agent.webinars?.find(
            (t) => t.webinarGuid === webinarGuid
          );

          webinar.status = webinarData.status;
          webinar.calendlyUrl = webinarData.calendlyUrl;
          return agent.save();
        }
      );
      res.status(201).json(agent);
    } else {
      await Agents.update(
        { userGuid: req.params.agentId },
        {
          $push: {
            webinars: webinarData,
          },
        }
      );
      const updatedAgentInfo = await Agents.find({
        userGuid: req.params.agentId,
      });
      res.status(201).json(updatedAgentInfo);
    }
  } catch (err) {
    res.status(500).json(API_RES_FAIL(err));
  }
});

const getAllActiveWebinar = expressAsync(async (req, res) => {
  try {
    const webinarGuids = req.body.webinarGuids;
    const activeWebinars = await Webinars.find({
      webinarGuid: { $in: webinarGuids },
    });

    res.status(200).json(activeWebinars);
  } catch (err) {
    res.status(500).json(API_RES_FAIL(err));
  }
});

/** Version 2 of creating an portal account */
const registerAccount = expressAsync(async (req, res) => {
  try {
    const userGuid = uuidv4();
    /** Check if the email is existing. */
    const emailIsExist = await User.findOne({ email: req.body.emailAddress });

    if (emailIsExist) {
      res.status(500);
      throw new Error("Email already exists.");
    }

    /** Upload image to cloudinary */
    let portalAccountImgResult;
    try {
      portalAccountImgResult = await cloudinary.v2.uploader.upload(
        req.file?.path,
        {
          folder: "agent-avatars",
          use_filename: true,
        }
      );
    } catch (error) {
      portalAccountImgResult = "";
    }

    const portalAccount = new Agents({
      userGuid,
      firstName: req.body.firstName?.toString(),
      lastName: req.body.lastName?.toString(),
      state: req.body.state?.toString(),
      licenseNumber: req.body.licenseNumber?.toString(),
      title: req.body.title?.toString(),
      bio: req.body.bio?.toString(),
      phoneNumber: req.body.phoneNumber?.toString(),
      emailAddress: req.body.emailAddress?.toString(),
      address: req.body.address?.toString(),
      instagram: req.body.instagram?.toString(),
      facebook: req.body.facebook?.toString(),
      linkedIn: req.body.linkedIn?.toString(),
      twitter: req.body.twitter?.toString(),
      discordId: req.body.discordId?.toString(),
      weChat: req.body.weChat?.toString(),
      languages: req.body?.languages,
      specialties: req.body?.specialties,
      roles: req.body?.roles,
      firstName: req.body?.firstName,
      lastName: req.body?.lastName,
      role: req.body?.position,
      position: req.body?.position,
      status: AGENT_STATUSES.PENDING,
      telNumber: req.body?.telNumber,
      password: req.body?.password,
      avatar: portalAccountImgResult.secure_url,
      avatar_cloudinary_id: portalAccountImgResult.public_id,
    });

    if (portalAccount) {
      await portalAccount.save();

      const mailSubject = "Registration Complete";
      const mailContent = agentRegistrationSuccess({
        portalAccountId: portalAccount?._id,
        specialties: portalAccount?.specialties,
      });

      let sendHTMLEmail;
      try {
        sendHTMLEmail = sendEmail(
          portalAccount?.emailAddress,
          mailSubject,
          mailContent,
          []
        )
          .then((request, response) => {
            response?.send(response.message);
          })
          .catch((error) => {
            res.status(500);
            console.log(error);
            throw new Error("Error occured in submission.");
          });
      } catch (error) {
        res.status(500);
        console.log(error);
        throw new Error("Error occured in submission.");
      }

      res.status(201).json(portalAccount);
    } else {
      res.status(500);
      throw new Error("Invalid user data.");
    }
  } catch (err) {
    console.log(err);
    res.status(404);
    throw new Error("Error occured in adding portal account.");
  }
});

export {
  getAgents,
  getSingleAgent,
  deleteAgent,
  updateAgent,
  createAgent,
  updateAgentStatus,
  getAgentsCount,
  addAgentTestimonial,
  updateAgentTestimonial,
  getAgentTestimonials,
  updateAgentWebinar,
  getAllActiveWebinar,
  registerAccount,
  sendContactEmail,
};
