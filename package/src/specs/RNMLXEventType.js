// Keep the numeric enum and ensure it's strongly typed
export var RNMLXEventTypes;
(function (RNMLXEventTypes) {
    RNMLXEventTypes[RNMLXEventTypes["onTokenGeneration"] = 0] = "onTokenGeneration";
    RNMLXEventTypes[RNMLXEventTypes["onModelLoadProgress"] = 1] = "onModelLoadProgress";
    RNMLXEventTypes[RNMLXEventTypes["onStateChange"] = 2] = "onStateChange";
    RNMLXEventTypes[RNMLXEventTypes["onError"] = 3] = "onError";
    RNMLXEventTypes[RNMLXEventTypes["onGenerationComplete"] = 4] = "onGenerationComplete";
})(RNMLXEventTypes || (RNMLXEventTypes = {}));
