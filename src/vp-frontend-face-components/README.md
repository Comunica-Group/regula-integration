# Face SDK Web Components

- [Overview](#overview)
- [Before you start](#before-you-start)
- [Compatibility](#compatibility)
- [Install via NPM](#install-via-npm)
- [Install via CDN](#install-via-cdn)
- [Settings](#settings)
- [Customization](#customization)
- [Events](#events)
- [Response](#response)
- [Attributes](#attributes)
- [Custom translations](#custom-translations)
- [Examples](#examples)
- [Additional resources](#additional-resources)

---

## Overview

The Face SDK web components let you add automatic capture of a user's selfie and liveness check to your web site. The components capture a face from the device camera and can either simply detect a face on the captured photo or confirm the face <a href="https://docs.regulaforensics.com/develop/overview/#liveness-detection" target="_blank">liveness</a>.

The available components are:

- `face-capture`
- `face-liveness`

The web components are based on WebAssembly (.wasm module), which is our core C++ code compiled for use in browsers and wrapped with a JS layer. It is exactly the same code as built for all the other platform SDK packages.

## Before you start

Please note that:

- The components work **only** under the HTTPS protocol on the web site.
- The components library does register the components on the web page itself, so make sure to import the library to your web site before adding the components to the web page code.
- We do not include polyfills for older browsers in the package. If you need to support older versions of browsers in your project, you can simply install the necessary package.  For example https://www.npmjs.com/package/@webcomponents/webcomponentsjs
## Compatibility

| Devices              | ![Chrome](https://raw.githubusercontent.com/alrra/browser-logos/main/src/chrome/chrome_48x48.png) | ![FireFox](https://raw.githubusercontent.com/alrra/browser-logos/main/src/firefox/firefox_48x48.png) | ![Safari](https://raw.githubusercontent.com/alrra/browser-logos/main/src/safari/safari_48x48.png) |
|:---------------------|:-------------------------------------------------------------------------------------------------:|:----------------------------------------------------------------------------------------------------:|:-------------------------------------------------------------------------------------------------:|
| **Mobile (iOS)**     |                                           99 (iOS14.4+)                                           |                                            99 (iOS14.4+)                                             |                                                11                                                 |
| **Mobile (Android)** |                                                69                                                 |                                                  63                                                  |                                                 -                                                 |
| **Desktop**          |                                                66                                                 |                                                  69                                                  |                                                11                                                 |

## Install via NPM

On the command line, navigate to the root directory of your project:

```
cd /path/to/project
```

Run the following command:

```
npm init
```
Answer the questions in the command line questionnaire.

Install `@regulaforensics/vp-frontend-face-components`:

```
npm i @regulaforensics/vp-frontend-face-components
```

Create `index.html` and `index.js` files in the root directory of the project.

Import `@regulaforensics/vp-frontend-face-components` into your `index.js`:

```javascript
import './node_modules/@regulaforensics/vp-frontend-face-components/dist/main.js';
```

In `index.html` connect `index.js` and add the name of the component you want to use. Available components:

1. `<face-capture></face-capture>` - for creating a face snapshot;
1. `<face-liveness></face-liveness>` - for performing liveness verification.

For example:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>My app</title>
  </head>
  <body>
    <face-capture></face-capture>
    <script type="module" src="index.js"></script>
  </body>
</html>
```

## Install via CDN

Connect the script in your `.html` file. CDN link: `unpkg.com/:package@:version/:file`

For example:

```html
<script src="https://unpkg.com/@regulaforensics/vp-frontend-face-components@latest/dist/main.js"></script>
```

Add the name of the component to the html, as in the example above.

## Settings

You can set any parameter using `settings`. Find below examples of applying all the settings at once and just some of them.

Example of using all the settings:

````javascript
const component = document.getElementsByTagName('face-liveness')[0];

component.settings = {
    locale: 'en',
    copyright: true,
    cameraId: '123',
    changeCamera: true,
    startScreen: true,
    closeDisabled: true,
    finishScreen: true,
    videoRecording: true,
    url: 'https://your-server.com',
    headers: {
        Authorization: 'Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ=='
    },
    tag: 'sessionIdValue',
    retryCount: 5,
    customization: {
        fontFamily: 'Noto Sans, sans-serif',
        fontSize: '16px',
        onboardingScreenStartButtonBackground: '#7E57C5',
        onboardingScreenStartButtonBackgroundHover: '#7c45b4',
        onboardingScreenStartButtonTitle: '#FFFFFF',
        onboardingScreenStartButtonTitleHover: '#FFFFFF',
        cameraScreenFrontHintLabelBackground: '#E8E8E8',
        onboardingScreenIllumination: 'https://path-to-image.com',
        onboardingScreenAccessories: 'data:image/svg+xml;base64,PHN2...',
        onboardingScreenCameraLevel: importedImage,
        cameraScreenFrontHintLabelText: '#000000',
        cameraScreenSectorActive: '#7E57C5',
        cameraScreenSectorTarget: '#BEABE2',
        cameraScreenStrokeNormal: '#7E57C5',
        processingScreenProgress: '#7E57C5',
        retryScreenRetryButtonBackground: '#7E57C5',
        retryScreenRetryButtonBackgroundHover: '#7c45b4',
        retryScreenRetryButtonTitle: '#FFFFFF',
        retryScreenRetryButtonTitleHover: '#FFFFFF',
        retryScreenEnvironmentImage: 'https://path-to-image.com',
        retryScreenPersonImage: 'data:image/svg+xml;base64,PHN2...',
        successScreenImage: importedImage,
    }
}

````

Example of using just the selected settings:

````javascript
const yourSettings = {
    locale: 'de',
    videoRecording: false,
    url: 'https://your-server.com',
    headers: {
        Authorization: 'Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ=='
    },
    customization: {
        fontFamily: 'Noto Sans, sans-serif',
        successScreenImage: importedImage,
    }
}

const component = document.getElementsByTagName('face-liveness')[0];

component.settings = yourSettings;

````

Here are all the available settings:


| Setting          | Info                                                                                                                                                                                                                                                                                                                                                                                                                                           | Data type |             Default value              |                                                                                             Values                                                                                             | Used in                         |
|:-----------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:---------:|:--------------------------------------:|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|---------------------------------|
| `locale`         | The language of the component.                                                                                                                                                                                                                                                                                                                                                                                                                 | `string`  |                  `en`                  | `ru`, `en`, `de`, `pl`, `it`, `hu`, `zh`, `sk`, `uk`, `fr`, `es`, `pt`, `ar`, `nl`, `id`, `vi`, `ko`, `ms`, `ro`, `el`, `tr`, `ja`, `cs`, `th`, `hi`, `bn`, `he`, `fi`, `sv`, `da`, `hr`, `no` | `face-liveness`, `face-capture` |
| `url`            | The backend URL.                                                                                                                                                                                                                                                                                                                                                                                                                               | `string`  | `https://faceapi.regulaforensics.com/` |                                                                                            any url                                                                                             | `face-liveness`                 |
| `copyright`      | Whether to show the Regula copyright footer.                                                                                                                                                                                                                                                                                                                                                                                                   | `boolean` |                `false`                 |                                                                                        `true`, `false`                                                                                         | `face-liveness`, `face-capture` |
| `cameraId`       | The ability to select a camera by defining the camera ID.                                                                                                                                                                                                                                                                                                                                                                                      | `string`  |              `undefined`               |                                                                                    `camera id string value`                                                                                    | `face-liveness`, `face-capture` |
| `changeCamera`   | Whether to show the camera switch button.                                                                                                                                                                                                                                                                                                                                                                                                      | `boolean` |                 `true`                 |                                                                                        `true`, `false`                                                                                         | `face-liveness`, `face-capture` |
| `startScreen`    | Whether to show the start screen with video instruction. If `true`, the start screen is shown. If `false`, no start screen is shown and instead the camera of the device is turned on automatically to capture the face.                                                                                                                                                                                                                       | `boolean` |                 `true`                 |                                                                                        `true`, `false`                                                                                         | `face-liveness`, `face-capture` |
| `finishScreen`   | Whether to show the finish screen (`success screen`, `retry-screen`). If `true`, the finish screen is shown. If `false`, no finish screen will be displayed, and **the user will only have one attempt to pass the liveness check**.                                                                                                                                                                                                           | `boolean` |                 `true`                 |                                                                                        `true`, `false`                                                                                         | `face-liveness`, `face-capture` |
| `closeDisabled`  | Whether to disable the "Close" button of the component. If set to `true`, the "Close" button is hidden from the user.                                                                                                                                                                                                                                                                                                                          | `boolean` |                `false`                 |                                                                                        `true`, `false`                                                                                         | `face-liveness`, `face-capture` |
| `videoRecording` | Whether to enable the video recording of the process. If set to `true`, the video is sent to the server. The video format depends on the browser: MP4 for Safari, WEB for other browsers.                                                                                                                                                                                                                                                      | `boolean` |                `false`                 |                                                                                        `true`, `false`                                                                                         | `face-liveness`                 |
| `tag`            | The server generates a unique identifier for each session before starting a verification process. Using `tag`, you can set a custom value. Make sure that `tag` is unique for each session.                                                                                                                                                                                                                                                    | `string`  |              `undefined`               |                                                                                  any unique for each session                                                                                   | `face-liveness`                 |
| `retryCount`     | Using the `retryCount` setter, you can set the number of liveness transaction attempts for the user. Once the attempts are exhausted, the component will display a white screen and throw the "RETRY_COUNTER_EXCEEDED" event. By default, the number of attempts is unlimited. Setting the value to **0** removes the limit on the number of attempts, while any positive number limits the attempts.                                          | `number`  |                  `-1`                  |                                                                                  number of the attempts count                                                                                  | `face-liveness`                 |
| `headers`        | Before starting the camera capture, the component sends a `start` request to the server and receives the initialization data in response. Once the component successfully completes two stages of verification, it sends the received data to the API for processing. You can use the `headers` setter to set the headers for the HTTP POST method. Additionally, the video recording is transmitted to the server along with these `headers`. | `object`  |              `undefined`               |                                                                                object with headers (key, value)                                                                                | `face-liveness`                 |
| `customization`  | You can customize element colors, fonts, and images using this object. See the customization section  below.                                                                                                                                                                                                                                                                                                                                   | `object`  |              `undefined`               |                                                                               object with customization settings                                                                               | `face-liveness`, `face-capture` |
| `nonce`          | You can set a unique nonce value to maintain the CSP policy.                                                                                                                                                                                                                                                                                                                                                                                   | `string`  |              `undefined`               |                                                                                       unique nonce value                                                                                       | `face-liveness`, `face-capture` |

## Customization

You can customize colors of some elements, fonts, and images using the `customization` field in the `settings` object. The customization settings are the following:

| Setting                                      | Info                                                                         | Migrate from            |            Data type            |      Default value      |
|:---------------------------------------------|:-----------------------------------------------------------------------------|-------------------------|:-------------------------------:|:-----------------------:|
| `fontFamily`                                 | The component font.                                                          | `--font-family`         |             string              | `Noto Sans, sans-serif` |
| `fontSize`                                   | The component base font size.                                                | `--font-size`           |             string              |         `16px`          |
| `onboardingScreenStartButtonBackground`      | The instruction screen button background color.                              | `--main-color`          |             string              |        `#7E57C5`        |
| `onboardingScreenStartButtonBackgroundHover` | The instruction screen button background hover color.                        | `--hover-color`         |             string              |        `#7C45B4`        |
| `onboardingScreenStartButtonTitle`           | The instruction screen button text color.                                    |                         |             string              |        `#FFFFFF`        |
| `onboardingScreenStartButtonTitleHover`      | The instruction screen button text hover color.                              |                         |             string              |        `#FFFFFF`        |
| `onboardingScreenIllumination`               | The instruction screen "Illumination" icon image.                            |                         | base64 or url or imported image |           ``            |
| `onboardingScreenAccessories`                | The instruction screen "No accessories" icon image.                          |                         | base64 or url or imported image |           ``            |
| `onboardingScreenCameraLevel`                | The instruction screen "Camera level" icon image.                            |                         | base64 or url or imported image |           ``            |
| `cameraScreenFrontHintLabelBackground`       | The camera screen plate with info-message background color.                  | `--plate-color`         |             string              |        `#E8E8E8`        |
| `cameraScreenFrontHintLabelText`             | The camera screen plate with info-message text color.                        |                         |             string              |        `#000000`        |
| `cameraScreenSectorActive`                   | The user progress sector color (available only in  face-liveness component). |                         |             string              |        `#7E57C5`        |
| `cameraScreenSectorTarget`                   | The target sector color (available only in face-liveness component).         | `--target-sector-color` |             string              |        `#BEABE2`        |
| `cameraScreenStrokeNormal`                   | The stroke color of the camera circle.                                       |                         |             string              |        `#7E57C5`        |
| `processingScreenProgress`                   | The processing screen spinner color.                                         |                         |             string              |        `#7E57C5`        |
| `retryScreenEnvironmentImage`                | The Retry screen environment image.                                          |                         | base64 or url or imported image |           ``            |
| `retryScreenPersonImage`                     | The Retry screen person image.                                               |                         | base64 or url or imported image |           ``            |
| `retryScreenRetryButtonBackground`           | The Retry screen button background color.                                    | `--main-color`          |             string              |        `#7E57C5`        |
| `retryScreenRetryButtonBackgroundHover`      | The Retry screen button background hover color.                              | `--hover-color`         |             string              |        `#7C45B4`        |
| `retryScreenRetryButtonTitle`                | The Retry screen button text color.                                          |                         |             string              |        `#FFFFFF`        |
| `retryScreenRetryButtonTitleHover`           | The Retry screen button text hover color.                                    |                         |             string              |        `#FFFFFF`        |
| `successScreenImage`                         | The Success screen image.                                                    |                         | base64 or url or imported image |           ``            |

For example:

```javascript
const component = document.getElementsByTagName('face-liveness')[0]; 

component.settings = {
    ...otherSettings,
    customization: {
        fontFamily: 'Noto Sans, sans-serif',
        fontSize: '16px',
        onboardingScreenStartButtonBackground: '#7E57C5',
        onboardingScreenStartButtonBackgroundHover: '#7c45b4',
        retryScreenPersonImage: 'data:image/svg+xml;base64,PHN2...',
    }
}

```


## Events

You can subscribe to the component events.

For example:

```javascript
const faceLivenessComponent = document.getElementsByTagName('face-liveness')[0]; 
const faceCaptureComponent = document.getElementsByTagName('face-capture')[0];

faceLivenessComponent.addEventListener('face-liveness', (event) => console.log(event.detail)); // event listener for face-liveness component
faceCaptureComponent.addEventListener('face-capture', (event) => console.log(event.detail)); // event listener for face-capture component
```

The `face-liveness` type of event is generated for the face-liveness component, and `face-capture` type of event is generated for the face-capture component.

The generated event object (`event.detail`) contains three fields that describe the event:

```javascript
{
  action: "PRESS_START_BUTTON", // the type of action that generated the event (all actions are described in the table below)
  data: null, // component data
  manual: true // event generated by user action or component by itself
}
```

Type of actions:

| Type of action           |                                Description of the action                                |          The component          |
|:-------------------------|:---------------------------------------------------------------------------------------:|:-------------------------------:|
| `ELEMENT_VISIBLE`        |                          The component is appended in the DOM.                          | `face-liveness`, `face-capture` |
| `PRESS_START_BUTTON`     |                          The "Get started" button is pressed.                           | `face-liveness`, `face-capture` |
| `PRESS_RETRY_BUTTON`     |                             The "Retry" button is pressed.                              | `face-liveness`, `face-capture` |
| `CLOSE`                  |                             The "Close" button is pressed.                              | `face-liveness`, `face-capture` |
| `PROCESS_FINISHED`       |                          The component has finished its work.                           | `face-liveness`, `face-capture` |
| `SERVICE_INITIALIZED`    |                           The component has started its work.                           | `face-liveness`, `face-capture` |
| `RETRY_COUNTER_EXCEEDED` | The component has finished its work due to the exceeded number of transaction attempts. |         `face-liveness`         |

In cases of successful operation of the components, the `data` field will contain the following fields:

```javascript
{
  response: { ... }, // component result
  status: 1 // 1 for successful work and 0 for unsuccessful
}
```

In cases of unsuccessful work, the `data` field will contain the following fields:

```javascript
{
  reason: "CAMERA_PERMISSION_DENIED", // error reason (possible causes of errors are described in the table below)
  status: 0
}
```

Table of event causes:

| Reason                      |                                        Description of the reason                                        |
|:----------------------------|:-------------------------------------------------------------------------------------------------------:|
| `WASM_ERROR`                |                                             Error in WASM.                                              |
| `UNKNOWN_ERROR`             |                                             Unknown error.                                              |
| `NOT_SUPPORTED`             |                                      The browser is not supported.                                      |
| `CAMERA_UNKNOWN_ERROR`      |                                          Unknown camera error.                                          |
| `CAMERA_PERMISSION_DENIED`  |                                   Access to the camera is prohibited.                                   |
| `NO_CAMERA`                 |                                           There is no camera.                                           |
| `CONNECTION_ERROR`          |                                           Connection errors.                                            |
| `LANDSCAPE_MODE_RESTRICTED` |                              Work in landscape orientation is prohibited.                               |
| `TIMEOUT_ERROR`             |                                   Transaction failed due to timeout.                                    |
| `CHANGE_CAMERA`             | The user has changed the camera. Return to start-screen or restart service if start-screen is disabled. |
| `DEVICE_ROTATE`             | The user has rotated the device. Return to start-screen or restart service if start-screen is disabled. |
| `APP_INACTIVE`              |                      The user has closed the tab or browser during the face capture process.                       |
| `INCORRECT_CAMERA_ID`       |                                  No camera with the specified ID found.                                  |

The table below describes the cases of event generation:

### face-liveness & face-capture

<table>
<thead>
<tr>
<th>Event condition </th>
<th>Event type</th>
<th>

Event object `event.detail`
</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>The component is mounted in the DOM.</td>
<td>

`face-liveness`
<br>
<br>
`face-capture`

</td>
<td>

```javascript
{
  action: "ELEMENT_VISIBLE", 
  data: null
}
```

</td>
<td>

To receive this event, you must wrap the component in another element (for example, a div) and add an addEventListener to it. When the component appears in the DOM, the event will pop up.

For example:

```html
<div id="add-event-listener-to-this-element">
  <face-liveness></face-liveness>
</div>
```

</td>
</tr>
<tr>
<td>The "Get started" button is pressed.</td>
<td>

`face-liveness`
<br>
<br>
`face-capture`

</td>
<td>

```javascript
{
  action: "PRESS_START_BUTTON", 
  data: null
}
```

</td>
<td></td>
</tr>
<tr>
<td>The "Retry" button is pressed.</td>
<td>

`face-liveness`
<br>
<br>
`face-capture`

</td>
<td>

```javascript
{
  action: "PRESS_RETRY_BUTTON", 
  data: null
}
```

</td>
<td></td>
</tr>
<tr>
<td>The "Close" button is pressed.</td>
<td>

`face-liveness`
<br>
<br>
`face-capture`

</td>
<td>

```javascript
{
  action: "CLOSE", 
  data: null
}
```

</td>
<td></td>
</tr>
<tr>
<td>The work of the component is completed successfully.</td>
<td>

`face-liveness`
<br>
<br>
`face-capture`

</td>
<td>

```javascript
{
  action: "PROCESS_FINISHED", 
  data: {
    response: { ... },
    status: 1
  },
}
```

</td>
<td></td>
</tr>
<tr>
<td>The work of the component failed.</td>
<td>

`face-liveness`
<br>
<br>
`face-capture`

</td>
<td>

```javascript
{
  action: "PROCESS_FINISHED", 
  data: {
    reason: "An event has occurred",
    status: 0
  },
}
```

</td>
<td></td>
</tr>
<tr>
<td>The work of the component finished by timeout.</td>
<td>

`face-liveness`
<br>
<br>
`face-capture`

</td>
<td>

```javascript
{
  action: "PROCESS_FINISHED", 
  data: {
    reason: "TIMEOUT_ERROR"
    status: 0
  },
}
```

</td>
<td></td>
</tr>
<tr>
<td>The component is initialized and ready to work.</td>
<td>

`face-liveness`
<br>
<br>
`face-capture`

</td>
<td>

```javascript
{
  action: "SERVICE_INITIALIZED",
  data: null
}
```

</td>
<td></td>
</tr>
</tbody>
</table>

## Response

You can get the response of the component in the `detail` field of the event object.

For example:

```javascript
const component = document.getElementsByTagName('face-capture')[0];

function listener(event) {
    if (event.detail.action === 'PROCESS_FINISHED' && event.detail.data.status === 1) {
        const response = event.detail.data.response;
        console.log(response);
    }
}

component.addEventListener('face-capture', listener);
```

The `face-liveness` response has the following structure:

```javascript
{
  code: number // Result codes from core lib
  metadata: {
    [key: string]: any
  };
  tag: string
  status: number // liveness status: 0 if the person's liveness is confirmed, 1 if not. 
  estimatedAge: number | null // approximate age with an accuracy of +/-3 years
  transactionId: string
  images: string[] // array with the final image in base64 
}
````

The `face-capture` response has the following structure:

```javascript
{
  capture: string[] // array with the final image in base64 
}
```

## Attributes

**Warning**. Passing parameters via attributes is deprecated. In future versions, support will be discontinued. Please use the settings.

### face-capture

| Attribute          | Info                                                                                                                                                                                                                                 | Data type | Default value |                                                                                             Values                                                                                             |
|:-------------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:---------:|:-------------:|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
| **locale**         | The language of the component.                                                                                                                                                                                                       |  string   |     `en`      | `ru`, `en`, `de`, `pl`, `it`, `hu`, `zh`, `sk`, `uk`, `fr`, `es`, `pt`, `ar`, `nl`, `id`, `vi`, `ko`, `ms`, `ro`, `el`, `tr`, `ja`, `cs`, `th`, `hi`, `bn`, `he`, `fi`, `sv`, `da`, `hr`, `no` |
| **copyright**      | Whether to show the Regula copyright footer.                                                                                                                                                                                         |  boolean  |    `false`    |                                                                                        `true`, `false`                                                                                         |
| **camera-id**      | Ability to select a camera.                                                                                                                                                                                                          |  string   |  `undefined`  |                                                                                    `camera id string value`                                                                                    |
| **change-camera**  | Whether to show the camera switch button.                                                                                                                                                                                            |  boolean  |    `true`     |                                                                                        `true`, `false`                                                                                         |
| **start-screen**   | Whether to show the start screen with video instructions. If `true`, the start screen is shown. If `false`, no start screen is shown and instead the camera of the device is turned on automatically to capture the face.            |  boolean  |    `true`     |                                                                                        `true`, `false`                                                                                         |
| **finish-screen**  | Whether to show the finish screen (`success screen`, `retry-screen`). If `true`, the finish screen is shown. If `false`, no finish screen will be displayed, and **the user will only have one attempt to pass the liveness check**. |  boolean  |    `true`     |                                                                                        `true`, `false`                                                                                         |
| **close-disabled** | Whether to disable the "Close" button of the component. If set to `true`, the "Close" button is hidden from the user.                                                                                                                |  boolean  |    `false`    |                                                                                        `true`, `false`                                                                                         |

### face-liveness

| Attribute           | Info                                                                                                                                                                                                                                 | Data type |             Default value              |                                                                                             Values                                                                                             |
|:--------------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:---------:|:--------------------------------------:|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
| **locale**          | The language of the component.                                                                                                                                                                                                       |  string   |                  `en`                  | `ru`, `en`, `de`, `pl`, `it`, `hu`, `zh`, `sk`, `uk`, `fr`, `es`, `pt`, `ar`, `nl`, `id`, `vi`, `ko`, `ms`, `ro`, `el`, `tr`, `ja`, `cs`, `th`, `hi`, `bn`, `he`, `fi`, `sv`, `da`, `hr`, `no` |
| **url**             | The backend URL.                                                                                                                                                                                                                     |  string   | `https://faceapi.regulaforensics.com/` |                                                                                            any url                                                                                             |
| **copyright**       | Whether to show the Regula copyright footer.                                                                                                                                                                                         |  boolean  |                `false`                 |                                                                                        `true`, `false`                                                                                         |
| **camera-id**       | The ability to select a camera by defining the camera ID.                                                                                                                                                                            |  string   |              `undefined`               |                                                                                    `camera id string value`                                                                                    |
| **change-camera**   | Whether to show the camera switch button.                                                                                                                                                                                            |  boolean  |                 `true`                 |                                                                                        `true`, `false`                                                                                         |
| **start-screen**    | Whether to show the start screen with video instruction. If `true`, the start screen is shown. If `false`, no start screen is shown and instead the camera of the device is turned on automatically to capture the face.             |  boolean  |                 `true`                 |                                                                                        `true`, `false`                                                                                         |
| **finish-screen**   | Whether to show the finish screen (`success screen`, `retry-screen`). If `true`, the finish screen is shown. If `false`, no finish screen will be displayed, and **the user will only have one attempt to pass the liveness check**. |  boolean  |                 `true`                 |                                                                                        `true`, `false`                                                                                         |
| **close-disabled**  | Whether to disable the "Close" button of the component. If set to `true`, the "Close" button is hidden from the user.                                                                                                                |  boolean  |                `false`                 |                                                                                        `true`, `false`                                                                                         |
| **video-recording** | Whether to enable the video recording of the process. If set to `true`, the video is sent to the server. The video format depends on the browser: MP4 for Safari, WEB for other browsers.                                            |  boolean  |                `false`                 |                                                                                        `true`, `false`                                                                                         |


## Custom translations

To change the standard component messages or any text, specify the language you are using (or add your own) and the label you want to change (you can see the list of available languages in the [attributes](#component-attributes) section, the `locale` attribute):

```javascript
const element = document.querySelector('face-liveness');

element.translations = {
   en: { 
     selfieTime: 'Get Selfie',
   },
};
```

**Note**. To see the changes, don't forget to set the language you changed to the `locale` attribute:

```html
<face-liveness locale="en"></face-liveness>
```

The list of labels used in the component:

| Label                         | Default message in `en` locale                                                                      |             Used in             |
|:------------------------------|:----------------------------------------------------------------------------------------------------|:-------------------------------:|
| **showOnlyOneFace**           | Make sure there is only one face on the screen.                                                     | `face-liveness`, `face-capture` |
| **preparingCamera**           | Preparing the camera...                                                                             | `face-liveness`, `face-capture` |
| **allowAccessCamera**         | Allow access to the camera                                                                          | `face-liveness`, `face-capture` |
| **somethingWentWrong**        | Something went wrong                                                                                | `face-liveness`, `face-capture` |
| **incorrectCameraId**         | No camera with the specified ID found.                                                              | `face-liveness`, `face-capture` |
| **checkCameraId**             | Check if the specified camera ID is correct.                                                        | `face-liveness`, `face-capture` |
| **preparingService**          | Preparing the service...                                                                            | `face-liveness`, `face-capture` |
| **allowAccessToCamera**       | Allow access to the camera and reload this page to continue.                                        | `face-liveness`, `face-capture` |
| **error**                     | Error!                                                                                              | `face-liveness`, `face-capture` |
| **versionNotSupported**       | Your browser version is not supported.                                                              | `face-liveness`, `face-capture` |
| **updateBrowser**             | Update your browser version                                                                         | `face-liveness`, `face-capture` |
| **licenseError**              | A license error has occurred                                                                        | `face-liveness`, `face-capture` |
| **licenseExpired**            | The license cannot be found or has expired                                                          | `face-liveness`, `face-capture` |
| **onlyPortraitOrientation**   | Portrait orientation only                                                                           | `face-liveness`, `face-capture` |
| **turnDeviceIntoPortrait**    | Please turn your device into portrait mode                                                          | `face-liveness`, `face-capture` |
| **tryAgain**                  | Try again                                                                                           | `face-liveness`, `face-capture` |
| **noCameraAvailable**         | No camera available                                                                                 | `face-liveness`, `face-capture` |
| **checkCameraConnection**     | Check the camera connection and try again.                                                          | `face-liveness`, `face-capture` |
| **lookStraight**              | Look straight                                                                                       | `face-liveness`, `face-capture` |
| **fitYourFace**               | Center your face                                                                                    | `face-liveness`, `face-capture` |
| **moveCloser**                | Move closer                                                                                         | `face-liveness`, `face-capture` |
| **moveAway**                  | Move away                                                                                           | `face-liveness`, `face-capture` |
| **holdSteady**                | Hold steady                                                                                         | `face-liveness`, `face-capture` |
| **processing**                | Processing...                                                                                       | `face-liveness`, `face-capture` |
| **retryButtonText**           | Retry                                                                                               | `face-liveness`, `face-capture` |
| **followGuidelinesText**      | But please follow these guidelines:                                                                 | `face-liveness`, `face-capture` |
| **letsTryAgainTitle**         | Let’s try that again                                                                                | `face-liveness`, `face-capture` |
| **noCameraPermission**        | Camera unavailable!                                                                                 | `face-liveness`, `face-capture` |
| **goButton**                  | Go                                                                                                  | `face-liveness`, `face-capture` |
| **selfieTime**                | Selfie time!                                                                                        | `face-liveness`, `face-capture` |
| **ambientLighting**           | Ambient lighting is not too bright or too dark and there are no shadows or glare on your face       |         `face-liveness`         |
| **noMaskSunglassesHeaddress** | Neutral facial expression (no smiling, eyes open and mouth closed), no mask, sunglasses or headwear |         `face-liveness`         |
| **turnHead**                  | Turn your head a bit                                                                                |         `face-liveness`         |
| **centerFaceTurnHead**        | Center your face, turn your head                                                                    |         `face-liveness`         |
| **centerFace**                | Center your face                                                                                    |         `face-capture`          |
| **errorCode**                 | Error code:                                                                                         |         `face-liveness`         |
| **illumination**              | Good illumination.                                                                                  | `face-liveness`, `face-capture` |
| **cameraLevel**               | Camera at eye level.                                                                                | `face-liveness`, `face-capture` |
| **noAccessories**             | No accessories: glasses, mask, hat, etc.                                                            | `face-liveness`, `face-capture` |
| **getReady**                  | Get ready                                                                                           | `face-liveness`, `face-capture` |

## Examples

You can find examples of using the components on the <a href="https://github.com/regulaforensics/face-web-components-samples" target="_blank">Samples page</a>.

## Additional resources

The Face SDK web components are also available on <a href="https://storybook-face.regulaforensics.com/" target="_blank">Storybook</a>.
