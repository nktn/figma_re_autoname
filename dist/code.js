/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/plugin/controller.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/plugin/controller.ts":
/*!**********************************!*\
  !*** ./src/plugin/controller.ts ***!
  \**********************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const selectOnlyTopLevelNodes = false;
figma.showUI(__html__);
figma.ui.onmessage = (msg) => __awaiter(void 0, void 0, void 0, function* () {
    if (msg.type === "clickPredictButton") {
        if (figma.currentPage.selection.length < 1) {
            figma.ui.postMessage({ type: "emptySelection" });
        }
        else {
            const imagesInBytes = yield renderElementsFromSelection(figma.currentPage.selection);
            sendImagesToUi(imagesInBytes);
        }
    }
    if (msg.type === "response") {
        const nodesToRename = selectAllNodesFromSelection(figma.currentPage.selection, ["TEXT", "VECTOR"]);
        const msgPayload = msg.payload;
        const startTime = new Date().getTime();
        for (const node of nodesToRename) {
            node.name = "Frame";
            for (let predictionResult of msgPayload) {
                if (node.id === predictionResult.nodeId) {
                    node.name = predictionResult.prediction;
                }
            }
            if (node.type === "RECTANGLE") {
                const fills = node.fills;
                if (fills[0].type === "IMAGE") {
                    node.name = "Image";
                }
            }
            if (node.type === "FRAME" || node.type === "GROUP") {
                const children = node.findAll();
                if (children.length > 1) {
                    const areChildrenAllTextNodes = children.every((node) => node.type === "TEXT");
                    if (areChildrenAllTextNodes) {
                        node.name = "Paragraph container";
                    }
                }
            }
            const parent = node.parent;
            if (parent.name === node.name && parent.name !== "Container" && parent.name !== "Card" && parent.name !== "Horizontal container" && parent.name !== "Vertical container") {
                parent.name = `${node.name} container`;
            }
        }
        const endTime = new Date().getTime();
        console.log(`[Figma]: Renaming layer time: ${endTime - startTime}s`);
    }
    if (msg.type === "close") {
        figma.closePlugin();
    }
});
function renderElementsFromSelection(_selection) {
    return __awaiter(this, void 0, void 0, function* () {
        const allSelectedNodes = selectOnlyTopLevelNodes ? selectOnlyTopLevelNode(figma.currentPage.selection) : selectAllNodesFromSelection(figma.currentPage.selection, ["TEXT", "VECTOR"]);
        const binaryNodes = yield sceneNodeToBinaryNode(allSelectedNodes);
        return binaryNodes;
    });
}
;
function sceneNodeToBinaryNode(sceneNodes) {
    return __awaiter(this, void 0, void 0, function* () {
        let renderedNodes = [];
        for (const node of sceneNodes) {
            const baseNodeWidth = node.width;
            const baseNodeHeight = node.height;
            const largestMeasure = Math.max(baseNodeHeight, baseNodeWidth);
            const ratio = Number(224 / largestMeasure).toFixed(2);
            const nodeToRender = largestMeasure > 224 ? minifyNode(node, parseFloat(ratio)) : node;
            const frameTheNodeToRender = frameANode(nodeToRender);
            const id = node.id;
            const bytes = yield frameTheNodeToRender.exportAsync({ format: "JPG" });
            renderedNodes = [...renderedNodes, { nodeId: id, imageDataBytes: bytes }];
            if (nodeToRender !== node) {
                nodeToRender.remove();
            }
            if (frameTheNodeToRender !== node) {
                frameTheNodeToRender.remove();
            }
        }
        return renderedNodes;
    });
}
;
function minifyNode(node, ratio) {
    const minifiedNode = node.clone();
    minifiedNode.rescale(ratio);
    return minifiedNode;
}
;
function frameANode(node) {
    const frame = figma.createFrame();
    const child = node.clone();
    frame.layoutMode = "HORIZONTAL";
    frame.counterAxisAlignItems = "CENTER";
    frame.primaryAxisAlignItems = "CENTER";
    frame.counterAxisSizingMode = "FIXED";
    frame.primaryAxisSizingMode = "FIXED";
    child.layoutAlign = "INHERIT";
    child.layoutGrow = 0;
    frame.insertChild(0, child);
    frame.resize(224, 224);
    return frame;
}
;
function selectAllNodesFromSelection(selection, excludeTypes) {
    let selectedNodes = [];
    let childrenFromSelectedNodes = [];
    selection.forEach((node) => {
        selectedNodes = [...selectedNodes, node];
        if (node.type === "FRAME" || node.type === "GROUP") {
            const children = node.findAll();
            childrenFromSelectedNodes = [...childrenFromSelectedNodes, children];
        }
    });
    const mergedChildrenFromSelectednodes = [].concat.apply([], childrenFromSelectedNodes);
    const selectedNodesAndAllChildren = selectedNodes.concat(mergedChildrenFromSelectednodes);
    const selectedNodesAndAllChildrenWithoutDuplicate = [...new Set(selectedNodesAndAllChildren)];
    const nodesWithoutExcluded = selectedNodesAndAllChildrenWithoutDuplicate.filter((node) => {
        if (excludeTypes.includes(node.type)) {
            return false;
        }
        else {
            return true;
        }
    });
    return nodesWithoutExcluded;
}
;
function selectOnlyTopLevelNode(selection) {
    let selectedNodes = selection;
    return selectedNodes;
}
;
function sendImagesToUi(imagesInBytes) {
    figma.ui.postMessage({ type: "processingRequest", data: imagesInBytes });
}
;



/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BsdWdpbi9jb250cm9sbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNsRkE7QUFBQSxpQkFBaUIsU0FBSSxJQUFJLFNBQUk7QUFDN0IsMkJBQTJCLCtEQUErRCxnQkFBZ0IsRUFBRSxFQUFFO0FBQzlHO0FBQ0EsbUNBQW1DLE1BQU0sNkJBQTZCLEVBQUUsWUFBWSxXQUFXLEVBQUU7QUFDakcsa0NBQWtDLE1BQU0saUNBQWlDLEVBQUUsWUFBWSxXQUFXLEVBQUU7QUFDcEcsK0JBQStCLHFGQUFxRjtBQUNwSDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0MseUJBQXlCO0FBQzNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDLFVBQVU7QUFDM0M7QUFDQTtBQUNBO0FBQ0EscURBQXFELG9CQUFvQjtBQUN6RTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0VBQWtFLGdCQUFnQjtBQUNsRixnREFBZ0Qsb0NBQW9DO0FBQ3BGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsaURBQWlEO0FBQzNFO0FBQ0E7QUFDVSIsImZpbGUiOiJjb2RlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvcGx1Z2luL2NvbnRyb2xsZXIudHNcIik7XG4iLCJ2YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbmNvbnN0IHNlbGVjdE9ubHlUb3BMZXZlbE5vZGVzID0gZmFsc2U7XG5maWdtYS5zaG93VUkoX19odG1sX18pO1xuZmlnbWEudWkub25tZXNzYWdlID0gKG1zZykgPT4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgaWYgKG1zZy50eXBlID09PSBcImNsaWNrUHJlZGljdEJ1dHRvblwiKSB7XG4gICAgICAgIGlmIChmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24ubGVuZ3RoIDwgMSkge1xuICAgICAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyB0eXBlOiBcImVtcHR5U2VsZWN0aW9uXCIgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBpbWFnZXNJbkJ5dGVzID0geWllbGQgcmVuZGVyRWxlbWVudHNGcm9tU2VsZWN0aW9uKGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbik7XG4gICAgICAgICAgICBzZW5kSW1hZ2VzVG9VaShpbWFnZXNJbkJ5dGVzKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAobXNnLnR5cGUgPT09IFwicmVzcG9uc2VcIikge1xuICAgICAgICBjb25zdCBub2Rlc1RvUmVuYW1lID0gc2VsZWN0QWxsTm9kZXNGcm9tU2VsZWN0aW9uKGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbiwgW1wiVEVYVFwiLCBcIlZFQ1RPUlwiXSk7XG4gICAgICAgIGNvbnN0IG1zZ1BheWxvYWQgPSBtc2cucGF5bG9hZDtcbiAgICAgICAgY29uc3Qgc3RhcnRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgIGZvciAoY29uc3Qgbm9kZSBvZiBub2Rlc1RvUmVuYW1lKSB7XG4gICAgICAgICAgICBub2RlLm5hbWUgPSBcIkZyYW1lXCI7XG4gICAgICAgICAgICBmb3IgKGxldCBwcmVkaWN0aW9uUmVzdWx0IG9mIG1zZ1BheWxvYWQpIHtcbiAgICAgICAgICAgICAgICBpZiAobm9kZS5pZCA9PT0gcHJlZGljdGlvblJlc3VsdC5ub2RlSWQpIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5uYW1lID0gcHJlZGljdGlvblJlc3VsdC5wcmVkaWN0aW9uO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChub2RlLnR5cGUgPT09IFwiUkVDVEFOR0xFXCIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBmaWxscyA9IG5vZGUuZmlsbHM7XG4gICAgICAgICAgICAgICAgaWYgKGZpbGxzWzBdLnR5cGUgPT09IFwiSU1BR0VcIikge1xuICAgICAgICAgICAgICAgICAgICBub2RlLm5hbWUgPSBcIkltYWdlXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG5vZGUudHlwZSA9PT0gXCJGUkFNRVwiIHx8IG5vZGUudHlwZSA9PT0gXCJHUk9VUFwiKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2hpbGRyZW4gPSBub2RlLmZpbmRBbGwoKTtcbiAgICAgICAgICAgICAgICBpZiAoY2hpbGRyZW4ubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBhcmVDaGlsZHJlbkFsbFRleHROb2RlcyA9IGNoaWxkcmVuLmV2ZXJ5KChub2RlKSA9PiBub2RlLnR5cGUgPT09IFwiVEVYVFwiKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFyZUNoaWxkcmVuQWxsVGV4dE5vZGVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlLm5hbWUgPSBcIlBhcmFncmFwaCBjb250YWluZXJcIjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHBhcmVudCA9IG5vZGUucGFyZW50O1xuICAgICAgICAgICAgaWYgKHBhcmVudC5uYW1lID09PSBub2RlLm5hbWUgJiYgcGFyZW50Lm5hbWUgIT09IFwiQ29udGFpbmVyXCIgJiYgcGFyZW50Lm5hbWUgIT09IFwiQ2FyZFwiICYmIHBhcmVudC5uYW1lICE9PSBcIkhvcml6b250YWwgY29udGFpbmVyXCIgJiYgcGFyZW50Lm5hbWUgIT09IFwiVmVydGljYWwgY29udGFpbmVyXCIpIHtcbiAgICAgICAgICAgICAgICBwYXJlbnQubmFtZSA9IGAke25vZGUubmFtZX0gY29udGFpbmVyYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zdCBlbmRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgIGNvbnNvbGUubG9nKGBbRmlnbWFdOiBSZW5hbWluZyBsYXllciB0aW1lOiAke2VuZFRpbWUgLSBzdGFydFRpbWV9c2ApO1xuICAgIH1cbiAgICBpZiAobXNnLnR5cGUgPT09IFwiY2xvc2VcIikge1xuICAgICAgICBmaWdtYS5jbG9zZVBsdWdpbigpO1xuICAgIH1cbn0pO1xuZnVuY3Rpb24gcmVuZGVyRWxlbWVudHNGcm9tU2VsZWN0aW9uKF9zZWxlY3Rpb24pIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICBjb25zdCBhbGxTZWxlY3RlZE5vZGVzID0gc2VsZWN0T25seVRvcExldmVsTm9kZXMgPyBzZWxlY3RPbmx5VG9wTGV2ZWxOb2RlKGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbikgOiBzZWxlY3RBbGxOb2Rlc0Zyb21TZWxlY3Rpb24oZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uLCBbXCJURVhUXCIsIFwiVkVDVE9SXCJdKTtcbiAgICAgICAgY29uc3QgYmluYXJ5Tm9kZXMgPSB5aWVsZCBzY2VuZU5vZGVUb0JpbmFyeU5vZGUoYWxsU2VsZWN0ZWROb2Rlcyk7XG4gICAgICAgIHJldHVybiBiaW5hcnlOb2RlcztcbiAgICB9KTtcbn1cbjtcbmZ1bmN0aW9uIHNjZW5lTm9kZVRvQmluYXJ5Tm9kZShzY2VuZU5vZGVzKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgbGV0IHJlbmRlcmVkTm9kZXMgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBub2RlIG9mIHNjZW5lTm9kZXMpIHtcbiAgICAgICAgICAgIGNvbnN0IGJhc2VOb2RlV2lkdGggPSBub2RlLndpZHRoO1xuICAgICAgICAgICAgY29uc3QgYmFzZU5vZGVIZWlnaHQgPSBub2RlLmhlaWdodDtcbiAgICAgICAgICAgIGNvbnN0IGxhcmdlc3RNZWFzdXJlID0gTWF0aC5tYXgoYmFzZU5vZGVIZWlnaHQsIGJhc2VOb2RlV2lkdGgpO1xuICAgICAgICAgICAgY29uc3QgcmF0aW8gPSBOdW1iZXIoMjI0IC8gbGFyZ2VzdE1lYXN1cmUpLnRvRml4ZWQoMik7XG4gICAgICAgICAgICBjb25zdCBub2RlVG9SZW5kZXIgPSBsYXJnZXN0TWVhc3VyZSA+IDIyNCA/IG1pbmlmeU5vZGUobm9kZSwgcGFyc2VGbG9hdChyYXRpbykpIDogbm9kZTtcbiAgICAgICAgICAgIGNvbnN0IGZyYW1lVGhlTm9kZVRvUmVuZGVyID0gZnJhbWVBTm9kZShub2RlVG9SZW5kZXIpO1xuICAgICAgICAgICAgY29uc3QgaWQgPSBub2RlLmlkO1xuICAgICAgICAgICAgY29uc3QgYnl0ZXMgPSB5aWVsZCBmcmFtZVRoZU5vZGVUb1JlbmRlci5leHBvcnRBc3luYyh7IGZvcm1hdDogXCJKUEdcIiB9KTtcbiAgICAgICAgICAgIHJlbmRlcmVkTm9kZXMgPSBbLi4ucmVuZGVyZWROb2RlcywgeyBub2RlSWQ6IGlkLCBpbWFnZURhdGFCeXRlczogYnl0ZXMgfV07XG4gICAgICAgICAgICBpZiAobm9kZVRvUmVuZGVyICE9PSBub2RlKSB7XG4gICAgICAgICAgICAgICAgbm9kZVRvUmVuZGVyLnJlbW92ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGZyYW1lVGhlTm9kZVRvUmVuZGVyICE9PSBub2RlKSB7XG4gICAgICAgICAgICAgICAgZnJhbWVUaGVOb2RlVG9SZW5kZXIucmVtb3ZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlbmRlcmVkTm9kZXM7XG4gICAgfSk7XG59XG47XG5mdW5jdGlvbiBtaW5pZnlOb2RlKG5vZGUsIHJhdGlvKSB7XG4gICAgY29uc3QgbWluaWZpZWROb2RlID0gbm9kZS5jbG9uZSgpO1xuICAgIG1pbmlmaWVkTm9kZS5yZXNjYWxlKHJhdGlvKTtcbiAgICByZXR1cm4gbWluaWZpZWROb2RlO1xufVxuO1xuZnVuY3Rpb24gZnJhbWVBTm9kZShub2RlKSB7XG4gICAgY29uc3QgZnJhbWUgPSBmaWdtYS5jcmVhdGVGcmFtZSgpO1xuICAgIGNvbnN0IGNoaWxkID0gbm9kZS5jbG9uZSgpO1xuICAgIGZyYW1lLmxheW91dE1vZGUgPSBcIkhPUklaT05UQUxcIjtcbiAgICBmcmFtZS5jb3VudGVyQXhpc0FsaWduSXRlbXMgPSBcIkNFTlRFUlwiO1xuICAgIGZyYW1lLnByaW1hcnlBeGlzQWxpZ25JdGVtcyA9IFwiQ0VOVEVSXCI7XG4gICAgZnJhbWUuY291bnRlckF4aXNTaXppbmdNb2RlID0gXCJGSVhFRFwiO1xuICAgIGZyYW1lLnByaW1hcnlBeGlzU2l6aW5nTW9kZSA9IFwiRklYRURcIjtcbiAgICBjaGlsZC5sYXlvdXRBbGlnbiA9IFwiSU5IRVJJVFwiO1xuICAgIGNoaWxkLmxheW91dEdyb3cgPSAwO1xuICAgIGZyYW1lLmluc2VydENoaWxkKDAsIGNoaWxkKTtcbiAgICBmcmFtZS5yZXNpemUoMjI0LCAyMjQpO1xuICAgIHJldHVybiBmcmFtZTtcbn1cbjtcbmZ1bmN0aW9uIHNlbGVjdEFsbE5vZGVzRnJvbVNlbGVjdGlvbihzZWxlY3Rpb24sIGV4Y2x1ZGVUeXBlcykge1xuICAgIGxldCBzZWxlY3RlZE5vZGVzID0gW107XG4gICAgbGV0IGNoaWxkcmVuRnJvbVNlbGVjdGVkTm9kZXMgPSBbXTtcbiAgICBzZWxlY3Rpb24uZm9yRWFjaCgobm9kZSkgPT4ge1xuICAgICAgICBzZWxlY3RlZE5vZGVzID0gWy4uLnNlbGVjdGVkTm9kZXMsIG5vZGVdO1xuICAgICAgICBpZiAobm9kZS50eXBlID09PSBcIkZSQU1FXCIgfHwgbm9kZS50eXBlID09PSBcIkdST1VQXCIpIHtcbiAgICAgICAgICAgIGNvbnN0IGNoaWxkcmVuID0gbm9kZS5maW5kQWxsKCk7XG4gICAgICAgICAgICBjaGlsZHJlbkZyb21TZWxlY3RlZE5vZGVzID0gWy4uLmNoaWxkcmVuRnJvbVNlbGVjdGVkTm9kZXMsIGNoaWxkcmVuXTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIGNvbnN0IG1lcmdlZENoaWxkcmVuRnJvbVNlbGVjdGVkbm9kZXMgPSBbXS5jb25jYXQuYXBwbHkoW10sIGNoaWxkcmVuRnJvbVNlbGVjdGVkTm9kZXMpO1xuICAgIGNvbnN0IHNlbGVjdGVkTm9kZXNBbmRBbGxDaGlsZHJlbiA9IHNlbGVjdGVkTm9kZXMuY29uY2F0KG1lcmdlZENoaWxkcmVuRnJvbVNlbGVjdGVkbm9kZXMpO1xuICAgIGNvbnN0IHNlbGVjdGVkTm9kZXNBbmRBbGxDaGlsZHJlbldpdGhvdXREdXBsaWNhdGUgPSBbLi4ubmV3IFNldChzZWxlY3RlZE5vZGVzQW5kQWxsQ2hpbGRyZW4pXTtcbiAgICBjb25zdCBub2Rlc1dpdGhvdXRFeGNsdWRlZCA9IHNlbGVjdGVkTm9kZXNBbmRBbGxDaGlsZHJlbldpdGhvdXREdXBsaWNhdGUuZmlsdGVyKChub2RlKSA9PiB7XG4gICAgICAgIGlmIChleGNsdWRlVHlwZXMuaW5jbHVkZXMobm9kZS50eXBlKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gbm9kZXNXaXRob3V0RXhjbHVkZWQ7XG59XG47XG5mdW5jdGlvbiBzZWxlY3RPbmx5VG9wTGV2ZWxOb2RlKHNlbGVjdGlvbikge1xuICAgIGxldCBzZWxlY3RlZE5vZGVzID0gc2VsZWN0aW9uO1xuICAgIHJldHVybiBzZWxlY3RlZE5vZGVzO1xufVxuO1xuZnVuY3Rpb24gc2VuZEltYWdlc1RvVWkoaW1hZ2VzSW5CeXRlcykge1xuICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgdHlwZTogXCJwcm9jZXNzaW5nUmVxdWVzdFwiLCBkYXRhOiBpbWFnZXNJbkJ5dGVzIH0pO1xufVxuO1xuZXhwb3J0IHt9O1xuIl0sInNvdXJjZVJvb3QiOiIifQ==