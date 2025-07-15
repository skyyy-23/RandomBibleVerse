let input = document.querySelector('input');
let header = document.querySelector('.header');
let text = document.querySelector('p');
let button = document.querySelector('button');
let vnum = document.querySelector('.verse_num');


input.addEventListener('keydown',function(event){
    input.style.outline = "";
    if (event.key === "Enter") {
        if (input.value === "") {
            input.style.outline = "1.5px solid red";
            return;
        }
        else if(hasInvalidVerseRange(input.value)){
            text.textContent = "Invalid Verse Input.";
            header.style.display = "none";
            button.style.display = "none";
        }
        else {
            getVerse();
        }
    }
});

function hasInvalidVerseRange(inp) {
  const pattern = /^.+\s\d+:(\d+)-(\d+)$/;
  const match = inp.trim().match(pattern);

  if (match) {
    const start = parseInt(match[1]);
    const end = parseInt(match[2]);
    return start >= end;
  }
  return false;
}

async function getVerse() {
    let search = input.value.trim();// john3:15-19
    text.textContent = "Loading..."
    const response = await fetch(`https://bible-api.com/${encodeURIComponent(search)}`);
    const data = await response.json();
    text.textContent = "";

   
    
    function isBookAndChapterOnly(search) {
        const pattern1 = /^[a-zA-Z\s]+\s\d+$/;
        return pattern1.test(search);
    }
    
   
    if(data.error){
        text.textContent = "Doesn't exist try again.";
        header.style.display = "none";
        button.style.display = "none";
        input.style.outline = "1.5px solid red";
    }
    else{
        if(isBookAndChapterOnly(search)){
            header.style.display = "";
            button.style.display = "";

            header.textContent = `${data.reference}`;
            data.verses.forEach(each => {
            const container = document.createElement("div");
            container.style.display = "inline";
                        
            const span = document.createElement("span");
            span.style.fontSize = "clamp(1.3rem, 6vw, 2rem)";
            span.style.color = "#348ddb";
            span.textContent = `${each.verse} `;
             
                         
            const p = document.createElement("span"); 
            p.textContent = each.text;
            p.style.fontSize = "clamp(1.5rem, 6vw, 2.2rem)";
                         
            container.appendChild(span);
            container.appendChild(p);         
            text.appendChild(container); // all goes into your main display
            });
        }
        else if(isBookAndChapterOnly(search)===false){
             header.style.display = "";
             button.style.display = "";
             header.textContent = data.reference;
             data.verses.forEach(e => {
                const con = document.createElement('div');
                con.style.display = "inline";

                const verse_num = document.createElement('span');
                verse_num.style.fontSize = "clamp(1.3rem, 6vw, 2rem)";
                verse_num.style.color = "#348ddb";

                const verse_text = document.createElement('span');
                verse_text.style.fontSize = "clamp(1.5rem, 6vw, 2.2rem)";

                verse_num.textContent = `${e.verse} `;
                verse_text.textContent = `${e.text}`;

                con.appendChild(verse_num);
                con.appendChild(verse_text);

                text.appendChild(con);
            });
            }
       
    }
 }

button.addEventListener('click', () => {
    text.textContent = "Loading..."
    fetch("https://bible-api.com/data/web/random")
    .then(res => res.json())
    .then(data => {
        text.textContent = ""
        let random = data.random_verse;
        vnum.textContent = random.verse;
        header.textContent = `${random.book} ${random.chapter}:${vnum.textContent}`;
        text.textContent = `${random.text}`;
    });
});



