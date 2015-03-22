/**
 * New Relic agent configuration.
 *
 * See lib/config.defaults.js in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 */
exports.config = {
  /**
   * Array of application names.
   */
  app_name : ['Online selling - ' + process.env.NODE_ENV], // This should be an environment variable
  /**
   * Your New Relic license key.
   */
  license_key : '19d23aa869dcc3a419a4e35036a4f956ca636c65', // This is temporary
  logging : {
    /**
     * Level at which to log. 'trace' is most useful to New Relic when diagnosing
     * issues with the agent, 'info' and higher will impose the least overhead on
     * production applications.
     */
    level : 'trace'
  }
};
