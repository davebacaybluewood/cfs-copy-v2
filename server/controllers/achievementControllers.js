import expressAsync from "express-async-handler";
import {
  fetchUnitedNations,
  fetchOneYearTeam,
  fetchQuickDraw,
  fetchSmokingGun,
  checkMasterAgent,
} from "../services/achievementServices.js";
import { API_RES_FAIL } from "../constants/constants.js";

/**
 * @desc:  Get achievement by UserGuid
 * @route: GET /api/achievements/united-nations
 * @params: total: int => sets the condition for total leads to achieve
 * @access: Private
 */

const getUnitedNations = expressAsync(async (req, res) => {
  const total = req.query.total ?? null;
  const DEFAULT_TOTAL_LEADS = 4;

  const uniqueByNation = await fetchUnitedNations(req.user.userGuid);

  if (uniqueByNation) {
    const totalLeads = uniqueByNation.length;

    res.status(200).json({
      data: uniqueByNation,
      total: totalLeads,
      isCompleted: totalLeads >= (total ?? DEFAULT_TOTAL_LEADS),
    });
  } else {
    res.status(200).json({ msg: "No leads found" });
  }
});

/**
 * @desc:  Get leads birthmonth from Jan-Dec
 * @route: GET /api/achievements/one-year-team
 * @access: Private
 */

const getOneYearTeam = expressAsync(async (req, res) => {
  // 12 leads per year, 1 lead each month of the year
  const DEFAULT_TOTAL_LEADS = 12;

  const subscribers = await fetchOneYearTeam(req.user.userGuid);

  if (subscribers) {
    const totalLeads = subscribers.length;

    res.status(200).json({
      data: subscribers,
      total: totalLeads,
      isCompleted: totalLeads >= DEFAULT_TOTAL_LEADS,
    });
  } else {
    res.status(200).json({ msg: "No leads found" });
  }
});

/**
 * @desc:  Gets first team to recruit 10 agents within a week
 * @route: GET /api/achievements/one-year-team
 * @access: Private
 */

const getQuickDraw = expressAsync(async (req, res) => {
  // 10 leads weekly
  const DEFAULT_TOTAL_LEADS = 10;

  const leads = await fetchQuickDraw(req.user.userGuid);
  if (leads) {
    res.status(200).json({
      data: [{
        week: leads._id.week,
        leadingTotal: leads.leadingTotal,
        leadingTeam: leads._id.leadingTeam,
        yourTeam: leads.yourTeam
      }],
      total: leads.yourTotal,
      isCompleted: leads.yourTotal >= DEFAULT_TOTAL_LEADS && leads._id.leadingTeam == leads.yourTeam,
    });
  } else {
    res.status(200).json({ msg: "No leads found" });
  }
});

/**
 * @desc:  Gets first team to recruit 10 agents within a week
 * @route: GET /api/achievements/one-year-team
 * @access: Private
 */

const getSmokingGun = expressAsync(async (req, res) => {
  // 30 leads per week
  const DEFAULT_TOTAL_LEADS = 30;

  const leads = await fetchSmokingGun(req.user.userGuid);

  if (leads) {
    res.status(200).json({
      data: [{
        week: leads._id.week,
        recruiterUserGuid: leads._id.recruiterUserGuid,
      }],
      total: leads.total,
      isCompleted: leads.total >= DEFAULT_TOTAL_LEADS,
    });
  } else {
    res.status(200).json({ msg: "No leads found" });
  }
});


/**
 * @desc:  Check if Agent achieved to recruit 100 downlines including direct and indirect
 * @route: GET /api/achievements/master-agent/:userGuid
 * @access: Private
 */
const getMasterAgent = expressAsync(async (req, res) => {
  const ACHIEVEMENT_COUNT = 100;

  if (!req.params.userGuid) {
    res.status(400).send(API_RES_FAIL("[Mission] Params is required!"));
    return;
  }

  const agentsData = await checkMasterAgent(req.params.userGuid);
  const recruitedAgents = agentsData[0].downlines;

  const totalLeads = recruitedAgents.length;

  res.status(200).json({
    total: totalLeads,
    isCompleted: totalLeads >= ACHIEVEMENT_COUNT,
    data: recruitedAgents,
  });
});

export { getUnitedNations, getOneYearTeam, getQuickDraw, getSmokingGun, getMasterAgent };
