/*
 * BRIGHTSPACE BOOTSTRAP — DEPLOYMENT CONFIGURATION
 * ------------------------------------------------
 * This file contains deployment-specific paths only.
 *
 * Unless stated otherwise, paths are resolved relative to bootstrap.js.
 */
window.BRIGHTSPACE_BOOTSTRAP_CONFIG = {

  /*
   * Root directory of the shared framework.
   *
   * The bootstrap normalizes this value as a DIRECTORY, so both
   * "./brightspace" and "./brightspace/" are valid.
   */
  frameworkBase: './brightspace',

  /*
   * Course-specific configuration.
   * Resolved relative to bootstrap.js.
   */
  courseConfig: './brightspace/scripts/course-config.js',

  /*
   * Additional module registries.
   * Resolved relative to bootstrap.js.
   *
   * Use [] when the deployment has no additional registries.
   */
  moduleRegistries: []
};