type Locales =
    | 'ru'
    | 'en'
    | 'de'
    | 'pl'
    | 'it'
    | 'hu'
    | 'zh'
    | 'sk'
    | 'uk'
    | 'fr'
    | 'es'
    | 'pt'
    | 'ar'
    | 'nl'
    | 'id'
    | 'vi'
    | 'ko'
    | 'ms'
    | 'ro'
    | 'el'
    | 'tr'
    | 'ja'
    | 'cs'
    | 'th'
    | 'hi'
    | 'bn'
    | 'he'
    | 'fi'
    | 'sv'
    | 'da'
    | 'hr'
    | 'no'
    | string;
interface FaceTranslations {
    showOnlyOneFace?: string;
    preparingCamera?: string;
    allowAccessCamera?: string;
    somethingWentWrong?: string;
    incorrectCameraId?: string;
    checkCameraId?: string;
    preparingService?: string;
    allowAccessToCamera?: string;
    error?: string;
    versionNotSupported?: string;
    updateBrowser?: string;
    licenseError?: string;
    licenseExpired?: string;
    onlyPortraitOrientation?: string;
    turnDeviceIntoPortrait?: string;
    tryAgain?: string;
    noCameraAvailable?: string;
    checkCameraConnection?: string;
    noMaskSunglassesHeaddress?: string;
    ambientLighting?: string;
    lookStraight?: string;
    fitYourFace?: string;
    moveCloser?: string;
    moveAway?: string;
    holdSteady?: string;
    turnHead?: string;
    processing?: string;
    retryButtonText?: string;
    followGuidelinesText?: string;
    letsTryAgainTitle?: string;
    noCameraPermission?: string;
    goButton?: string;
    centerFaceTurnHead?: string;
    centerFace?: string;
    selfieTime?: string;
    errorCode?: string;
    illumination?: string;
    cameraLevel?: string;
    noAccessories?: string;
    getReady?: string;
}

type FaceDictionaries = Partial<Record<Locales, FaceTranslations>>;

type ErrorTypes =
    | 'WASM_ERROR'
    | 'UNKNOWN_ERROR'
    | 'NOT_SUPPORTED'
    | 'CAMERA_UNKNOWN_ERROR'
    | 'CAMERA_PERMISSION_DENIED'
    | 'NO_CAMERA'
    | 'INCORRECT_CAMERA_ID'
    | 'CONNECTION_ERROR'
    | 'LANDSCAPE_MODE_RESTRICTED'
    | 'NOT_PREPARED'
    | 'NOT_INITIALIZED'
    | 'IN_PROCESS'
    | 'ALREADY_PREPARED'
    | 'ALREADY_INITIALIZED'
    | 'TIMEOUT_ERROR'
    | 'CHANGE_CAMERA'
    | 'DEVICE_ROTATE'
    | 'APP_INACTIVE';

type FaceEventActions =
    | 'ELEMENT_VISIBLE'
    | 'PRESS_START_BUTTON'
    | 'PRESS_RETRY_BUTTON'
    | 'CLOSE'
    | 'PROCESS_FINISHED'
    | 'SERVICE_INITIALIZED'
    | 'RETRY_COUNTER_EXCEEDED';

declare enum ResponseCode {
    EMPTY = -1,
    ERROR = 0,
    OK = 1,
    TIMEOUT = 2,
}

type CustomEventDataType<R> = {
    status: ResponseCode;
    reason?: ErrorTypes;
    response?: R;
};

interface DetailEvent<A, R> {
    action: A;
    data: CustomEventDataType<R> | null;
}

type FaceLivenessResponseType = {
    images: Array<string>;
    code: number;
    metadata: Record<string, any>;
    estimatedAge: number | null;
    tag: string;
    status: number;
    transactionId: string;
};

type FaceDetectionResponseType = {
    capture: Array<string>;
};

declare global {
    interface HTMLElementEventMap {
        'face-liveness': CustomEvent<FaceLivenessDetailType>;
        'face-capture': CustomEvent<FaceCaptureDetailType>;
    }
}

export interface IFaceDetection {
    locale?: Locales | string;
    copyright?: boolean;
    'camera-id'?: string;
    'change-camera'?: boolean;
    'start-screen'?: boolean;
    debug?: boolean;
    'close-disabled'?: boolean;
    'finish-screen'?: boolean;
}

export interface IFaceLiveness extends IFaceDetection {
    url?: string;
    'device-orientation'?: boolean;
    'video-recording'?: boolean;
}

export type ComputedCss = {
    fontFamily?: string;
    fontSize?: string;
    onboardingScreenStartButtonBackground?: string;
    onboardingScreenStartButtonBackgroundHover?: string;
    onboardingScreenStartButtonTitle?: string;
    onboardingScreenStartButtonTitleHover?: string;
    onboardingScreenIllumination?: string;
    onboardingScreenAccessories?: string;
    onboardingScreenCameraLevel?: string;
    cameraScreenSectorTarget?: string;
    cameraScreenSectorActive?: string;
    cameraScreenStrokeNormal?: string;
    retryScreenRetryButtonBackground?: string;
    retryScreenRetryButtonBackgroundHover?: string;
    retryScreenRetryButtonTitle?: string;
    retryScreenRetryButtonTitleHover?: string;
    processingScreenProgress?: string;
    cameraScreenFrontHintLabelBackground?: string;
    cameraScreenFrontHintLabelText?: string;
    successScreenImage?: string;
    retryScreenEnvironmentImage?: string;
    retryScreenPersonImage?: string;
};
interface FaceDetectionSettings {
    url?: string;
    debug?: boolean;
    locale?: Locales | string;
    copyright?: boolean;
    cameraId?: string;
    changeCamera?: boolean;
    closeDisabled?: boolean;
    finishScreen?: boolean;
    startScreen?: boolean;
    customization?: ComputedCss;
    nonce?: string;
    holdStillDuration?: number;
    timeoutInterval?: number;
}

interface FaceLivenessSettings extends Omit<FaceDetectionSettings, 'holdStillDuration' | 'timeoutInterval'> {
    url?: string;
    deviceOrientation?: boolean;
    videoRecording?: boolean;
    tag?: string;
    headers?: Record<string, string>;
    retryCount?: number;
}

export type FaceLivenessDetailType = DetailEvent<FaceEventActions, FaceLivenessResponseType>;
export type FaceCaptureDetailType = DetailEvent<FaceEventActions, FaceDetectionResponseType>;

export class FullScreenContainer extends HTMLElement {}

export class FaceDetectionWebComponent extends HTMLElement {
    get version(): string;
    set translations(dictionary: FaceDictionaries | null);
    get translations(): FaceDictionaries | null;
    get settings(): FaceDetectionSettings;
    set settings(params: FaceDetectionSettings);
}
export class FaceLivenessWebComponent extends HTMLElement {
    get version(): string;
    set translations(dictionary: FaceDictionaries | null);
    get translations(): FaceDictionaries | null;
    get settings(): FaceLivenessSettings;
    set settings(params: FaceLivenessSettings);
}
