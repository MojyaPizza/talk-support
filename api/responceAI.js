const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(express.json())

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey:"sk-xxxxxxxxxxxxxxxxxxxxxxxxxx",
});
const openai = new OpenAIApi(configuration);

app.post("/api/responceAI", function(req, res) {
  res.header('Access-Control-Allow-Methods', 'POST');

  // 1. ユーザの質問抽出
  const reqBodyJson = req.body;
  console.log("--- API Request Body ---")
  console.log(reqBodyJson)
  const question = reqBodyJson.quetion.toString();
  console.log("User Question : " + question);


  // 2. OpenAI API呼び出し
(async () => {
  var prompt = question;
  var response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
    temperature: 0.1,
    max_tokens: 256,
    stop: ["###"],
  });
  var resText = response.data.choices[0].text
  resText = resText.replace(/^ください/g, "")
  // Frontに返すJSON
  var resJson = {
    "answer"         : resText,
    "emotionalValue" : "happy",
    "secondsTime"    : new Date().getSeconds()
  }
  res.json(resJson);
 
})();
});
// ポート3001番でlistenする
app.listen(3001);
