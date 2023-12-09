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
exports.id = "pages/api/cursor";
exports.ids = ["pages/api/cursor"];
exports.modules = {

/***/ "sqlite3":
/*!**************************!*\
  !*** external "sqlite3" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("sqlite3");

/***/ }),

/***/ "sqlite":
/*!*************************!*\
  !*** external "sqlite" ***!
  \*************************/
/***/ ((module) => {

module.exports = import("sqlite");;

/***/ }),

/***/ "(api)/./src/pages/api/cursor.js":
/*!*********************************!*\
  !*** ./src/pages/api/cursor.js ***!
  \*********************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ cursorHandler)\n/* harmony export */ });\n/* harmony import */ var sqlite3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! sqlite3 */ \"sqlite3\");\n/* harmony import */ var sqlite3__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(sqlite3__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var sqlite__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! sqlite */ \"sqlite\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([sqlite__WEBPACK_IMPORTED_MODULE_1__]);\nsqlite__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\nasync function getCursor() {\n    const db = await (0,sqlite__WEBPACK_IMPORTED_MODULE_1__.open)({\n        //declare the db\n        filename: \"./sql/big.db\",\n        driver: (sqlite3__WEBPACK_IMPORTED_MODULE_0___default().Database)\n    });\n    let cursor = await db.all(\"SELECT cursor FROM Transactions ORDER BY Transactions.cursor DESC LIMIT 1\");\n    // if there is no cursor, set it to null\n    if (cursor.length == 0) {\n        cursor = null;\n    }\n    await db.close();\n    return cursor;\n}\nasync function cursorHandler(req, res) {\n    // Handling Get request\n    if (req.method == \"GET\") {\n        try {\n            const payload = await getCursor();\n            return res.status(200).json(payload);\n        } catch (error) {\n            console.error(\"Error fetching cursor data:\", error);\n            return res.status(500).json({\n                error: \"Failed to fetch account data\"\n            });\n        }\n    }\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9zcmMvcGFnZXMvYXBpL2N1cnNvci5qcy5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQThCO0FBQ0E7QUFFOUIsZUFBZUUsU0FBUyxHQUFHO0lBQzFCLE1BQU1DLEVBQUUsR0FBRyxNQUFNRiw0Q0FBSSxDQUFDO1FBQ3JCLGdCQUFnQjtRQUNoQkcsUUFBUSxFQUFFLGNBQWM7UUFDeEJDLE1BQU0sRUFBRUwseURBQWdCO0tBQ3hCLENBQUM7SUFFRixJQUFJTyxNQUFNLEdBQUcsTUFBTUosRUFBRSxDQUFDSyxHQUFHLENBQ3hCLDJFQUEyRSxDQUMzRTtJQUVELHdDQUF3QztJQUN4QyxJQUFJRCxNQUFNLENBQUNFLE1BQU0sSUFBSSxDQUFDLEVBQUU7UUFDdkJGLE1BQU0sR0FBRyxJQUFJLENBQUM7SUFDZixDQUFDO0lBRUQsTUFBTUosRUFBRSxDQUFDTyxLQUFLLEVBQUUsQ0FBQztJQUVqQixPQUFPSCxNQUFNLENBQUM7QUFDZixDQUFDO0FBRWMsZUFBZUksYUFBYSxDQUFDQyxHQUFHLEVBQUVDLEdBQUcsRUFBRTtJQUNyRCx1QkFBdUI7SUFDdkIsSUFBSUQsR0FBRyxDQUFDRSxNQUFNLElBQUksS0FBSyxFQUFFO1FBQ3hCLElBQUk7WUFDSCxNQUFNQyxPQUFPLEdBQUcsTUFBTWIsU0FBUyxFQUFFO1lBQ2pDLE9BQU9XLEdBQUcsQ0FBQ0csTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDQyxJQUFJLENBQUNGLE9BQU8sQ0FBQyxDQUFDO1FBQ3RDLEVBQUUsT0FBT0csS0FBSyxFQUFFO1lBQ2ZDLE9BQU8sQ0FBQ0QsS0FBSyxDQUFDLDZCQUE2QixFQUFFQSxLQUFLLENBQUMsQ0FBQztZQUNwRCxPQUFPTCxHQUFHLENBQUNHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQ0MsSUFBSSxDQUFDO2dCQUFFQyxLQUFLLEVBQUUsOEJBQThCO2FBQUUsQ0FBQyxDQUFDO1FBQ3hFLENBQUM7SUFDRixDQUFDO0FBQ0YsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9wYWdlcy9hcGkvY3Vyc29yLmpzP2MwYTUiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHNxbGl0ZTMgZnJvbSBcInNxbGl0ZTNcIjtcbmltcG9ydCB7IG9wZW4gfSBmcm9tIFwic3FsaXRlXCI7XG5cbmFzeW5jIGZ1bmN0aW9uIGdldEN1cnNvcigpIHtcblx0Y29uc3QgZGIgPSBhd2FpdCBvcGVuKHtcblx0XHQvL2RlY2xhcmUgdGhlIGRiXG5cdFx0ZmlsZW5hbWU6IFwiLi9zcWwvYmlnLmRiXCIsXG5cdFx0ZHJpdmVyOiBzcWxpdGUzLkRhdGFiYXNlXG5cdH0pO1xuXG5cdGxldCBjdXJzb3IgPSBhd2FpdCBkYi5hbGwoXG5cdFx0XCJTRUxFQ1QgY3Vyc29yIEZST00gVHJhbnNhY3Rpb25zIE9SREVSIEJZIFRyYW5zYWN0aW9ucy5jdXJzb3IgREVTQyBMSU1JVCAxXCJcblx0KTtcblxuXHQvLyBpZiB0aGVyZSBpcyBubyBjdXJzb3IsIHNldCBpdCB0byBudWxsXG5cdGlmIChjdXJzb3IubGVuZ3RoID09IDApIHtcblx0XHRjdXJzb3IgPSBudWxsO1xuXHR9XG5cblx0YXdhaXQgZGIuY2xvc2UoKTtcblxuXHRyZXR1cm4gY3Vyc29yO1xufVxuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBjdXJzb3JIYW5kbGVyKHJlcSwgcmVzKSB7XG5cdC8vIEhhbmRsaW5nIEdldCByZXF1ZXN0XG5cdGlmIChyZXEubWV0aG9kID09IFwiR0VUXCIpIHtcblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgcGF5bG9hZCA9IGF3YWl0IGdldEN1cnNvcigpO1xuXHRcdFx0cmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5qc29uKHBheWxvYWQpO1xuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKFwiRXJyb3IgZmV0Y2hpbmcgY3Vyc29yIGRhdGE6XCIsIGVycm9yKTtcblx0XHRcdHJldHVybiByZXMuc3RhdHVzKDUwMCkuanNvbih7IGVycm9yOiBcIkZhaWxlZCB0byBmZXRjaCBhY2NvdW50IGRhdGFcIiB9KTtcblx0XHR9XG5cdH1cbn1cbiJdLCJuYW1lcyI6WyJzcWxpdGUzIiwib3BlbiIsImdldEN1cnNvciIsImRiIiwiZmlsZW5hbWUiLCJkcml2ZXIiLCJEYXRhYmFzZSIsImN1cnNvciIsImFsbCIsImxlbmd0aCIsImNsb3NlIiwiY3Vyc29ySGFuZGxlciIsInJlcSIsInJlcyIsIm1ldGhvZCIsInBheWxvYWQiLCJzdGF0dXMiLCJqc29uIiwiZXJyb3IiLCJjb25zb2xlIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(api)/./src/pages/api/cursor.js\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(api)/./src/pages/api/cursor.js"));
module.exports = __webpack_exports__;

})();