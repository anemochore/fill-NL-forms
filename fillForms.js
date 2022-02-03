function fillForms(obj) {
  obj['정가'] = parseInt(obj['정가'].replace(/^₩/, '').replaceAll(/,/g, ''));

  //서명식별번호
  $('#ea_fourth_isbn').val(obj['서명식별번호']).attr("readOnly", false);

  //체크기호
  $('#ea_fifth_isbn').val(obj['체크기호']).attr("readOnly", false);

  //trivials
  $('#ea_add_code')   .  val(obj['부가기호']);
  $('#title')           .val(obj['도서명']);
  $('#subtitle')        .val(obj['부제명']);
  $('#originalTitle')   .val(obj['번역서의_원제목']);
  $('#contributorName0').val(obj['저자']);
  $('#priceAmount')     .val(obj['정가']);
  $('#width')           .val(obj['가로']);
  $('#height')          .val(obj['세로']);
  $('#page')            .val(obj['페이지수']);
  $('#publishingDate')  .val(obj['발행일']);
  $('#textContent1')    .val(obj['키워드']);

  //신청자
  const values = [...$('#applicant_key')[0].children];
  const value = values[values.map(el => el.text).indexOf(obj['담당자'])].value;
  $('#applicant_key').val(value);
  chgApplicant();

  //필요시 판수를 개정판으로
  if(obj['판수'] > 1)
    $('#editionType').val('REV');

  //역자 추가. todo: 여러 명 지원. 저자도 마찬가지.
  // if(obj['역자'] != '')

  //역자
  createAuthor(1);
  //await elementReady('#contributorRole1');
  $('#contributorRole1').ready(() => {
    $('#contributorRole1').val('B06');
    $('#contributorName1').val(obj['역자']);
  });
}