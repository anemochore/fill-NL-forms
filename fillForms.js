//changelog는 깃허브에: https://github.com/anemochore/fill-NL-forms/commits/main

async function fillForms(obj) {
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
  $('#priceAmount')       .val(obj['정가']);
  $('#width')             .val(obj['가로']);
  $('#height')            .val(obj['세로']);
  $('#page')              .val(obj['페이지수']);
  $('#publishingDate')    .val(obj['발행일']);
  $('#subjectHeadingText').val(obj['키워드']);

  //신청자
  const values = [...$('#applicantKey')[0].children];
  const value = values[values.map(el => el.text.split('(')[0]).indexOf(obj['담당자'])]?.value;
  if(!value) {
    alert(`먼저 이 페이지 하단 '담당자 정보관리'에 들어가서 담당자 정보를 입력하고 다시 실행해주세요~`);
    return;
  }
  $('#applicantKey').val(value);
  fn_chgApplicant($('#applicantKey')[0]);

  //필요시 판수를 개정판으로
  if(obj['판수'] > 1) {
    $('#editionType').val('REV');
    $('#editionNumber').val(obj['판차']);
    $('#prevProductIDValue').val(obj['전판ISBN']);
  }

  //저자 + 역자 추가 (삽화가 등은 어쩌지-_-?)
  const authors = obj['저자'].split(',');
  const translators = obj['역자']?.split(',') || [];

  let contributors = authors.concat(translators).map(el => el.trim());
  let roles = authors.fill('A01').concat(translators.fill('B06'));

  //1번 원소는 무조건 세팅하고 버림
  $(`#contributorList\\[0\\]\\.contributorName`).val(contributors[0]);
  contributors.shift();
  roles.shift();

  //원소가 둘 이상이었다면 다음 루프가 실행
  for(let index in Object.keys(contributors)) {
    index = Number(index);
    fn_createAuthor();
    $(`#contributorList\\[${index+1}\\]\\.contributorRole`).ready(() => {
      $(`#contributorList\\[${index+1}\\]\\.contributorRole`).val(roles[index]);
      $(`#contributorList\\[${index+1}\\]\\.contributorName`).val(contributors[index]);
    });
  }

}

