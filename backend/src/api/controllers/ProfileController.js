import { userProfileService } from "../../services/UserProfileService.js";
import { UserProfileErrors } from "../../domain/errors/UserProfileErrors.js";

// поля, которые пользователь может менять через PUT
const EDITABLE_FIELDS = [
  "birthDate",
  "weight",
  "height",
  "activityLevel",
  "goal",
  "allergenIds",
  "excludedFoods",
  "targetCalories",
  "targetProteins",
  "targetFats",
  "targetCarbs",
];

function pickUpdates(body = {}) {
  const updates = {};
  for (const field of EDITABLE_FIELDS) {
    if (body[field] !== undefined) updates[field] = body[field];
  }
  return updates;
}

function handleError(res, next, err) {
  if (err.code === UserProfileErrors.ProfileNotFound) {
    return res.status(404).json({ error: err.code });
  }
  next(err);
}

export async function getProfile(req, res, next) {
  try {
    const profile = await userProfileService.getProfileByUserId(req.userId);
    res.json(profile.toJSON());
  } catch (err) {
    handleError(res, next, err);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const current = await userProfileService.getProfileByUserId(req.userId);
    const updated = await userProfileService.updateProfile(
      current.id,
      pickUpdates(req.body),
    );
    res.json(updated.toJSON());
  } catch (err) {
    handleError(res, next, err);
  }
}