//Use env Variable name with TESTTYPE on Jenkins.
// example testType = sanity node ./detox.tests.js | | xargs npm run detox-run:android
const fs = require('fs');
function createTestsList(testType) {
    if (testType == undefined) return "";
    try {
        const data = fs.readFileSync('detox.tests.json', 'utf-8');
        let tests = "";
        const type = String(testType);
        const testsData = JSON.parse(data);
        tests = testsData[type]?.join(" ");
        if(tests == undefined) return "";
        return tests;
    } catch (e) {
        // Do Nothing just jump to console.log(" ")
    }

}

console.log(createTestsList(process.env.TESTTYPE));
