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
exports.id = "pages/index";
exports.ids = ["pages/index"];
exports.modules = {

/***/ "./src/pages/index.jsx":
/*!*****************************!*\
  !*** ./src/pages/index.jsx ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ PlaidLink)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/router */ \"next/router\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var react_plaid_link__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-plaid-link */ \"react-plaid-link\");\n/* harmony import */ var react_plaid_link__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_plaid_link__WEBPACK_IMPORTED_MODULE_3__);\n\n\n\n\nfunction PlaidLink() {\n    const { 0: token , 1: setToken  } = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(null);\n    const { 0: data , 1: setData  } = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)([]);\n    (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(()=>{\n        const createLinkToken = async ()=>{\n            const response = await fetch(\"/api/create-link-token\", {\n                method: \"POST\"\n            });\n            const { link_token  } = await response.json();\n            setToken(link_token);\n        };\n        createLinkToken();\n    }, []);\n    const onSuccess = (0,react__WEBPACK_IMPORTED_MODULE_2__.useCallback)(async (publicToken)=>{\n        await fetch(\"/api/exchange-public-token\", {\n            method: \"POST\",\n            headers: {\n                \"Content-Type\": \"application/json\"\n            },\n            body: JSON.stringify({\n                public_token: publicToken\n            })\n        });\n        next_router__WEBPACK_IMPORTED_MODULE_1___default().push(\"/dash\");\n    }, []);\n    const { open , ready  } = (0,react_plaid_link__WEBPACK_IMPORTED_MODULE_3__.usePlaidLink)({\n        token,\n        onSuccess\n    });\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n            onClick: ()=>open(),\n            disabled: !ready,\n            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"strong\", {\n                children: \"Link account\"\n            }, void 0, false, {\n                fileName: \"/Users/hannahchoi/walletwatchers/src/pages/index.jsx\",\n                lineNumber: 40,\n                columnNumber: 9\n            }, this)\n        }, void 0, false, {\n            fileName: \"/Users/hannahchoi/walletwatchers/src/pages/index.jsx\",\n            lineNumber: 39,\n            columnNumber: 7\n        }, this)\n    }, void 0, false);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvcGFnZXMvaW5kZXguanN4LmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBO0FBQWlDO0FBQ3dCO0FBQ1Q7QUFFakMsU0FBU0ssU0FBUyxHQUFHO0lBQ2xDLE1BQU0sS0FBQ0MsS0FBSyxNQUFFQyxRQUFRLE1BQUlOLCtDQUFRLENBQUMsSUFBSSxDQUFDO0lBRXhDLE1BQU0sS0FBQ08sSUFBSSxNQUFFQyxPQUFPLE1BQUlSLCtDQUFRLENBQUMsRUFBRSxDQUFDO0lBRXBDQyxnREFBUyxDQUFDLElBQU07UUFDZCxNQUFNUSxlQUFlLEdBQUcsVUFBWTtZQUNsQyxNQUFNQyxRQUFRLEdBQUcsTUFBTUMsS0FBSyxDQUFDLHdCQUF3QixFQUFFO2dCQUNyREMsTUFBTSxFQUFFLE1BQU07YUFDZixDQUFDO1lBQ0YsTUFBTSxFQUFFQyxVQUFVLEdBQUUsR0FBRyxNQUFNSCxRQUFRLENBQUNJLElBQUksRUFBRTtZQUM1Q1IsUUFBUSxDQUFDTyxVQUFVLENBQUMsQ0FBQztRQUN2QixDQUFDO1FBQ0RKLGVBQWUsRUFBRSxDQUFDO0lBQ3BCLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUVQLE1BQU1NLFNBQVMsR0FBR2Isa0RBQVcsQ0FBQyxPQUFPYyxXQUFXLEdBQUs7UUFDbkQsTUFBTUwsS0FBSyxDQUFDLDRCQUE0QixFQUFFO1lBQ3hDQyxNQUFNLEVBQUUsTUFBTTtZQUNkSyxPQUFPLEVBQUU7Z0JBQ1AsY0FBYyxFQUFFLGtCQUFrQjthQUNuQztZQUNEQyxJQUFJLEVBQUVDLElBQUksQ0FBQ0MsU0FBUyxDQUFDO2dCQUFFQyxZQUFZLEVBQUVMLFdBQVc7YUFBRSxDQUFDO1NBQ3BELENBQUMsQ0FBQztRQUNIakIsdURBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN2QixDQUFDLEVBQUUsRUFBRSxDQUFDO0lBRU4sTUFBTSxFQUFFd0IsSUFBSSxHQUFFQyxLQUFLLEdBQUUsR0FBR3JCLDhEQUFZLENBQUM7UUFDbkNFLEtBQUs7UUFDTFUsU0FBUztLQUNWLENBQUM7SUFFRixxQkFDRTtrQkFDRSw0RUFBQ1UsUUFBTTtZQUFDQyxPQUFPLEVBQUUsSUFBTUgsSUFBSSxFQUFFO1lBQUVJLFFBQVEsRUFBRSxDQUFDSCxLQUFLO3NCQUM3Qyw0RUFBQ0ksUUFBTTswQkFBQyxjQUFZOzs7OztvQkFBUzs7Ozs7Z0JBQ3RCO3FCQUNSLENBQ0g7QUFDSixDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2VzL2luZGV4LmpzeD9kMzVjIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSb3V0ZXIgZnJvbSAnbmV4dC9yb3V0ZXInO1xuaW1wb3J0IHsgdXNlU3RhdGUsIHVzZUVmZmVjdCwgdXNlQ2FsbGJhY2sgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VQbGFpZExpbmsgfSBmcm9tICdyZWFjdC1wbGFpZC1saW5rJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gUGxhaWRMaW5rKCkge1xuICBjb25zdCBbdG9rZW4sIHNldFRva2VuXSA9IHVzZVN0YXRlKG51bGwpO1xuXG4gIGNvbnN0IFtkYXRhLCBzZXREYXRhXSA9IHVzZVN0YXRlKFtdKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IGNyZWF0ZUxpbmtUb2tlbiA9IGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goJy9hcGkvY3JlYXRlLWxpbmstdG9rZW4nLCB7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgfSk7XG4gICAgICBjb25zdCB7IGxpbmtfdG9rZW4gfSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgIHNldFRva2VuKGxpbmtfdG9rZW4pO1xuICAgIH07XG4gICAgY3JlYXRlTGlua1Rva2VuKCk7XG4gIH0sIFtdKTtcblxuICBjb25zdCBvblN1Y2Nlc3MgPSB1c2VDYWxsYmFjayhhc3luYyAocHVibGljVG9rZW4pID0+IHtcbiAgICBhd2FpdCBmZXRjaCgnL2FwaS9leGNoYW5nZS1wdWJsaWMtdG9rZW4nLCB7XG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgIH0sXG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IHB1YmxpY190b2tlbjogcHVibGljVG9rZW4gfSksXG4gICAgfSk7XG4gICAgUm91dGVyLnB1c2goJy9kYXNoJyk7XG4gIH0sIFtdKTtcblxuICBjb25zdCB7IG9wZW4sIHJlYWR5IH0gPSB1c2VQbGFpZExpbmsoe1xuICAgIHRva2VuLFxuICAgIG9uU3VjY2VzcyxcbiAgfSk7XG5cbiAgcmV0dXJuIChcbiAgICA8PlxuICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiBvcGVuKCl9IGRpc2FibGVkPXshcmVhZHl9PlxuICAgICAgICA8c3Ryb25nPkxpbmsgYWNjb3VudDwvc3Ryb25nPlxuICAgICAgPC9idXR0b24+XG4gICAgPC8+XG4gICk7XG59XG4iXSwibmFtZXMiOlsiUm91dGVyIiwidXNlU3RhdGUiLCJ1c2VFZmZlY3QiLCJ1c2VDYWxsYmFjayIsInVzZVBsYWlkTGluayIsIlBsYWlkTGluayIsInRva2VuIiwic2V0VG9rZW4iLCJkYXRhIiwic2V0RGF0YSIsImNyZWF0ZUxpbmtUb2tlbiIsInJlc3BvbnNlIiwiZmV0Y2giLCJtZXRob2QiLCJsaW5rX3Rva2VuIiwianNvbiIsIm9uU3VjY2VzcyIsInB1YmxpY1Rva2VuIiwiaGVhZGVycyIsImJvZHkiLCJKU09OIiwic3RyaW5naWZ5IiwicHVibGljX3Rva2VuIiwicHVzaCIsIm9wZW4iLCJyZWFkeSIsImJ1dHRvbiIsIm9uQ2xpY2siLCJkaXNhYmxlZCIsInN0cm9uZyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/pages/index.jsx\n");

/***/ }),

/***/ "next/router":
/*!******************************!*\
  !*** external "next/router" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("next/router");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

module.exports = require("react");

/***/ }),

/***/ "react-plaid-link":
/*!***********************************!*\
  !*** external "react-plaid-link" ***!
  \***********************************/
/***/ ((module) => {

module.exports = require("react-plaid-link");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

module.exports = require("react/jsx-dev-runtime");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./src/pages/index.jsx"));
module.exports = __webpack_exports__;

})();