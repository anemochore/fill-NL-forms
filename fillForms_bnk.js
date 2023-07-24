//changelog는 깃허브에: https://github.com/anemochore/fill-NL-forms/commits/main

async function fillForms2(obj) {
  //추가할 애들 먼저 추가
  const objAdd = extractToArray_(obj, ['공식적 추천'], false);

  if(objAdd[0]) {
    const td = $('.select_product_dtl.selectmenu')[0].closest('div');
    //if(td.querySelector('select') && td.querySelector('span[role="combobox"]'))
    await forceSelect_(td, '공식적 추천');

    findDiv_(td.previousElementSibling, '추가', '.addBtnArea>a.primary').click();  //더 나은 선택자는...
    await $('div.bookIntroContainer>div>a[data-requiredflg="N"]').ready();
  }


  //html은 따로 처리
  const objHtml = extractToArray_(obj, ['책소개', '목차', '본문 인용', '서평', '공식적 추천']);

  let root = $('div.bookIntroContainer')[0];
  const menuDiv = root.firstElementChild;
  const magicSrcButton = $('.ck-source-editing-button')[0];

  for([i, a] of [...menuDiv.children].entries()) {
    a.click();
    await $('div.ck-editor__main>div.ck-content>p').ready();

    magicSrcButton.click();
    await $('div.ck-editor__main>div.ck-source-editing-area').ready();
    $('div.ck-editor__main>div.ck-source-editing-area')[0].setAttribute('data-value', objHtml[i]);

    magicSrcButton.click();
    await $('div.ck-editor__main>div.ck-content').ready();
  }


  //배열도 따로 처리
  const objArray = extractToArray_(obj, ['구분', '저자유형', '저자정보', '저자소개']);
  const contributorsNumber = objArray[0].length;

  //'유형'(중복되어 시트에서는 '저자유형'으로 지정했음)
  const itemsForObjArray = ['구분', '유형', '저자정보', '저자소개'];

  root = $('div.inner>form')[0];
  const contributorsAddButton = findDiv_(root, '추가', '.addBtnArea>a.primary');  //더 나은 선택자는 없을까?

  for(num = 0; num<contributorsNumber; num++) {
    if(num > 0 && !$(`#tableMataProdtCntrbtrMappingData_${num}`)[0]) {
      contributorsAddButton.click();
      await $(`#tableMataProdtCntrbtrMappingData_${num}`).ready();
    }

    root = $(`#tableMataProdtCntrbtrMappingData_${num}`)[0];
    for([i, item] of itemsForObjArray.entries()) {
      const thSpan = findDiv_(root, item, 'th>span');
      const td = thSpan?.closest('th').nextElementSibling;
      const input = td.querySelector('div>input[type="text"]');

      if(input) {
        input.value = objArray[i][num];
      }
      else {
        if(td.querySelector('select') && td.querySelector('span[role="combobox"]')) {
          await forceSelect_(td, objArray[i][num]);
        }
        else if(td.querySelector('input[type="radio"]')) {
          forceRadio_(td, objArray[i][num]);  //실제로 저장이 되는지 확인 필요
        }
        else if(td.querySelector('textarea')) {
          //저자소개 html 제거
          doc = new DOMParser().parseFromString(objArray[i][num], 'text/html');
          objArray[i][num] = doc.body.textContent || '';
          td.querySelector('textarea').value = objArray[i][num];  //실제로 저장이 되는지 확인 필요
        }
        else {
          console.warn('입력 타입을 찾을 수 없는 값이 있음!!!', objArray[i][num]);
        }
      }
    }
  }


  //trivials
  root = $('div.inner>form')[0];
  let numberToAdd = 1;
  for(item in obj) {
    let itemToSearch = item, useLast = false;
    if(item.endsWith('_추가') || item.endsWith('_추가2')) {
      itemToSearch = item.replace(/_추가$/, '').replace(/_추가2$/, '');
      useLast = true;

      //얘네 둘만 클릭하면 됨
      if(item == '표지종류_추가' || item == '홍보자료 종류_추가') {
        $(`a[onclick^="fnMetaProdtAtchFile0${numberToAdd}Add"]`)[0].click();
        await $(`a[onclick^="fnMetaProdtAtchFile0${numberToAdd}Add"]`).ready();
        numberToAdd++;
      }
    }

    const thSpan = findDiv_(root, itemToSearch, 'div:not([style])>table>tbody>tr>th>span', false, useLast) ||
                   findDiv_(root, itemToSearch, 'th>span',  false, useLast) || 
                   findDiv_(root, itemToSearch, 'div>span', false, useLast);
    let td = (thSpan?.closest('th') || thSpan?.closest('div')).nextElementSibling;
    const input = td.querySelector('div>input[type="text"]') ||  //ISBN 등
                  td.querySelector('input[type="text"]');        //부가기호 등

    if(input) {
      input.value = obj[item];
    }
    else {
      if(td.querySelector('select') && td.querySelector('span[role="combobox"]')) {
        //임프린트명 등. 드롭다운이면 단순한 js로는 선택이 불가능하므로 복잡해짐...
        await forceSelect_(td, obj[item]);
      }
      else if(td.querySelector('input[type="radio"]')) {
        forceRadio_(td, obj[item]);  //실제로 저장이 되는지 확인 필요
      }
      else {
        //페이지수, 가로, 세로, 두께, 무게 등
        td.value = obj[item];
      }
    }
  }


  function extractToArray_(obj, arr, deleteFromObj = true) {
    const result = [];
    for(el of arr) {
      result.push(obj[el]);
      if(deleteFromObj) delete obj[el];
    }
    return result;
  }

  function forceRadio_(baseEl, value) {
    const els = [...baseEl.querySelectorAll('input[type="radio"]')]
    els.forEach(el => {
      if(el.nextElementSibling.innerText == value) {  //label의 텍스트와 비교
        el.setAttribute('checked', 'checked');
        el.checked = true;  //그냥 화면에 보여주기용
      }
      else {
        el.removeAttribute('checked');
      }
    });
  }

  async function forceSelect_(baseEl, value) {
    const sel = baseEl.querySelector('select');
    sel.setAttribute('data-parsley-required', false);
    const [opt, idx] = findDiv_(sel, value, 'option', true);  //opt is not used
    sel.selectedIndex = idx;
    if(idx < 0) {
      console.log(`skipped ${value} option for it's not found.`);
      return;
    }

    const span = baseEl.querySelector('span[role="combobox"]');
    span.click();
    await $(`ul[aria-labelledby="${span.id}"]>li`).ready();
    const ul = $(`ul[aria-labelledby="${span.id}"]`)[0];
    const li = findDiv_(ul, value, 'li');
    li.click();
    //console.log(li, 'li was clicked for', value);
  }

  function findDiv_(root, strToFind, selector = 'div', returnWithIdx = false, useLast = false) {
    const els = [...root.querySelectorAll(selector)];
    const elsText = els.map(el => el.innerText.trim());
    const idx = useLast ? elsText.lastIndexOf(strToFind) : elsText.indexOf(strToFind);
    const result = els[idx];

    if(returnWithIdx)
      return [result, idx];
    else
      return result;
  }

}