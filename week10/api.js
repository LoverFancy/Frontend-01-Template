{
  let names = Object.getOwnPropertyNames(window);

  const filterOut = (names, props) => {
    let set = new Set();
    props.forEach(o => set.add(o));
    return names.filter(e => !set.has(e));
  }
  // ECMA 262
  // http://www.ecma-international.org/ecma-262/
  names = filterOut(names, [
    "globalThis", "BigInt", "BigInt64Array", "BigUint64Array", "Infinity", "NaN", "undefined", "eval",
    "isFinite", "isNaN", "parseFloat", "parseInt", "decodeURI", "decodeURIComponent", "encodeURI", "encodeURIComponent",
    "Array", "Date", "RegExp", "Promise", "Proxy", "Map", "WeakMap", "Set", "WeakSet", "Function", "Boolean", "String",
    "Number", "Symbol", "Object", "Error", "EvalError", "RangeError", "ReferenceError", "SyntaxError", "TypeError",
    "URIError", "ArrayBuffer", "SharedArrayBuffer", "DataView", "Float32Array", "Float64Array", "Int8Array", "Int16Array",
    "Int32Array", "Uint8Array", "Uint16Array", "Uint32Array", "Uint8ClampedArray", "Atomics", "JSON", "Math", "Reflect",
    "escape", "unescape"
  ]);
  // Node
  names = names.filter( e => {
    try {
      return !(window[e].prototype instanceof Node)
    } catch(err) {
      return true;
    }
  }).filter( e => e != "Node");
  // names = filterOut(names, [
  //   "XMLDocument", "Text", "ShadowRoot", "SVGViewElement", "SVGUseElement", "SVGTitleElement", "SVGTextPositioningElement",
  //   "SVGTextPathElement", "SVGTextElement", "SVGTextContentElement", "SVGTSpanElement", "SVGSymbolElement", "SVGSwitchElement",
  //   "SVGStyleElement", "SVGStopElement", "SVGSetElement", "SVGScriptElement", "SVGSVGElement", "SVGRectElement",
  //   "SVGRadialGradientElement", "SVGPolylineElement", "SVGPolygonElement", "SVGPatternElement", "SVGPathElement",
  //   "SVGMetadataElement", "SVGMaskElement", "SVGMarkerElement", "SVGMPathElement", "SVGLinearGradientElement",
  //   "SVGLineElement", "SVGImageElement", "SVGGraphicsElement", "SVGGradientElement", "SVGGeometryElement", "SVGGElement",
  //   "SVGForeignObjectElement", "SVGFilterElement", "SVGFETurbulenceElement", "SVGFETileElement", "SVGFESpotLightElement",
  //   "SVGFESpecularLightingElement", "SVGFEPointLightElement", "SVGFEOffsetElement", "SVGFEMorphologyElement",
  //   "SVGFEMergeNodeElement", "SVGFEMergeElement", "SVGFEImageElement", "SVGFEGaussianBlurElement", "SVGFEFuncRElement",
  //   "SVGFEFuncGElement", "SVGFEFuncBElement", "SVGFEFuncAElement", "SVGFEFloodElement", "SVGFEDropShadowElement",
  //   "SVGFEDistantLightElement", "SVGFEDisplacementMapElement", "SVGFEDiffuseLightingElement", "SVGFEConvolveMatrixElement",
  //   "SVGFECompositeElement", "SVGFEComponentTransferElement", "SVGFEColorMatrixElement", "SVGFEBlendElement",
  //   "SVGEllipseElement", "SVGElement", "SVGDescElement", "SVGDefsElement", "SVGComponentTransferFunctionElement",
  //   "SVGClipPathElement", "SVGCircleElement", "SVGAnimationElement", "SVGAnimateTransformElement", "SVGAnimateMotionElement",
  //   "SVGAnimateElement", "SVGAElement", "ProcessingInstruction", "Node", "HTMLVideoElement", "HTMLUnknownElement",
  //   "HTMLUListElement", "HTMLTrackElement", "HTMLTitleElement", "HTMLTimeElement", "HTMLTextAreaElement",
  //   "HTMLTemplateElement", "HTMLTableSectionElement", "HTMLTableRowElement", "HTMLTableElement", "HTMLTableColElement",
  //   "HTMLTableCellElement", "HTMLTableCaptionElement", "HTMLStyleElement", "HTMLSpanElement", "HTMLSourceElement",
  //   "HTMLSlotElement", "HTMLShadowElement", "HTMLSelectElement", "HTMLScriptElement", "HTMLQuoteElement",
  //   "HTMLProgressElement", "HTMLPreElement", "HTMLPictureElement", "HTMLParamElement", "HTMLParagraphElement",
  //   "HTMLOutputElement", "Option", "HTMLOptionElement", "HTMLOptGroupElement", "HTMLObjectElement", "HTMLOListElement",
  //   "HTMLModElement", "HTMLMeterElement", "HTMLMetaElement", "HTMLMenuElement", "HTMLMediaElement", "HTMLMarqueeElement",
  //   "HTMLMapElement", "HTMLLinkElement", "HTMLLegendElement", "HTMLLabelElement", "HTMLLIElement", "HTMLInputElement", "Image",
  //   "HTMLImageElement", "HTMLIFrameElement", "HTMLHtmlElement", "HTMLHeadingElement", "HTMLHeadElement", "HTMLHRElement",
  //   "HTMLFrameSetElement", "HTMLFrameElement", "HTMLFormElement", "HTMLFontElement", "HTMLFieldSetElement", "HTMLEmbedElement",
  //   "HTMLElement", "HTMLDocument", "HTMLDivElement", "HTMLDirectoryElement", "HTMLDialogElement", "HTMLDetailsElement",
  //   "HTMLDataListElement", "HTMLDataElement", "HTMLDListElement", "HTMLContentElement", "HTMLCanvasElement",
  //   "HTMLButtonElement", "HTMLBodyElement", "HTMLBaseElement", "HTMLBRElement", "Audio", "HTMLAudioElement",
  //   "HTMLAreaElement", "HTMLAnchorElement", "Element", "DocumentType", "DocumentFragment", "Comment", "CharacterData",
  //   "CDATASection", "Attr"
  // ]);

  // webkit
  names = names.filter(e => !e.match(/^(w|W)ebkit/))
  // names = filterOut(names, ["webkitStorageInfo", "webkitRequestFileSystem", "webkitResolveLocalFileSystemURL"]);
  // Intl
  // http://www.ecma-international.org/ecma-402/5.0/index.html
  names = filterOut(names, ["Intl"]);
  // WebGL
  // https://www.khronos.org/registry/webgl/specs/latest/1.0/
  names = filterOut(names, [
    "WebGLVertexArrayObject","WebGLTransformFeedback","WebGLSync","WebGLSampler","WebGLQuery","WebGL2RenderingContext",
    "WebGLContextEvent","WebGLObject", "WebGLBuffer", "WebGLFramebuffer", "WebGLProgram", "WebGLRenderbuffer",
    "WebGLShader", "WebGLTexture", "WebGLUniformLocation", "WebGLActiveInfo", "WebGLShaderPrecisionFormat",
    "WebGLRenderingContext"
  ]);
  // webaudio
  // https://www.w3.org/TR/webaudio/
  names = filterOut(names, [
    "BaseAudioContext", "OfflineAudioContext", "AudioScheduledSourceNode", "AudioParamMap", "AudioContext", "AudioNode",
    "AnalyserNode", "AudioBuffer", "AudioBufferSourceNode", "AudioDestinationNode", "AudioParam", "AudioListener",
    "AudioWorklet", "AudioWorkletGlobalScope", "AudioWorkletNode", "AudioWorkletProcessor", "BiquadFilterNode",
    "ChannelMergerNode", "ChannelSplitterNode", "ConstantSourceNode", "ConvolverNode", "DelayNode", "DynamicsCompressorNode",
    "GainNode", "IIRFilterNode", "MediaElementAudioSourceNode", "MediaStreamAudioSourceNode", "MediaStreamTrackAudioSourceNode",
    "MediaStreamAudioDestinationNode", "PannerNode", "PeriodicWave", "OscillatorNode", "StereoPannerNode",
    "WaveShaperNode", "ScriptProcessorNode"
  ]);
  names = filterOut(names, ["OfflineAudioCompletionEvent", "AudioProcessingEvent"]);
  // Background Sync
  // https://wicg.github.io/BackgroundSync/spec/
  names = filterOut(names, ["SyncManager"]);
  // Compatibility
  // https://compat.spec.whatwg.org/
  names = filterOut(names, ["WebKitCSSMatrix", "orientation", "orientationchange"]);
  // Console
  // https://console.spec.whatwg.org/
  // names = filterOut(names, ["console"]);
  // DOM
  // https://dom.spec.whatwg.org/
  // Event
  // event handler content attributes
  names = filterOut(names, [
    "onsearch", "onabort", "onblur", "oncancel", "oncanplay", "oncanplaythrough", "onchange", "onclick", "onclose",
    "oncontextmenu", "oncuechange", "ondblclick", "ondrag", "ondragend", "ondragenter", "ondragleave", "ondragover",
    "ondragstart", "ondrop", "ondurationchange", "onemptied", "onended", "onerror", "onfocus", "onformdata", "oninput",
    "oninvalid", "onkeydown", "onkeypress", "onkeyup", "onload", "onloadeddata", "onloadedmetadata", "onloadstart",
    "onmousedown", "onmouseenter", "onmouseleave", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "onmousewheel",
    "onpause", "onplay", "onplaying", "onprogress", "onratechange", "onreset", "onresize", "onscroll", "onseeked",
    "onseeking", "onselect", "onstalled", "onsubmit", "onsuspend", "ontimeupdate", "ontoggle", "onvolumechange",
    "onwaiting", "onwebkitanimationend", "onwebkitanimationiteration", "onwebkitanimationstart", "onwebkittransitionend",
    "onwheel", "onauxclick", "ongotpointercapture", "onlostpointercapture", "onpointerdown", "onpointermove", "onpointerup",
    "onpointercancel", "onpointerover", "onpointerout", "onpointerenter", "onpointerleave", "onselectstart",
    "onselectionchange", "onanimationend", "onanimationiteration", "onanimationstart", "ontransitionend", "onafterprint",
    "onbeforeprint", "onbeforeunload", "onhashchange", "onlanguagechange", "onmessage", "onmessageerror", "onoffline",
    "ononline", "onpagehide", "onpageshow", "onpopstate", "onrejectionhandled", "onstorage", "onunhandledrejection",
    "onunload", "onappinstalled", "onbeforeinstallprompt", "onpointerrawupdate"
  ]);
  // names = names.filter(e => !e.match(/^on/));
  // Interface Event
  names = filterOut(names, ["Event", "event"]);
  // CustomEvent
  names = filterOut(names, ["CustomEvent"]);
  // EventTarget
  names = filterOut(names, ["EventTarget"]);
  // AbortController
  // Interface AbortController
  names = filterOut(names, ["AbortController"]);
  // Interface AbortSignal
  names = filterOut(names, ["AbortSignal"]);
  // Mutation
  // MutationObserver
  names = filterOut(names, ["MutationObserver", "WebKitMutationObserver"]);
  // MutationRecord
  names = filterOut(names, ["MutationRecord"]);
  // complement of Document
  // DOMImplementation
  names = filterOut(names, ["DOMImplementation"]);
  // complement of Element
  // NamedNodeMap
  names = filterOut(names, ["NamedNodeMap"]);
  // Ranges
  // StaticRange
  names = filterOut(names, ["StaticRange"]);
  // AbstractRange
  names = filterOut(names, ["AbstractRange"]);
  // Range
  names = filterOut(names, ["Range"]);
  // Traversal
  // NodeIterator
  names = filterOut(names, ["NodeIterator"]);
  // TreeWalker
  names = filterOut(names, ["TreeWalker"]);
  // NodeFilter
  names = filterOut(names, ["NodeFilter"]);
  // NodeList
  names = filterOut(names, ["NodeList"]);
  // Sets
  // DOMTokenList
  names = filterOut(names, ["DOMTokenList"]);
  // XPath
  // XPathResult
  names = filterOut(names, ["XPathResult"]);
  // XPathExpression
  names = filterOut(names, ["XPathExpression"]);
  // XPathEvaluator
  names = filterOut(names, ["XPathEvaluator"]);
  // Historical
  // DOM Events
  names = filterOut(names, ["MutationEvent", "MutationNameEvent"]);
  // DOM Core
  names = filterOut(names, [
    "DOMConfiguration", "DOMError", "DOMErrorHandler", "DOMImplementationList","DOMImplementationSource",
    "DOMLocator","DOMObject","DOMUserData","Entity","EntityReference","NameList","Notation","TypeInfo",
    "UserDataHandler"
  ]);
  // DOM Ranges
  names = filterOut(names, ["RangeException"]);
  // Encoding
  // https://encoding.spec.whatwg.org/
  names = filterOut(names, ["TextDecoder", "TextEncoder", "TextDecoderStream", "TextEncoderStream"]);
  // Fetch
  // https://fetch.spec.whatwg.org/
  // Headers class
  names = filterOut(names, ["Headers"]);
  // Request class
  names = filterOut(names, ["Request"]);
  // Response class
  names = filterOut(names, ["Response"]);
  // Fetch method
  names = filterOut(names, ["fetch"]);

  // HTML Living Standard
  // https://html.spec.whatwg.org/
  names = filterOut(names, [
    "ApplicationCache", "AudioTrack", "AudioTrackList", "BarProp", "BeforeUnloadEvent", "BroadcastChannel",
    "CanvasGradient", "CanvasPattern", "CanvasRenderingContext2D", "CloseEvent", "CustomElementRegistry",
    "ElementInternals", "DOMStringList", "DOMStringMap", "DataTransfer", "DataTransferItem", "DataTransferItemList",
    "DedicatedWorkerGlobalScope", "Document", "DragEvent", "ErrorEvent", "EventSource", "External", "external",
    "FormDataEvent", "HTMLAllCollection", "HashChangeEvent", "History", "ImageBitmap", "ImageBitmapRenderingContext",
    "ImageData", "Location", "MediaError", "MessageChannel", "MessageEvent", "MessagePort", "MimeType", "MimeTypeArray",
    "Navigator", "OffscreenCanvas", "OffscreenCanvasRenderingContext2D", "PageTransitionEvent", "Path2D", "Plugin",
    "PluginArray", "PopStateEvent", "PromiseRejectionEvent", "RadioNodeList", "SharedWorker", "SharedWorkerGlobalScope",
    "Storage", "StorageEvent", "TextMetrics", "TextTrack", "TextTrackCue", "TextTrackCueList", "TextTrackList",
    "TimeRanges", "TrackEvent", "ValidityState", "VideoTrack", "VideoTrackList", "WebSocket", "Window", "Worker",
    "WorkerGlobalScope", "WorkerLocation", "WorkerNavigator"
  ]);
  // Application Cache
  names = filterOut(names, ["ApplicationCacheErrorEvent"]);
  // Tracking user activation
  names = filterOut(names, ["UserActivation"]);
  // Common DOM interfaces
  names = filterOut(names, ["HTMLCollection", "HTMLFormControlsCollection", "HTMLOptionsCollection"]);
  // The Window object
  names = filterOut(names, [
    "window", "self", "document", "name", "location", "history", "customElements", "locationbar", "menubar",
    "personalbar", "scrollbars", "statusbar", "toolbar", "status", "close", "closed", "stop", "focus", "blur",
    "frames", "length", "top", "opener", "parent", "frameElement", "open", "navigator", "applicationCache", "alert",
    "confirm", "prompt", "print", "postMessage", "console"
  ]);
  // WindowOrWorkerGlobalScope methods
  names = filterOut(names, [
    "origin", "btoa", "atob", "setTimeout", "clearTimeout", "setInterval", "clearInterval", "queueMicrotask",
    "createImageBitmap"
  ]);
  // SubmitEvent
  names = filterOut(names, ["SubmitEvent"]);
  // Event handlers on elements, Document objects, and Window objects
  names = filterOut(names, ["copy", "paste"]);
  // DOM parsing
  names = filterOut(names, ["DOMParser"]);
  // Animation frames
  names = filterOut(names, [
    "requestAnimationFrame", "webkitRequestAnimationFrame", "cancelAnimationFrame", "webkitCancelAnimationFrame"
  ]);
  // Web storage
  names = filterOut(names, ["localStorage", "sessionStorage"]);
  // Notifications API
  // https://notifications.spec.whatwg.org/
  names = filterOut(names, ["Notification"]);
  // CSS Object Model (CSSOM)
  // https://drafts.csswg.org/cssom/
  // Media Queries
  names = filterOut(names, ["MediaList"]);
  // CSS Style Sheets
  names = filterOut(names, ["StyleSheet", "CSSStyleSheet"]);
  // CSS Style Sheet Collections
  names = filterOut(names, ["StyleSheetList"]);
  // Style Sheet Association
  names = filterOut(names, ["LinkStyle"]);
  // CSS Rules
  names = filterOut(names, [
    "CSSRuleList", "CSSRule", "CSSStyleRule", "CSSImportRule", "CSSGroupingRule", "CSSMediaRule", "CSSPageRule",
    "CSSMarginRule", "CSSNamespaceRule"
  ]);
  // CSS Declaration Blocks
  names = filterOut(names, ["CSSStyleDeclaration"]);
  // Extensions to the Window Interface
  names = filterOut(names, ["getComputedStyle"]);
  // Utility APIs
  names = filterOut(names, ["CSS"]);
  // CSSOM View Module
  // https://drafts.csswg.org/cssom-view/
  // Extensions to the Window Interface
  names = filterOut(names, [
    "matchMedia", "moveTo","moveBy","resizeTo","resizeBy", "innerWidth", "innerHeight", "scrollX", "pageXOffset",
    "scrollY", "pageYOffset", "scroll", "scrollTo", "scrollBy", "screenX", "screenLeft", "screenY", "screenTop",
    "outerWidth", "outerHeight", "devicePixelRatio", "MediaQueryList", "MediaQueryListEvent", "Screen", "screen"
  ]);
  // CSS Typed OM
  // https://drafts.css-houdini.org/css-typed-om/
  names = filterOut(names, [
    "CSSStyleValue", "StylePropertyMapReadOnly", "StylePropertyMap", "CSSUnparsedValue", "CSSVariableReferenceValue",
    "CSSKeywordValue", "CSSNumericValue", "CSSUnitValue", "CSSMathValue", "CSSMathSum", "CSSMathProduct", "CSSMathNegate",
    "CSSMathInvert", "CSSMathMin", "CSSMathMax", "CSSMathClamp", "CSSNumericArray", "CSSTransformValue",
    "CSSTransformComponent", "CSSTranslate", "CSSRotate", "CSSScale", "CSSSkew", "CSSSkewX", "CSSSkewY", "CSSPerspective",
    "CSSMatrixComponent", "CSSImageValue", "CSSPositionValue"
  ]);
  // Worklets
  // https://drafts.css-houdini.org/worklets/
  names = filterOut(names, ["Worklet"]);
  // CSS Fonts Module
  // https://drafts.csswg.org/css-fonts-4
  names = filterOut(names, ["CSSFontFaceRule"]);
  // CSS Conditional Rules
  // https://drafts.csswg.org/css-conditional-3
  names = filterOut(names, ["CSSSupportsRule", "CSSConditionRule"]);
  // Storage
  // https://storage.spec.whatwg.org/
  names = filterOut(names, ["indexedDB", "StorageManager"]);
  // Streams
  // https://streams.spec.whatwg.org
  names = filterOut(names, [
    "ReadableStream", "ReadableStreamDefaultReader", "ReadableStreamBYOBReader", "ReadableStreamDefaultController",
    "ReadableByteStreamController", "ReadableStreamBYOBRequest", "WritableStream", "WritableStreamDefaultWriter",
    "WritableStreamDefaultController", "TransformStream", "TransformStreamDefaultController", "ByteLengthQueuingStrategy",
    "CountQueuingStrategy"
  ]);
  // URL
  // https://url.spec.whatwg.org/
  names = filterOut(names, ["URL", "webkitURL", "URLSearchParams"]);
  // XMLHttpRequest
  // https://xhr.spec.whatwg.org/
  names = filterOut(names, [
    "XMLHttpRequestEventTarget", "XMLHttpRequestUpload", "XMLHttpRequest", "FormData", "ProgressEvent"
  ]);

  // Geometry Interfaces Module
  // https://drafts.fxtf.org/geometry-1/
  names = filterOut(names, [
    "DOMPointReadOnly", "DOMPoint", "DOMRectReadOnly", "DOMRect", "DOMRectList", "DOMQuad", "DOMMatrixReadOnly",
    "DOMMatrix"
  ]);
  // File API
  // https://w3c.github.io/FileAPI/
  names = filterOut(names, ["Blob", "File", "FileList", "FileReader"]);
  // Web IDL
  // https://heycam.github.io/webidl/
  names = filterOut(names, ["DOMException"]);

  // Animation
  // https://drafts.csswg.org/web-animations-1
  names = filterOut(names, ["Animation", "AnimationEffect", "KeyframeEffect"]);
  // CSS Animations
  // https://drafts.csswg.org/css-animations
  names = filterOut(names, ["AnimationEvent", "CSSKeyframeRule", "CSSKeyframesRule"]);
  // Media Source Extensions
  // https://w3c.github.io/media-source/
  names = filterOut(names, ["MediaSource", "SourceBuffer", "SourceBufferList"]);
  // Content Security Policy
  // https://w3c.github.io/webappsec-csp/
  names = filterOut(names, ["SecurityPolicyViolationEvent"]);

  // CSS Counter Styles
  // https://drafts.csswg.org/css-counter-styles-3/
  names = filterOut(names, ["CSSCounterStyleRule"]);

  // ServiceWorker
  // https://w3c.github.io/ServiceWorker/
  names = filterOut(names, [
    "ServiceWorker", "ServiceWorkerRegistration", "ServiceWorkerContainer", "NavigationPreloadManager",
    "caches", "Cache", "CacheStorage"
  ]);
  // Performance Timeline
  // https://w3c.github.io/performance-timeline/
  names = filterOut(names, ["Performance", "PerformanceEntry", "PerformanceObserver", "PerformanceObserverEntryList"]);
  // Resource Timing
  // https://www.w3.org/TR/resource-timing-2
  names = filterOut(names, ["PerformanceResourceTiming"]);
  // User Timing
  // https://www.w3.org/TR/user-timing-2/
  names = filterOut(names, ["PerformanceMark", "PerformanceMeasure"]);
  // Navigation Timing
  // https://www.w3.org/TR/navigation-timing
  names = filterOut(names, ["PerformanceTiming", "PerformanceNavigation", "PerformanceNavigationTiming", "performance"]);
  // Server Timing
  // https://w3c.github.io/server-timing/
  names = filterOut(names, ["PerformanceServerTiming"]);
  // Long Tasks
  // https://w3c.github.io/longtasks/
  names = filterOut(names, ["PerformanceLongTaskTiming", "TaskAttributionTiming"]);

  // Cooperative Scheduling of Background Tasks
  // https://w3c.github.io/requestidlecallback
  names = filterOut(names, ["IdleDeadline", "requestIdleCallback", "cancelIdleCallback"]);
  // Touch Event
  // https://w3c.github.io/touch-events/
  names = filterOut(names, ["Touch", "TouchList", "TouchEvent"]);
  // UI Event
  // https://w3c.github.io/uievents/
  names = filterOut(names, [
    "UIEvent", "FocusEvent", "MouseEvent", "WheelEvent", "InputEvent", "KeyboardEvent", "CompositionEvent"
  ]);
  // SVG
  // https://www.w3.org/TR/SVG2/types.html
  names = filterOut(names, [
    "SVGAnimatedBoolean", "SVGAnimatedNumber", "SVGAnimatedLength", "SVGAnimatedAngle", "SVGAnimatedRect", "SVGAnimatedString",
    "SVGAnimatedNumberList", "SVGAnimatedLengthList", "SVGAnimatedTransformList", "SVGAnimatedEnumeration", "SVGLength",
    "SVGAngle", "SVGNumber",  "SVGNumberList", "SVGLengthList", "SVGPointList", "SVGTransform",  "SVGTransformList",
    "SVGStringList", "SVGZoomAndPan", "SVGPreserveAspectRatio", "SVGNameList", "SVGUnitTypes", "SVGAnimatedInteger"
  ]);
  // https://www.w3.org/TR/2011/REC-SVG11-20110816/coords.html
  names = filterOut(names, ["SVGRect", "SVGMatrix", "SVGPoint", "SVGAnimatedPreserveAspectRatio"]);
  // WebUSB API
  // https://wicg.github.io/webusb
  names = filterOut(names, [
    "USB", "USBConnectionEvent", "USBDevice", "USBInTransferResult", "USBOutTransferResult", "USBIsochronousInTransferPacket",
    "USBIsochronousInTransferResult", "USBIsochronousOutTransferPacket", "USBIsochronousOutTransferResult", "USBConfiguration",
    "USBInterface", "USBAlternateInterface", "USBEndpoint", "USBPermissionResult"
  ]);
  // Web Bluetooth
  // https://webbluetoothcg.github.io/web-bluetooth
  names = filterOut(names, [
    "Bluetooth", "BluetoothPermissionResult", "ValueEvent", "BluetoothDevice", "BluetoothManufacturerDataMap",
    "BluetoothServiceDataMap", "BluetoothAdvertisingEvent", "BluetoothRemoteGATTServer", "BluetoothRemoteGATTService",
    "BluetoothRemoteGATTCharacteristic", "BluetoothCharacteristicProperties", "BluetoothRemoteGATTDescriptor",
    "BluetoothUUID"
  ]);
  // Secure Contexts
  // https://w3c.github.io/webappsec-secure-contexts/
  names = filterOut(names, ["isSecureContext"]);
  // WebRTC 1.0: Real-time Communication Between Browsers
  // https://w3c.github.io/webrtc-pc/
  names = filterOut(names, [
    "RTCPeerConnection", "webkitRTCPeerConnection", "RTCSessionDescription", "RTCIceCandidate",
    "RTCCertificate", "RTCRtpSender", "RTCRtpReceiver", "RTCRtpTransceiver", "RTCDtlsTransport", "RTCIceTransport",
    "RTCSctpTransport", "RTCDataChannel", "RTCDTMFSender", "RTCStatsReport", "RTCError", "MediaStreamTrack",
    "MediaStream", "webkitMediaStream", "MediaDevices", "MediaDeviceInfo", "InputDeviceInfo",
  ]);
  names = filterOut(names, [
    "RTCPeerConnectionIceEvent", "RTCPeerConnectionIceErrorEvent", "RTCTrackEvent", "RTCDataChannelEvent",
    "RTCDTMFToneChangeEvent", "RTCErrorEvent", "MediaStreamTrackEvent", "MediaStreamEvent"
  ]);
  // MediaStreamEvent ?: can find MediaStreamEvent interface
  // MediaStream Recording
  // https://www.w3.org/TR/mediastream-recording/
  names = filterOut(names, ["MediaRecorder", "BlobEvent", "MediaRecorderErrorEvent"]);
  // Web Cryptography API
  // https://www.w3.org/TR/WebCryptoAPI/
  names = filterOut(names, ["Crypto", "crypto", "CryptoKey", "SubtleCrypto"]);
  // Payment Request API
  // https://w3c.github.io/payment-request/
  names = filterOut(names, [
    "PaymentRequest", "PaymentAddress", "PaymentResponse", "MerchantValidationEvent", "PaymentMethodChangeEvent",
    "PaymentRequestUpdateEvent"
  ]);
  // Payment Handler API
  // https://www.w3.org/TR/2019/WD-payment-handler-20191021/
  names = filterOut(names, ["PaymentManager", "PaymentInstruments"]);
  // Permissions
  // https://w3c.github.io/permissions/
  names = filterOut(names, ["Permissions", "PermissionStatus"]);
  // Web Locks API
  // https://wicg.github.io/web-locks/
  names = filterOut(names, ["LockManager", "Lock"]);
  // Web Speech API
  // https://wicg.github.io/speech-api/
  names = filterOut(names, [
    "SpeechRecognition", "webkitSpeechRecognition", "SpeechRecognitionAlternative", "SpeechRecognitionResult", "SpeechRecognitionResultList",
    "SpeechGrammar", "webkitSpeechGrammar", "SpeechGrammarList", "webkitSpeechGrammarList", "SpeechSynthesis",
    "speechSynthesis", "SpeechSynthesisUtterance", "SpeechSynthesisVoice"
  ]);
  names = filterOut(names, [
    "SpeechRecognitionErrorEvent", "SpeechRecognitionEvent", "webkitSpeechRecognitionEvent", "SpeechSynthesisEvent",
    "SpeechSynthesisErrorEvent", "webkitSpeechRecognitionError"
  ]);
  // Frame Timing
  // https://wicg.github.io/frame-timing/
  names = filterOut(names, ["PerformanceFrameTiming"]);
  // Event Timing API
  // https://wicg.github.io/event-timing/
  names = filterOut(names, ["PerformanceEventTiming", "EventCounts"]);
  // Element Timing API
  // https://wicg.github.io/element-timing/
  names = filterOut(names, ["PerformanceElementTiming"]);
  // Largest Contentful Paint
  // https://wicg.github.io/largest-contentful-paint/
  names = filterOut(names, ["LargestContentfulPaint"]);
  // Paint Timing
  // https://w3c.github.io/paint-timing/
  names = filterOut(names, ["PerformancePaintTiming"]);
  // Clipboard API and events
  // https://w3c.github.io/clipboard-apis/
  names = filterOut(names, ["Clipboard", "ClipboardItem"]);
  names = filterOut(names, ["ClipboardEvent"]);
  // Credential Management
  // https://w3c.github.io/webappsec-credential-management/
  names = filterOut(names, ["Credential", "CredentialsContainer", "PasswordCredential", "FederatedCredential"]);
  // Presentation API
  // https://www.w3.org/TR/2017/CR-presentation-api-20170601/
  names = filterOut(names, [
    "Presentation", "PresentationRequest", "PresentationAvailability", "PresentationConnectionAvailableEvent",
    "PresentationConnection", "PresentationConnectionCloseEvent", "PresentationReceiver", "PresentationConnectionList"
  ]);
  names = filterOut(names, ["PresentationConnectionAvailableEvent", "PresentationConnectionCloseEvent"]);
  // Media Capabilities
  // https://www.w3.org/TR/2020/WD-media-capabilities-20200130
  names = filterOut(names, ["MediaCapabilities"]);
  // Encrypted Media Extensions
  // https://www.w3.org/TR/2017/REC-encrypted-media-20170918
  names = filterOut(names, ["MediaKeys", "MediaKeySession", "MediaKeyStatusMap", "MediaKeySystemAccess"]);
  names = filterOut(names, ["MediaEncryptedEvent", "MediaKeyMessageEvent"]);
  // Media Session Standard
  // https://www.w3.org/TR/2020/WD-mediasession-20200130
  names = filterOut(names, ["MediaSession", "MediaMetadata"]);
  // Generic Sensor API
  // https://w3c.github.io/sensors
  names = filterOut(names, ["Sensor"]);
  names = filterOut(names, ["SensorErrorEvent"]);
  // Indexed Database API 3.0
  // https://w3c.github.io/IndexedDB
  names = filterOut(names, [
    "IDBRequest", "IDBOpenDBRequest", "indexedDB", "IDBFactory", "IDBDatabase", "IDBObjectStore",
    "IDBIndex", "IDBKeyRange", "IDBCursor", "IDBCursorWithValue", "IDBTransaction",
  ]);
  names = filterOut(names, ["IDBVersionChangeEvent"]);
  // WebXR Device API
  // https://immersive-web.github.io/webxr/
  names = filterOut(names, [
    "XRSystem", "XRSession", "XRRenderState", "XRFrame", "XRSpace", "XRReferenceSpace", "XRBoundedReferenceSpace",
    "XRView", "XRViewport", "XRRigidTransform", "XRPose", "XRViewerPose", "XRInputSource", "XRInputSourceArray", "XRLayer",
    "XRWebGLLayer", "XRSessionEvent", "XRInputSourceEvent", "XRInputSourcesChangeEvent", "XRReferenceSpaceEvent",
    "XRPermissionStatus",
  ]);
  // Web MIDI API
  // https://webaudio.github.io/web-midi-api/
  names = filterOut(names, [
    "MIDIInputMap", "MIDIOutputMap", "MIDIAccess", "MIDIPort", "MIDIInput", "MIDIOutput", "MIDIMessageEvent",
    "MIDIConnectionEvent"
  ]);
  // Web Authentication
  // https://w3c.github.io/webauthn/
  names = filterOut(names, [
    "Credential", "PublicKeyCredential", "AuthenticatorResponse", "AuthenticatorAttestationResponse",
    "AuthenticatorAssertionResponse",
  ]);
  // DeviceOrientation Event Specification
  // https://w3c.github.io/deviceorientation/
  names = filterOut(names, [
    "ondeviceorientation", "DeviceOrientationEvent", "ondeviceorientationabsolute", "oncompassneedscalibration",
    "ondevicemotion", "DeviceMotionEventAcceleration", "DeviceMotionEventRotationRate", "DeviceMotionEvent",
  ]);
  // Trusted Types
  // https://w3c.github.io/webappsec-trusted-types/dist/spec/
  names = filterOut(names, [
    "TrustedHTML", "TrustedScript", "TrustedScriptURL", "TrustedTypePolicyFactory", "TrustedTypePolicy", "trustedTypes"
  ]);
  // Orientation Sensor
  // https://www.w3.org/TR/orientation-sensor/
  names = filterOut(names, ["OrientationSensor", "AbsoluteOrientationSensor", "RelativeOrientationSensor"]);
  // Accelerometer
  // https://www.w3.org/TR/accelerometer
  names = filterOut(names, ["Accelerometer", "LinearAccelerationSensor", "GravitySensor"]);
  // Gyroscope
  // https://w3c.github.io/gyroscope/
  names = filterOut(names, ["Gyroscope"]);
  // Proximity Sensor
  // https://w3c.github.io/proximity/
  names = filterOut(names, ["ProximitySensor"]);
  // Background Fetch
  // https://wicg.github.io/background-fetch/
  names = filterOut(names, ["BackgroundFetchManager", "BackgroundFetchRegistration", "BackgroundFetchRecord"]);
  // Geolocation API Specification
  // https://w3c.github.io/geolocation-api/
  names = filterOut(names, ["Geolocation", "GeolocationPosition", "GeolocationCoordinates", "GeolocationPositionError"]);
  // Gamepad
  // https://w3c.github.io/gamepad/
  names = filterOut(names, ["Gamepad", "GamepadButton", "GamepadEvent"]);
  // Gamepad Extensions
  // https://w3c.github.io/gamepad/extensions.html
  names = filterOut(names, ["GamepadHapticActuator", "GamepadPose"]);
  // Keyboard Map
  // https://wicg.github.io/keyboard-map/
  names = filterOut(names, ["KeyboardLayoutMap", "Keyboard"]);
  // Intersection Observer
  // https://wicg.github.io/keyboard-map/
  names = filterOut(names, ["IntersectionObserver", "IntersectionObserverEntry"]);
  // CSS Font Loading Module
  // https://drafts.csswg.org/css-font-loading-3/
  names = filterOut(names, ["FontFace", "FontFaceSet", "FontFaceSetLoadEvent"]);
  // Resize Observer
  // https://drafts.csswg.org/resize-observer/
  names = filterOut(names, ["ResizeObserver", "ResizeObserverEntry"]);
  // Push API
  // https://w3c.github.io/push-api/
  names = filterOut(names, ["PushManager", "PushSubscriptionOptions", "PushSubscription"]);
  // The Screen Orientation API
  // https://w3c.github.io/screen-orientation/
  names = filterOut(names, ["ScreenOrientation"]);
  // MediaStream Image Capture
  // https://w3c.github.io/mediacapture-image/
  names = filterOut(names, ["ImageCapture", "PhotoCapabilities", "MediaSettingsRange"]);
  // WebXR Hit Test Module
  // https://immersive-web.github.io/hit-test/
  names = filterOut(names, [
    "XRHitTestSource", "XRTransientInputHitTestSource", "XRHitTestResult", "XRTransientInputHitTestResult", "XRRay"
  ]);
  // WebXR DOM Overlays Module
  // https://immersive-web.github.io/dom-overlays/
  names = filterOut(names, ["XRDOMOverlayState"]);
  // Media Capture and Streams
  // https://w3c.github.io/mediacapture-main/
  names = filterOut(names, ["OverconstrainedError"]);
  // Network Information API
  // https://wicg.github.io/netinfo/
  names = filterOut(names, ["NetworkInformation"]);
  // Compression Streams
  // https://wicg.github.io/compression/
  names = filterOut(names, ["CompressionStream", "DecompressionStream"]);
  // Media Capture from DOM Elements
  // https://w3c.github.io/mediacapture-fromelement/
  names = filterOut(names, ["CanvasCaptureMediaStreamTrack", "DecompressionStream"]);
  // Beforeinstallprompt(PWA)
  // https://wicg.github.io/beforeinstallprompt (This is an unofficial proposal.)
  names = filterOut(names, ["BeforeInstallPromptEvent"]);
  // Battery Status API
  // https://w3c.github.io/battery/
  names = filterOut(names, ["BatteryManager"]);
  // DOM Parsing and Serialization
  // https://w3c.github.io/DOM-Parsing/
  names = filterOut(names, ["XMLSerializer"]);
  // Visual Viewport API
  // https://wicg.github.io/visual-viewport/
  names = filterOut(names, ["visualViewport", "VisualViewport"]);
  // WebVTT: The Web Video Text Tracks Format
  // https://w3c.github.io/webvtt/
  names = filterOut(names, ["VTTCue", "VTTRegion"]);
  // CSS Transitions
  // https://drafts.csswg.org/css-transitions/
  names = filterOut(names, ["TransitionEvent"]);
  // Document Object Model (DOM) Level 3 Events Specification
  // https://www.w3.org/TR/2011/WD-DOM-Level-3-Events-20110531/
  names = filterOut(names, ["TextEvent"]);
  // Reporting API
  // https://w3c.github.io/reporting/
  names = filterOut(names, ["ReportBody", "Report", "ReportingObserver"]);
  // Pointer Events
  // https://w3c.github.io/pointerevents/
  names = filterOut(names, ["PointerEvent"]);
  // Selection API
  // https://w3c.github.io/selection-api/
  names = filterOut(names, ["Selection", "getSelection"]);
  // Layout Instability API
  // https://wicg.github.io/layout-instability/
  names = filterOut(names, ["LayoutShift", "LayoutShiftAttribution"]);
  // Input Device Capabilities
  // https://wicg.github.io/input-device-capabilities/
  names = filterOut(names, ["InputDeviceCapabilities"]);
  // clientInformation
  // https://github.com/whatwg/html/issues/2379
  // Add window.clientInformation #2379
  // alias for navigator
  names = filterOut(names, ["clientInformation"]);
  // chrome
  names = filterOut(names, ["chrome"]);
  // Sets or retrieves whether objects are drawn offscreen before being made visible to the user.
  // There is no public standard that applies to this property.
  names = filterOut(names, ["offscreenBuffering"]);
  // alias for status
  // This feature is obsolete.
  // Although it may still work in some browsers, its use is discouraged since it could be removed at any time.
  // Try to avoid using it
  names = filterOut(names, ["defaultStatus", "defaultstatus"]);
  // https://lists.w3.org/Archives/Public/www-style/2010Aug/0201.html
  // it was removed from cssom standard
  names = filterOut(names, ["styleMedia"]);
  // https://developer.mozilla.org/en-US/docs/Web/API/Window/captureEvents
  // Non-standard
  // This feature is non-standard and is not on a standards track.
  // Do not use it on production sites facing the Web: it will not work for every user.
  // There may also be large incompatibilities between implementations and the behavior may change in the future.
  names = filterOut(names, ["captureEvents", "releaseEvents"]);
  // WebAssembly JavaScript Interface
  // https://webassembly.github.io/spec/js-api/
  names = filterOut(names, ["WebAssembly"]);
  // Text Fragments
  // https://wicg.github.io/scroll-to-text-fragment/
  names = filterOut(names, ["FragmentDirective"]);
  // Permissions Policy
  // This specification used to be named Feature Policy.
  // https://w3c.github.io/webappsec-feature-policy/
  names = filterOut(names, ["PermissionsPolicy", "permissionsPolicy", "PermissionsPolicyViolationReportBody", "FeaturePolicy"]);
  // XSLTProcessor
  // Non-standard
  // This feature is non-standard and is not on a standards track.
  // Do not use it on production sites facing the Web: it will not work for every user.
  // There may also be large incompatibilities between implementations and the behavior may change in the future.
  // https://dxr.mozilla.org/mozilla-central/source/dom/webidl/XSLTProcessor.webidl
  names = filterOut(names, ["XSLTProcessor"]);
  // Web Periodic Background Synchronization
  // https://wicg.github.io/background-sync/spec/PeriodicBackgroundSync-index.html
  names = filterOut(names, ["PeriodicSyncManager"]);
  // find
  // Non-standard
  // This feature is non-standard and is not on a standards track.
  // Do not use it on production sites facing the Web: it will not work for every user.
  // There may also be large incompatibilities between implementations and the behavior may change in the future.
  // https://developer.mozilla.org/en-US/docs/Web/API/Window/find
  names = filterOut(names, ["find"]);
  // Picture-in-Picture
  // https://w3c.github.io/picture-in-picture/
  names = filterOut(names, ["PictureInPictureWindow", "EnterPictureInPictureEvent"]);
  // Remote Playback API
  // https://www.w3.org/TR/remote-playback/
  names = filterOut(names, ["RemotePlayback"]);
  // Media Playback Quality
  // https://w3c.github.io/media-playback-quality/
  names = filterOut(names, ["VideoPlaybackQuality"]);
  // Web SQL Database
  // https://www.w3.org/TR/webdatabase/
  names = filterOut(names, ["openDatabase"]);
  // Accelerated Shape Detection in Images
  // https://wicg.github.io/shape-detection-api/
  names = filterOut(names, ["FaceDetector", "BarcodeDetector"]);

  names.map((i) => console.log(i));
  console.log(names.length);
}
