//changelog는 깃허브에: https://github.com/anemochore/fill-NL-forms/commits/main

async function fillForms(obj) {
  obj['정가2'] = parseInt(obj['정가'].replace(/^₩/, '').replaceAll(/,/g, ''));

  //서명식별번호
  $('#eaFourthIsbn').val(obj['서명식별번호']).attr("readOnly", false);

  //체크기호
  $('#eaFifthIsbn').val(obj['체크기호']).attr("readOnly", false);

  //trivials
  $('#eaAddCode')         .val(obj['부가기호']);
  $('#title')             .val(obj['도서명']);
  $('#subtitle')          .val(obj['부제명']);
  $('[name="originalTitle"]').val(obj['번역서의_원제목']);
  $('#priceAmount')       .val(obj['정가2']);
  $('#width')             .val(obj['가로']);
  $('#height')            .val(obj['세로']);
  $('#page')              .val(obj['페이지수']);
  $('#publishingDate')    .val(obj['발행일']);
  $('#subjectHeadingText').val(obj['키워드']);

  //신청자(2024년 12월 업데이트)
  $('#inputName')  .val(obj['담당자']);
  $('#inputEMail') .val(obj['담당자_이메일']);
  $('#inputMobile').val(obj['담당자_전번']);

  document.querySelector('#agreeEssential').click();


  //초판이 아니라면 판 유형 바꾸고 판차 등을 입력
  if(obj['판유형'] && obj['판유형'] != '신판(초판)') {
    $('#editionType').val('REV');
    $('#editionType_REV_LI')[0].classList.remove('blind');
    $('#editionStatement').val(obj['판차']);
    $('#prevProductIdValue').val(obj['전판ISBN']);
  }

  //저자 + 역자 추가 (삽화가 등은 어쩌지-_-?)
  const authors = obj['저자'].split(',');
  const translators = obj['역자']?.split(',') || [];

  let contributors = authors.concat(translators).map(el => el.trim());
  let roles = authors.fill('A01').concat(translators.fill('B06'));

  //1번 원소는 무조건 세팅하고 버림(저자)
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

