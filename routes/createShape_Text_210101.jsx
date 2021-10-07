// $.evalFile ("./info.js"); //=====제이슨 파일 경로
// $.evalFile (); //=====제이슨 파일 경로

var unit_trans = 2.834645; //=====point > mm 변환 단위
var shape_w = Math.floor(JSON.width)*unit_trans;
var shape_h = Math.floor(JSON.height)*unit_trans;

var newDocPresets = new DocumentPreset;
newDocPresets.colorMode = DocumentColorSpace.RGB; //=====문서컬러포맷 : RGB
newDocPresets.units = RulerUnits.Millimeters;

var doc = app.documents.addDocument('',newDocPresets);
doc.rulerOrigin = [0,0];

var artb = doc.artboards[0];
var artb_gap = 5 * unit_trans;
artb.artboardRect = [0,shape_h + artb_gap,shape_w + artb_gap,0]; //=====아트보드 설정 : 최 외곽 라인 + 5mm 씩 자동 맞춤

var artbLeft = artb.artboardRect[0];
var artbTop = artb.artboardRect[1];

//=====모양 생성

switch(JSON.shape){
  case "PlateShape.rect": //=====각진형
   var shape = doc.pathItems.rectangle(artbTop-(2.5*unit_trans),artbLeft+(2.5*unit_trans),shape_w,shape_h);
   break;
  case "PlateShape.halfRoundRect": //=====둥근형
   var shape = doc.pathItems.roundedRectangle(artbTop-(2.5*unit_trans),artbLeft+(2.5*unit_trans),shape_w,shape_h,JSON.height*0.33,JSON.height*0.33); //=====shape 높이에 맞춰 라운드 값 변경
   break;
  case "PlateShape.roundRect": //=====타원형
   var shape = doc.pathItems.roundedRectangle(artbTop -(2.5*unit_trans),artbLeft+(2.5*unit_trans), shape_w,shape_h,JSON.height*3.3,JSON.height*3.3); //=====shape 높이에 맞춰 라운드 값 변경
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

//=====전화번호 텍스트 생성
var title_frame = doc.textFrames.add();
title_frame.contents = JSON.title;
title_frame.textRange.paragraphAttributes.justification = Justification.CENTER;
title_frame.textRange.characterAttributes.textFont = app.textFonts.getByName(JSON.fontTitle);
title_frame.textRange.characterAttributes.size = JSON.titleSize;
title_frame.textRange.characterAttributes.fillColor = text_color;
title_frame.textRange.characterAttributes.stroked = false;
var title_frame_out = title_frame.createOutline();
var title_g = title_frame_out.geometricBounds;
var title_w = title_g[2]-title_g[0];
var title_h = title_g[1]-title_g[3];

//=====문구 텍스트 생성
if(JSON.plateSubtitlePosition != null){ //=====전화번호만 있도록 선택한 경우는 제외
  var subtitle_frame = doc.textFrames.add();
  subtitle_frame.contents = JSON.subtitle;
  subtitle_frame.textRange.paragraphAttributes.justification = Justification.CENTER;
  subtitle_frame.textRange.characterAttributes.textFont = app.textFonts.getByName(JSON.fontSubtitle);
  subtitle_frame.textRange.characterAttributes.size = JSON.subtitleSize;
  subtitle_frame.textRange.characterAttributes.fillColor = text_color;
  subtitle_frame.textRange.characterAttributes.stroked = false;
  var subtitle_frame_out = subtitle_frame.createOutline();
  var subtitle_g = subtitle_frame_out.geometricBounds;
  var subtitle_w = subtitle_g[2]-subtitle_g[0];
  var subtitle_h = title_g[1]-subtitle_g[3];
  }

switch(JSON.plateSubtitlePosition){ //=====Subtitle 위치
  case null: //=====전화번만 있는 경우
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

app.executeMenuCommand ('Print');



