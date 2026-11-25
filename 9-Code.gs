// Set your own private PIN here before deploying. Do not commit a real PIN to a public repository.
const ADMIN_PIN = "REPLACE_WITH_YOUR_PRIVATE_PIN";

function doGet(e) {
  const viewMode = (e && e.parameter && e.parameter.view) ? String(e.parameter.view).toLowerCase() : '';

  if (viewMode === 'admin') {
    return HtmlService.createTemplateFromFile('Admin')
      .evaluate()
      .setTitle('NileNet Submissions Dashboard')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
  }

  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('NileNet ISP Evaluation')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function processSurvey(formObj) {
  formObj = formObj || {};

  // Numeric score points
  const p1 = parseInt(formObj.q1 || 0, 10);
  const p2_rel = parseInt(formObj.q2_rel || 0, 10);
  const p2_spd = parseInt(formObj.q2_spd || 0, 10);
  const p3 = parseInt(formObj.q3 || 0, 10);
  const q4_val = formObj.q4 || 'N/A';
  const p5 = parseInt(formObj.q5 || 0, 10);
  const p6 = parseInt(formObj.q6 || 0, 10);

  // Q4 contributes 0 points (Max total: 30)
  const totalScore = p1 + p2_rel + p2_spd + p3 + p5 + p6;

  // Text conversion for clean admin view
  const mapQ1 = { 5: 'Excellent', 3: 'Good', 1: 'Poor' };
  const mapQ2 = { 5: 'Excellent', 4: 'Very Good', 3: 'Good', 2: 'Fair', 1: 'Poor' };
  const mapQ3 = { 5: 'Excellent', 3: 'Adequate', 1: 'Poor' };
  const mapQ5 = {
    5: 'Well-presented and understandable',
    3: 'Sufficient to solve the problem',
    2: 'Difficult to understand',
    1: 'Problem not solved'
  };
  const mapQ6 = { 5: 'Yes', 3: 'Undecided', 1: 'No' };

  try {
    const scriptProps = PropertiesService.getScriptProperties();
    const existingData = scriptProps.getProperty('RESPONSES');
    let responses = existingData ? JSON.parse(existingData) : [];

    responses.unshift({
      timestamp: new Date().toLocaleString(),
      q1: mapQ1[p1] || 'N/A',
      q2_rel: mapQ2[p2_rel] || 'N/A',
      q2_spd: mapQ2[p2_spd] || 'N/A',
      q3: mapQ3[p3] || 'N/A',
      q4: q4_val,
      q5: mapQ5[p5] || 'N/A',
      q6: mapQ6[p6] || 'N/A',
      score: totalScore
    });

    scriptProps.setProperty('RESPONSES', JSON.stringify(responses));
  } catch (err) {
    Logger.log('Storage error: ' + err.toString());
  }

  let message = "";
  if (totalScore >= 22) {
    message = "We hope our service meets your expectations, looking forward to performing better every day!";
  } else if (totalScore >= 15 && totalScore <= 21) {
    message = "We are sorry we did not perform as well as we intended. Please call 1122 so we can provide a small compensation for this misunderstanding.";
  } else {
    message = "We are deeply sorry for your experience. Please accept next month's package for free when you call 1221.";
  }

  return {
    score: totalScore,
    maxScore: 30,
    message: message
  };
}

function getSubmissions(pin) {
  if (pin !== ADMIN_PIN) {
    throw new Error('Invalid PIN code.');
  }
  const scriptProps = PropertiesService.getScriptProperties();
  const raw = scriptProps.getProperty('RESPONSES');
  return raw ? JSON.parse(raw) : [];
}

function clearSubmissions(pin) {
  if (pin !== ADMIN_PIN) {
    throw new Error('Invalid PIN code.');
  }
  PropertiesService.getScriptProperties().deleteProperty('RESPONSES');
  return true;
}
