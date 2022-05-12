function fillForms(obj) {
  obj['정가'] = parseInt(obj['정가'].replace(/^₩/, '').replaceAll(/,/g, ''));

  //서명식별번호
  $('#eaFourthIsbn').val(obj['서명식별번호']).attr("readOnly", false);

  //체크기호
  $('#eaFifthIsbn').val(obj['체크기호']).attr("readOnly", false);

  //trivials
  $('#eaAddCode')         .val(obj['부가기호']);
  $('#title')             .val(obj['도서명']);
  $('#subtitle')          .val(obj['부제명']);
  $('#originalTitle')     .val(obj['번역서의_원제목']);
  $('#contributorList\\[0\\]\\.contributorName').val(obj['저자']);
  $('#priceAmount')       .val(obj['정가']);
  $('#width')             .val(obj['가로']);
  $('#height')            .val(obj['세로']);
  $('#page')              .val(obj['페이지수']);
  $('#publishingDate')    .val(obj['발행일']);
  $('#subjectHeadingText').val(obj['키워드']);

  //신청자
  const values = [...$('#applicantKey')[0].children];
  const value = values[values.map(el => el.text.split('(')[0]).indexOf(obj['담당자'])].value;
  $('#applicantKey').val(value);
  fn_chgApplicant($('#applicantKey')[0]);

  //필요시 판수를 개정판으로
  if(obj['판수'] > 1) {
    $('#editionType').val('REV');
    $('#editionNumber').val(obj['판차']);
    $('#prevProductIDValue').val(obj['전판ISBN']);
  }

  //역자 추가. todo: 여러 명 지원. 저자도 마찬가지.
  // if(obj['역자'] != '')

  //역자
  fn_createAuthor(1);
  //await elementReady('#contributorRole1');
  $('#contributorList\\[1\\]\\.contributorRole').ready(() => {
    $('#contributorList\\[1\\]\\.contributorRole').val('B06');
    $('#contributorList\\[1\\]\\.contributorName').val(obj['역자']);
  });
}