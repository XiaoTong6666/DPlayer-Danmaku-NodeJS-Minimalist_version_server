const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(cors());
const server = require('http').createServer(app);
const port = process.env.PORT || 200;
mongoose.connect('mongodb://127.0.0.1:27017/danmaku', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const DanmakuSchema = new mongoose.Schema({
  text: String,
  color: Number,
  time: Number,
  videoId: String,
  author: String,
  type: Number,
}, { collection: 'danmakus' });
const Danmaku = mongoose.model('Danmaku', DanmakuSchema);
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/v3/', async (req, res) => {
  try {
    const data = req.body;
    const newDanmaku = new Danmaku({
      ...data,
      videoId: data.id,
      date: new Date().getTime(),
    });
    const savedDanmaku = await newDanmaku.save();
    res.status(200).json({ code: 0, data: savedDanmaku });
  } catch (err) {
    res.status(500).send(err);
  }
});
app.get('/v3/', async (req, res) => {
  try {
    const { id, max = 3000 } = req.query;
    const danmakus = await Danmaku.find({ videoId: id }).limit(max);
    const formattedDanmakus = danmakus.map(({ time, color, author, text, type }) => [time,type,color,author,text]);
    res.json({ code: 0, data: formattedDanmakus });
  } catch (err) {
    res.status(500).send(err);
  }
});
server.listen(port);
