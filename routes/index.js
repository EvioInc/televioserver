var express = require('express');
var router = express.Router();
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const { GoogleAuth } = require('google-auth-library');
const { file } = require('googleapis/build/src/apis/file');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';
const KEYFILEPATH = __dirname + '/omega-cider-327712-c3bbd5158bbf.json';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/api/v1/', function(req, res, next) {
  res.json({
    "result": "success",
    "data": req.body,
    "header": req.headers
  })
});

router.post('/api/v1/', function(req, res, next) {
  const auth = new GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES
  });
  uploadFile(auth, JSON.stringify(req.body), req, res);
});

function uploadFile(auth, data, req, res) {
  const drive = google.drive({version: 'v3', auth});
  var file_details = JSON.parse(data);
  console.log(file_details);
  var start_file = `var JSON = `;
  start_file += JSON.stringify(file_details.JSON);
  var shape_file = `;
  var unit_trans = 2.834645; //=====point > mm 변환 단위
  var shape_w = Math.floor(JSON.width)*unit_trans;
  var shape_h = Math.floor(JSON.height)*unit_trans;
  
  var newDocPresets = new DocumentPreset;
  newDocPresets.colorMode = DocumentColorSpace.RGB; //=====문서컬러포맷 : RGB
  newDocPresets.units = RulerUnits.Millimeters;
  
  var doc = app.documents.addDocument('',newDocPresets);
  doc.rulerOrigin = [0,0];
  
  var artb = doc.artboards[0];
  var artb_gap = 3 * unit_trans;
  artb.artboardRect = [0,shape_h + artb_gap,shape_w + artb_gap,0]; //=====아트보드 설정 : 최 외곽 라인 + 3mm 씩 자동 맞춤
  
  var artbLeft = artb.artboardRect[0];
  var artbTop = artb.artboardRect[1];
  var artbWidth = artb.artboardRect[2] - artbLeft;
  var artbHeight = artb.artboardRect[3] - artbTop;

  //=====아트보드라인 색상 설정

  var artbLine_stroke_color = new RGBColor();
  artbLine_stroke_color.red = 0;
  artbLine_stroke_color.green = 255;
  artbLine_stroke_color.blue = 0;
  

  //=====아트보드라인생성

  //var artbLine = doc.pathItems.rectangle(artbTop, artbLeft, artbWidth, artbHeight);
  //var artbLine = doc.pathItems.rectangle(0-artbTop, artbLeft, artbWidth, artbHeight);
  var artbLine = doc.pathItems.rectangle(artbTop, artbLeft, shape_w+artb_gap, shape_h+artb_gap);
  artbLine.strokeWidth = 0.001;
  artbLine.strokeColor = artbLine_stroke_color;
  artbLine.filled = false;
  
  //=====모양 생성
  
  switch(JSON.shape){
    case "PlateShape.rect": //=====각진형
     var shape = doc.pathItems.roundedRectangle(artbTop-(2.5*unit_trans),artbLeft+(2.5*unit_trans),shape_w,shape_h,JSON.height*0.1,JSON.height*0.1); //=====shape 높이에 맞춰 라운드 값 변경 (살짝 둥글림)
     break;
    case "PlateShape.halfRoundRect": //=====둥근형
     var shape = doc.pathItems.roundedRectangle(artbTop-(2.5*unit_trans),artbLeft+(2.5*unit_trans),shape_w,shape_h,JSON.height*0.5,JSON.height*0.5); //=====shape 높이에 맞춰 라운드 값 변경
     break;
    case "PlateShape.fullRoundRect": //=====타원형
     var shape = doc.pathItems.roundedRectangle(artbTop -(2.5*unit_trans),artbLeft+(2.5*unit_trans), shape_w,shape_h,JSON.height*3.5,JSON.height*3.5); //=====shape 높이에 맞춰 라운드 값 변경
     break;
  }
  
  //=====컷팅라인 색상설정
  var stroke_color = new RGBColor();
  stroke_color.red = 255;
  stroke_color.green = 0;
  stroke_color.blue = 0;
  
  shape.strokeWidth = 0.001;
  shape.strokeColor = stroke_color;
  shape.filled = false;
  var shape_g = shape.geometricBounds;
  var shape_w = shape_g[2]-shape_g[0];
  var shape_h = shape_g[1]-shape_g[3];
  
  //=====텍스트 색상설정
  var text_color = new RGBColor();
  text_color.red = 0;
  text_color.green = 0;
  text_color.blue = 0;
  
  switch(JSON.fontTitle){
    case "Alata": //=====각진형
      var titleFontFamily = "Alata-Regular";
      break;
    case "Black Han Sans": //=====각진형
      var titleFontFamily = "BlackHanSans-Regular";
      break;
    case "DM Serif Text": //=====각진형
      var titleFontFamily = "DMSerifText-Regular";
      break;
    case "Noto Sans": //=====각진형
      var titleFontFamily = "NotoSansKR-Regular";
      break;
    case "Poppins": //=====각진형
      var titleFontFamily = "Poppins-Regular";
      break;                      
    default:
      var titleFontFamily = "NotoSansKR-Regular";
      break;
  }
  
  switch(JSON.fontSubtitle){
    case "Alata": //=====각진형
      var subTitleFontFamily = "Alata-Regular";
      break;
    case "Black Han Sans": //=====각진형
      var subTitleFontFamily = "BlackHanSans-Regular";
      break;
    case "DM Serif Text": //=====각진형
      var subTitleFontFamily = "DMSerifText-Regular";
      break;
    case "Noto Sans": //=====각진형
      var subTitleFontFamily = "NotoSansKR-Regular";
      break;
    case "Poppins": //=====각진형
      var subTitleFontFamily = "Poppins-Regular";
      break;                      
    default:
      var subTitleFontFamily = "NotoSansKR-Regular";
      break;
  }
  
  // alert(JSON.fontTitle);
  // alert(JSON.fontSubtitle);
  // alert(titleFontFamily);
  // alert(subTitleFontFamily);
  
  //=====전화번호 텍스트 생성
  var title_frame = doc.textFrames.add();
  title_frame.contents = JSON.title;
  title_frame.textRange.paragraphAttributes.justification = Justification.CENTER;
  title_frame.textRange.characterAttributes.textFont = app.textFonts.getByName(titleFontFamily);
  title_frame.textRange.characterAttributes.size = JSON.titleSize;
  title_frame.textRange.characterAttributes.fillColor = text_color;
  title_frame.textRange.characterAttributes.stroked = false;
  var title_frame_out = title_frame.createOutline();
  var title_g = title_frame_out.geometricBounds;
  var title_w = title_g[2]-title_g[0];
  var title_h = title_g[1]-title_g[3];
  
  //=====문구 텍스트 생성
  if(JSON.plateSubtitlePosition != "PlateSubtitlePosition.none"){ //=====전화번호만 있도록 선택한 경우는 제외
    var subtitle_frame = doc.textFrames.add();
    subtitle_frame.contents = JSON.subtitle;
    subtitle_frame.textRange.paragraphAttributes.justification = Justification.CENTER;
    subtitle_frame.textRange.characterAttributes.textFont = app.textFonts.getByName(subTitleFontFamily);
    subtitle_frame.textRange.characterAttributes.size = JSON.subtitleSize;
    subtitle_frame.textRange.characterAttributes.fillColor = text_color;
    subtitle_frame.textRange.characterAttributes.stroked = false;
    var subtitle_frame_out = subtitle_frame.createOutline();
    var subtitle_g = subtitle_frame_out.geometricBounds;
    var subtitle_w = subtitle_g[2]-subtitle_g[0];
    var subtitle_h = title_g[1]-subtitle_g[3];
    }
  
  switch(JSON.plateSubtitlePosition){ //=====Subtitle 위치
    case "PlateSubtitlePosition.none": //=====전화번만 있는 경우
      title_frame_out.left = shape.left+(shape_w-title_w )/2;
      title_frame_out.top = shape.top-(shape_h-title_h)/2;
     break;
    case "PlateSubtitlePosition.top": //=====문구가 위, 전화번호가 아래 인 경우
      title_frame_out.left = shape.left+(shape_w-title_w )/2;
      title_frame_out.top = shape.top-(shape_h/2);
      subtitle_frame_out.left = shape.left+(shape_w-subtitle_w)/2;
      subtitle_frame_out.top = shape.top-(shape_h/2)+(subtitle_h/unit_trans)+(5*unit_trans);
     break;
    case "PlateSubtitlePosition.bottom": //=====문구가 아래, 전화번호가 위 인 경우
      title_frame_out.left = shape.left+(shape_w-title_w)/2;
      title_frame_out.top = shape.top-(shape_h/2)+title_h;
      subtitle_frame_out.left = shape.left+(shape_w-subtitle_w)/2;
      subtitle_frame_out.top = shape.top-(shape_h/2)-(5*unit_trans) ;
     break;
  }
  
  doc.saveAs(new File(Folder.desktop+"/televiotest/"+JSON.material+"_"+JSON.title+".ai")); //=====바탕화면에 저장 (파일명 : 전화번호)
  var p_option = new PrintOptions(); //====인쇄설정
  p_option.printPreset =  "televio2"; //====기본값으로 설정
  doc.print(p_option);

  `;

  var fileMetadata = {
    'name': file_details.JSON.title + ".jsx",
    'mimeType': 'plain/text',
    'parents': ['1eBicj01k8My1Nn56Ffc6ngEsRa-CLc0a']
  };
  var media = {
    mimeType: 'plain/text',
    body: start_file + shape_file
  };
  drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id'
  }, function (err, file) {
    if (err) {
      // Handle error
      console.error(err);
      res.json({
        "result": "fail",
        "data": req.body,
      });
    } else {
      console.log('File Id:', file.id);
      res.json({
        "result": "success",
        "data": req.body,
      });
    }
  });

  return file;
}

module.exports = router;
