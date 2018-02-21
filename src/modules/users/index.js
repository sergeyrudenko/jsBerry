const { routes } = require('./config.json');
const uuid = require('uuid');
const model = require('./userSchema.js');
const usersValidCheck = require ('./validation.js');
const usersAuthCheck = require ('./authorization.js');

module.exports = ({ ACTIONS, ROUTER, utils }) => {

  /**
   *****************************************
   * GET CORRECT ACTIONS NAMES FROM CONFIG *
   *****************************************
   */

  const { users_auth,
          users_get,
          users_create,
          users_update,
          users_delete,
          users_getAll } = utils.convertkeysToDots(routes);

    /**
   ***************************
   * SET MIDDLEWARES *
   ***************************
   *const firstMidleware = (req, res) => {};
   *const secondMidleware = (req, res) => {};
   *
   * ROUTER.set('middlewares', { firstMidleware, secondMidleware });
   */
   // ROUTER.set('middlewares', { usersAuthCheck, usersValidCheck });
   ROUTER.set('middlewares', { usersValidCheck: usersValidCheck(utils), usersAuthCheck: usersAuthCheck(ACTIONS, utils) });

  /**
   *************************************
   * ADD USERS ROUTES TO ACTIONS TREAD *
   *************************************
   */

  ROUTER.routes = Object.assign(ROUTER.routes, routes);

  /**
   ************************************
   * SUBSCRIBE TO USERS AUTHORIZATION *
   ************************************
   *
   * @param  {object} headers - http headers
   * @param  {object} query - parameters from the url
   * @param  {object} body - parameters from json body
   * @return {promise} - success response or error
   */

  ACTIONS.on(users_auth, ({ headers, query, body }) => {


    const response = { name: 'John', surname: 'Dou' };

    return (response.name) ?
      Promise.resolve(response) :
      Promise.reject({ error: { message: 'name not exist!' } });

  });

  /**
   ************************************
   * SUBSCRIBE TO USERS GET *
   ************************************
   *
   * @param  {object} headers - http headers
   * @param  {object} query - parameters from the url
   * @param  {object} body - parameters from json body
   * @param  {object} params - parameters from json url
   * @return {promise} - success response or error
   */

  ACTIONS.on(users_get, async ({ params, headers }) => {
    try {

      if(headers.authCheck){

        const settings = { model, payload: {id: params.id} };
        const response = await ACTIONS.send('database.read', settings);
        return response;

      } else {
        return Promise.reject( 'AuthError' );
      }
    } catch(error) {
      Promise.reject({ details: error.message, code: 101 })
    }


  });


  /**
   ************************************
   * SUBSCRIBE TO GET ALL USERS*
   ************************************
   *
   * @param  {object} headers - http headers
   * @param  {object} query - parameters from the url
   * @param  {object} body - parameters from json body
   * @param  {object} params - parameters from json url
   * @return {promise} - success response or error
   */

  ACTIONS.on(users_getAll, async ({ params, headers }) => {
    try {

      if(headers.authCheck){

        const settings = { model, payload: {} };
        const response = await ACTIONS.send('database.read', settings);
        return response;

      } else {
        return Promise.reject( 'AuthError' );
      }
    } catch(error) {
      Promise.reject({ details: error.message, code: 101 })
    }


  });

  /**
   ************************************
   * SUBSCRIBE TO USERS CREATION *
   ************************************
   *
   * @param  {object} headers - http headers
   * @param  {object} query - parameters from the url
   * @param  {object} body - parameters from json body
   * @param  {object} params - parameters from json url
   * @return {promise} - success response or error
   */

   ACTIONS.on(users_create, async ({ body, headers }) => {
    try {
      console.log(headers.validCheck,'create');
      if( headers.validCheck ){

      const settings = { model, payload: {
          login: body.login,
          password: body.password,
          id: uuid(),
          token: uuid()
        }
      };
        const response = await ACTIONS.send('database.create', settings);
        return response;

      } else {
        return Promise.reject( 'Validation error!' );
      }
    } catch(error) {
      Promise.reject({ details: error.message, code: 101 })
    }


  });

  /**
   ************************************
   * SUBSCRIBE TO USERS UPDATE *
   ************************************
   *
   * @param  {object} headers - http headers
   * @param  {object} query - parameters from the url
   * @param  {object} body - parameters from json body
   * @param  {object} params - parameters from json url
   * @return {promise} - success response or error
   */

  ACTIONS.on(users_update, async ({ params, body, headers }) => {
    try {

      if(headers.validCheck && headers.authCheck){

        const settings = { model, payload: {
          id: params.id,
          login: body.login,
          password: body.password }
      };
        const response = await ACTIONS.send('database.update', settings);
        return response;

      } else {
        return Promise.reject( 'Valid/Auth Error' );
      }

    } catch(error) {
      Promise.reject({ details: error.message, code: 101 })
    }


  });

  /**
   ************************************
   * SUBSCRIBE TO USERS DELETE *
   ************************************
   *
   * @param  {object} headers - http headers
   * @param  {object} query - parameters from the url
   * @param  {object} body - parameters from json body
   * @param  {object} params - parameters from json url
   * @return {promise} - success response or error
   */

  ACTIONS.on(users_delete, async ({ params, headers }) => {
    try {

      if( headers.authCheck ){

        const settings = { model, payload: { id: params.id } };
        const response = await ACTIONS.send('database.delete', );
        return response;

      } else {
        return Promise.reject( 'AuthError' );
      }

    } catch(error) {
      Promise.reject({ details: error.message, code: 101 })
    }


  });

  /**
   ***************************
   * CLEAR USER AUTH ACTIONS *
   ***************************
   * method for clean unstoppable functions
   * for example: listen port
   */
  ACTIONS.on('clear.users.auth', () => {

    return Promise.resolve();

  });

};
