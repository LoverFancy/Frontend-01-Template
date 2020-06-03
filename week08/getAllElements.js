

function getAllElements() {
  const all = document.getElementsByClassName('brief category-list')

  const element = new Set();

  for(let i = 0; i < all.length; i++){
     let j = 0;
      for(let j = 0; j < all[i].children.length; j++){
          // element.add(all[i].children[j].textContent.replace(/\s\(\D+\)/, ''));
          element.add(all[i].children[j].textContent.replace(/\s\D+\S$/, ''));
      }
  }

  const elements = [];
  element.forEach((item, i) => {
    elements.push(item);
  });
  return JSON.stringify(elements)
}

const allElements = [
"base",
"link",
"meta",
"noscript",
"script","style","template","title","a","abbr","address",
"area","article","aside","audio","b","bdi","bdo",
"blockquote","br","button","canvas","cite","code",
"data","datalist","del","details","dfn","dialog","div",
"dl","em","embed","fieldset","figure","footer","form","h1","h2","h3",
"h4","h5","h6","header","hgroup","hr","i","iframe","img","input","ins",
"kbd","label","main","map","mark","math","menu","meter","nav",
"object","ol","output","p","picture","pre","progress","q","ruby",
"s","samp","section","select","slot",
"small","span","strong","sub","sup","SVG","table","textarea",
"time","u","ul","var","video","wbr","autonomous","text"]

module.exports = {
  allElements,
  getAllElements
}
