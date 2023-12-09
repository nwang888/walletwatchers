"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/api/create-link-token";
exports.ids = ["pages/api/create-link-token"];
exports.modules = {

/***/ "plaid":
/*!************************!*\
  !*** external "plaid" ***!
  \************************/
/***/ ((module) => {

module.exports = require("plaid");

/***/ }),

/***/ "(api)/./src/lib/plaid.js":
/*!**************************!*\
  !*** ./src/lib/plaid.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"plaidClient\": () => (/* binding */ plaidClient),\n/* harmony export */   \"sessionOptions\": () => (/* binding */ sessionOptions)\n/* harmony export */ });\n/* harmony import */ var plaid__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! plaid */ \"plaid\");\n/* harmony import */ var plaid__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(plaid__WEBPACK_IMPORTED_MODULE_0__);\n\nconst plaidClient = new plaid__WEBPACK_IMPORTED_MODULE_0__.PlaidApi(new plaid__WEBPACK_IMPORTED_MODULE_0__.Configuration({\n    basePath: plaid__WEBPACK_IMPORTED_MODULE_0__.PlaidEnvironments[process.env.PLAID_ENV],\n    baseOptions: {\n        headers: {\n            \"PLAID-CLIENT-ID\": process.env.PLAID_CLIENT_ID,\n            \"PLAID-SECRET\": process.env.PLAID_SECRET,\n            \"Plaid-Version\": \"2020-09-14\"\n        }\n    }\n}));\nconst sessionOptions = {\n    cookieName: \"myapp_cookiename\",\n    password: \"complex_password_at_least_32_characters_long\",\n    // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)\n    cookieOptions: {\n        secure: \"development\" === \"production\"\n    }\n};\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9zcmMvbGliL3BsYWlkLmpzLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBbUU7QUFFbkUsTUFBTUcsV0FBVyxHQUFHLElBQUlGLDJDQUFRLENBQzlCLElBQUlELGdEQUFhLENBQUM7SUFDaEJJLFFBQVEsRUFBRUYsb0RBQWlCLENBQUNHLE9BQU8sQ0FBQ0MsR0FBRyxDQUFDQyxTQUFTLENBQUM7SUFDbERDLFdBQVcsRUFBRTtRQUNYQyxPQUFPLEVBQUU7WUFDUCxpQkFBaUIsRUFBRUosT0FBTyxDQUFDQyxHQUFHLENBQUNJLGVBQWU7WUFDOUMsY0FBYyxFQUFFTCxPQUFPLENBQUNDLEdBQUcsQ0FBQ0ssWUFBWTtZQUN4QyxlQUFlLEVBQUUsWUFBWTtTQUM5QjtLQUNGO0NBQ0YsQ0FBQyxDQUNIO0FBRUQsTUFBTUMsY0FBYyxHQUFHO0lBQ3JCQyxVQUFVLEVBQUUsa0JBQWtCO0lBQzlCQyxRQUFRLEVBQUUsOENBQThDO0lBQ3hELDRGQUE0RjtJQUM1RkMsYUFBYSxFQUFFO1FBQ2JDLE1BQU0sRUFBRVgsYUFwQkMsS0FvQndCLFlBQVk7S0FDOUM7Q0FDRjtBQUVzQyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9saWIvcGxhaWQuanM/ZGM3NCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb25maWd1cmF0aW9uLCBQbGFpZEFwaSwgUGxhaWRFbnZpcm9ubWVudHMgfSBmcm9tICdwbGFpZCc7XG5cbmNvbnN0IHBsYWlkQ2xpZW50ID0gbmV3IFBsYWlkQXBpKFxuICBuZXcgQ29uZmlndXJhdGlvbih7XG4gICAgYmFzZVBhdGg6IFBsYWlkRW52aXJvbm1lbnRzW3Byb2Nlc3MuZW52LlBMQUlEX0VOVl0sXG4gICAgYmFzZU9wdGlvbnM6IHtcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgJ1BMQUlELUNMSUVOVC1JRCc6IHByb2Nlc3MuZW52LlBMQUlEX0NMSUVOVF9JRCxcbiAgICAgICAgJ1BMQUlELVNFQ1JFVCc6IHByb2Nlc3MuZW52LlBMQUlEX1NFQ1JFVCxcbiAgICAgICAgJ1BsYWlkLVZlcnNpb24nOiAnMjAyMC0wOS0xNCcsXG4gICAgICB9LFxuICAgIH0sXG4gIH0pXG4pO1xuXG5jb25zdCBzZXNzaW9uT3B0aW9ucyA9IHtcbiAgY29va2llTmFtZTogJ215YXBwX2Nvb2tpZW5hbWUnLFxuICBwYXNzd29yZDogJ2NvbXBsZXhfcGFzc3dvcmRfYXRfbGVhc3RfMzJfY2hhcmFjdGVyc19sb25nJyxcbiAgLy8gc2VjdXJlOiB0cnVlIHNob3VsZCBiZSB1c2VkIGluIHByb2R1Y3Rpb24gKEhUVFBTKSBidXQgY2FuJ3QgYmUgdXNlZCBpbiBkZXZlbG9wbWVudCAoSFRUUClcbiAgY29va2llT3B0aW9uczoge1xuICAgIHNlY3VyZTogcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJyxcbiAgfSxcbn07XG5cbmV4cG9ydCB7IHBsYWlkQ2xpZW50LCBzZXNzaW9uT3B0aW9ucyB9O1xuIl0sIm5hbWVzIjpbIkNvbmZpZ3VyYXRpb24iLCJQbGFpZEFwaSIsIlBsYWlkRW52aXJvbm1lbnRzIiwicGxhaWRDbGllbnQiLCJiYXNlUGF0aCIsInByb2Nlc3MiLCJlbnYiLCJQTEFJRF9FTlYiLCJiYXNlT3B0aW9ucyIsImhlYWRlcnMiLCJQTEFJRF9DTElFTlRfSUQiLCJQTEFJRF9TRUNSRVQiLCJzZXNzaW9uT3B0aW9ucyIsImNvb2tpZU5hbWUiLCJwYXNzd29yZCIsImNvb2tpZU9wdGlvbnMiLCJzZWN1cmUiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(api)/./src/lib/plaid.js\n");

/***/ }),

/***/ "(api)/./src/pages/api/create-link-token.js":
/*!********************************************!*\
  !*** ./src/pages/api/create-link-token.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var _lib_plaid__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/plaid */ \"(api)/./src/lib/plaid.js\");\n\nasync function handler(req, res) {\n    const tokenResponse = await _lib_plaid__WEBPACK_IMPORTED_MODULE_0__.plaidClient.linkTokenCreate({\n        user: {\n            client_user_id: process.env.PLAID_CLIENT_ID\n        },\n        client_name: \"WalletWatchers\",\n        language: \"en\",\n        products: [\n            \"auth\"\n        ],\n        country_codes: [\n            \"US\"\n        ],\n        redirect_uri: process.env.PLAID_SANDBOX_REDIRECT_URI\n    });\n    return res.json(tokenResponse.data);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9zcmMvcGFnZXMvYXBpL2NyZWF0ZS1saW5rLXRva2VuLmpzLmpzIiwibWFwcGluZ3MiOiI7Ozs7O0FBQThDO0FBRS9CLGVBQWVDLE9BQU8sQ0FBQ0MsR0FBRyxFQUFFQyxHQUFHLEVBQUU7SUFDOUMsTUFBTUMsYUFBYSxHQUFHLE1BQU1KLG1FQUEyQixDQUFDO1FBQ3RETSxJQUFJLEVBQUU7WUFBRUMsY0FBYyxFQUFFQyxPQUFPLENBQUNDLEdBQUcsQ0FBQ0MsZUFBZTtTQUFFO1FBQ3JEQyxXQUFXLEVBQUUsZ0JBQWdCO1FBQzdCQyxRQUFRLEVBQUUsSUFBSTtRQUNkQyxRQUFRLEVBQUU7WUFBQyxNQUFNO1NBQUM7UUFDbEJDLGFBQWEsRUFBRTtZQUFDLElBQUk7U0FBQztRQUNyQkMsWUFBWSxFQUFFUCxPQUFPLENBQUNDLEdBQUcsQ0FBQ08sMEJBQTBCO0tBQ3JELENBQUM7SUFFRixPQUFPYixHQUFHLENBQUNjLElBQUksQ0FBQ2IsYUFBYSxDQUFDYyxJQUFJLENBQUMsQ0FBQztBQUN0QyxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2VzL2FwaS9jcmVhdGUtbGluay10b2tlbi5qcz85ODFhIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHBsYWlkQ2xpZW50IH0gZnJvbSAnLi4vLi4vbGliL3BsYWlkJztcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gaGFuZGxlcihyZXEsIHJlcykge1xuICBjb25zdCB0b2tlblJlc3BvbnNlID0gYXdhaXQgcGxhaWRDbGllbnQubGlua1Rva2VuQ3JlYXRlKHtcbiAgICB1c2VyOiB7IGNsaWVudF91c2VyX2lkOiBwcm9jZXNzLmVudi5QTEFJRF9DTElFTlRfSUQgfSxcbiAgICBjbGllbnRfbmFtZTogXCJXYWxsZXRXYXRjaGVyc1wiLFxuICAgIGxhbmd1YWdlOiAnZW4nLFxuICAgIHByb2R1Y3RzOiBbJ2F1dGgnXSxcbiAgICBjb3VudHJ5X2NvZGVzOiBbJ1VTJ10sXG4gICAgcmVkaXJlY3RfdXJpOiBwcm9jZXNzLmVudi5QTEFJRF9TQU5EQk9YX1JFRElSRUNUX1VSSSxcbiAgfSk7XG5cbiAgcmV0dXJuIHJlcy5qc29uKHRva2VuUmVzcG9uc2UuZGF0YSk7XG59XG4iXSwibmFtZXMiOlsicGxhaWRDbGllbnQiLCJoYW5kbGVyIiwicmVxIiwicmVzIiwidG9rZW5SZXNwb25zZSIsImxpbmtUb2tlbkNyZWF0ZSIsInVzZXIiLCJjbGllbnRfdXNlcl9pZCIsInByb2Nlc3MiLCJlbnYiLCJQTEFJRF9DTElFTlRfSUQiLCJjbGllbnRfbmFtZSIsImxhbmd1YWdlIiwicHJvZHVjdHMiLCJjb3VudHJ5X2NvZGVzIiwicmVkaXJlY3RfdXJpIiwiUExBSURfU0FOREJPWF9SRURJUkVDVF9VUkkiLCJqc29uIiwiZGF0YSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(api)/./src/pages/api/create-link-token.js\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(api)/./src/pages/api/create-link-token.js"));
module.exports = __webpack_exports__;

})();