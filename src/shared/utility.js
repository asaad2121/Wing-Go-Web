/**
 * @function updateObject
 * @description It is used to update easily the objects instead of spread
 * operators around all the code.
 * @param {Object} actualState
 * @param {Object} updatedValues
 */
export const updateObject = (actualState, updatedValues) => ({
    ...actualState,
    ...updatedValues
  });