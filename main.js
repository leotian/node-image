'use strict';

const fs = require("pn/fs");
const images = require('images');
const TextToSVG = require('text-to-svg');
const svg2png = require('svg2png');
const Promise = require('bluebird');

Promise.promisifyAll(fs);

const textToSVG = TextToSVG.loadSync('fonts/钻石文泉驿微米黑.ttf');

const sourceImg = images('./i/webwxgetmsgimg.jpg');
const sWidth = sourceImg.width();
const sHeight = sourceImg.height();

const attributes = {fill: 'red', stroke: 'black'};

const svg1 = textToSVG.getSVG('wiki', {
  x: 0,
  y: 0,
  fontSize: 76,
  anchor: 'top',
  attributes: attributes,
});

const svg2 = textToSVG.getSVG('邀请您参加', {
  x: 0,
  y: 0,
  fontSize: 16,
  anchor: 'top',
  attributes: attributes,
});

const svg3 = textToSVG.getSVG('人人讲课程', {
  x: 0,
  y: 0,
  fontSize: 32,
  anchor: 'top',
  attributes: attributes,
});

Promise.coroutine(function* generateInvitationCard() {
  const targetImg1Path = './i/1.png';
  const targetImg2Path = './i/2.png';
  const targetImg3Path = './i/3.png';
  const targetImg4Path = './i/qrcode.jpg';

  const [buffer1, buffer2, buffer3] = yield Promise.all([
    svg2png(new Buffer(svg1)),
    svg2png(new Buffer(svg2)),
    svg2png(new Buffer(svg3)),
  ]);
  
  yield Promise.all([
    fs.writeFileAsync(targetImg1Path, buffer1),
    fs.writeFileAsync(targetImg2Path, buffer2),
    fs.writeFileAsync(targetImg3Path, buffer3),
  ]);

  const target1Img = images(targetImg1Path);
  const t1Width = target1Img.width();
  const t1Height = target1Img.height();
  const offsetX1 = (sWidth - t1Width) / 2;
  const offsetY1 = 10;

  const target2Img = images(targetImg2Path);
  const t2Width = target2Img.width();
  const t2Height = target2Img.height();
  const offsetX2 = (sWidth - t2Width) / 2;
  const offsetY2 = 300;

  const target3Img = images(targetImg3Path);
  const t3Width = target3Img.width();
  const t3Height = target3Img.height();
  const offsetX3 = (sWidth - t3Width) / 2;
  const offsetY3 = 340;

  const target4Img = images(targetImg4Path);
  const t4Width = target4Img.width()/2;
  const t4Height = target4Img.height();
  const offsetX4 = (sWidth - t4Width) / 2;
  const offsetY4 = 400;

  const imgBuffer = images(sourceImg)
  .draw(target1Img, offsetX1, offsetY1)
  .draw(target2Img, offsetX2, offsetY2)
  .draw(target3Img, offsetX3, offsetY3)
  .draw(target4Img, offsetX4, offsetY4)
  .encode("png")

  const base64 = new Buffer(imgBuffer, 'binary').toString('base64');

  console.log(base64)

})().catch(e => console.error(e.message));
