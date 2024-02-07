const fs = require('fs');
const { DocumentReaderApi, Result, Scenario, Source, TextFieldType, GraphicFieldType, Light,SecurityFeatureType,} = require('@regulaforensics/document-reader-webclient');

const { PORTRAIT, DOCUMENT_FRONT } = GraphicFieldType;
const { DOCUMENT_NUMBER, GIVEN_NAMES, SURNAME } = TextFieldType;

(async () => {
    const apiBasePath = process.env.API_BASE_PATH;
    let license = process.env.TEST_LICENSE;

    if (fs.existsSync('regula.license')) {
        license = fs.readFileSync('regula.license');
    }

    const api = new DocumentReaderApi({ basePath: apiBasePath });

    api.setLicense(license);

    const serverInfo = await api.ping();

    const white_page_0 = fs.readFileSync('/Users/estebansamayoa/Downloads/dpi_es.jpg').buffer;

    const request = {
        images: [
            {
                ImageData: white_page_0,
                light: Light.WHITE,
                page_idx: 0,
            },
        ],
        processParam: {
            scenario: Scenario.FULL_AUTH,
            resultTypeOutput: [
                // actual results
                Result.STATUS,
                Result.AUTHENTICITY,
                Result.TEXT,
                Result.IMAGES,
                Result.DOCUMENT_TYPE,
                Result.DOCUMENT_TYPE_CANDIDATES,
                Result.IMAGE_QUALITY,
                // legacy results
                Result.MRZ_TEXT,
                Result.VISUAL_TEXT,
                Result.BARCODE_TEXT,
                Result.RFID_TEXT,
                Result.VISUAL_GRAPHICS,
                Result.BARCODE_GRAPHICS,
                Result.RFID_GRAPHICS,
                Result.LEXICAL_ANALYSIS,
            ],
        },
    };

    const response = await api.process(request);

    const requestJson = JSON.stringify(request);
    const responseJson = response.json();

    const docOverallStatus = response.status.overallStatus;
    const docOpticalTextStatus = response.status.detailsOptical.text;

    const docNumberField = response.text.getField(DOCUMENT_NUMBER);
    const docNameField = response.text.getField(GIVEN_NAMES);
    const docNumberFieldByName = response.text.getFieldByName('Document Number');
    const docNamesField = response.text.getFieldByName('Given Names');
    const docLastNamesField = response.text.getFieldByName('Surname');

    const docNumberVisual = docNumberField.getValue(Source.VISUAL);
    const Name = docNameField.getValue(Source.TEXT);
    const LastName = docLastNamesField.getValue(Source.TEXT);
    const docNumberMrz = docNumberField.getValue(Source.MRZ);
    const docNumberVisualValidity = docNumberField.sourceValidity(Source.VISUAL);
    const docNumberMrzValidity = docNumberField.sourceValidity(Source.MRZ);
    const docNumberMrzVisualMatching = docNumberField.crossSourceComparison(Source.MRZ, Source.VISUAL);

    const docAuthenticity = response.authenticity();

    const docImagePattern = docAuthenticity.imagePatternChecks();
    const docImagePatternBlankChecks = docImagePattern.checksByElement(SecurityFeatureType.BLANK);

    const documentImage = response.images.getField(DOCUMENT_FRONT).getValue();
    const portraitField = response.images.getField(PORTRAIT);
    const portraitFromVisual = portraitField.getValue(Source.VISUAL);
    fs.appendFileSync('portrait.jpg', Buffer.from(portraitFromVisual));
    fs.appendFileSync('document-image.jpg', Buffer.from(documentImage));

    const docImageQuality = response.imageQualityChecks();

    console.log('-----------------------------------------------------------------');
    console.log(`            Web API version: ${serverInfo.version}`);
    console.log('-----------------------------------------------------------------');
    console.log(`           Document Overall Status: ${docOverallStatus}`);
    console.log(`            Document Number Visual: ${docNumberVisual}`);
    console.log(`            Given Name: ${Name}`);
    console.log(`            Last Name: ${LastName}`);
    console.log(`               Document Number MRZ: ${docNumberMrz}`);
    console.log(`Validity Of Document Number Visual: ${docNumberVisualValidity}`);
    console.log(`   Validity Of Document Number MRZ: ${docNumberMrzValidity}`);
    console.log(`      MRZ-Visual values comparison: ${docNumberMrzVisualMatching}`);
    console.log('-----------------------------------------------------------------');

    
    const lexResult = response.lowLvlResponse.resultByType(Result.LEXICAL_ANALYSIS);
    console.log(lexResult);
})();