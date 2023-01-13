const get_api="https://words.dev-apis.com/word-of-the-day?random=1";
const post_api="https://words.dev-apis.com/validate-word";
let currStr="";
let row=0;
let word="";
let isDone=false;
let loadingState=true;

let fields= document.querySelectorAll('.letter-container');
let loading_indicator=document.querySelector('.spiral');


getWord();
handleInput();
toggleLoading(loadingState);

function handleInput() {
    document.addEventListener('keydown', function keypress(event) {
        if(loadingState || isDone) return;

       const pressed=(event.key);
      
       if(pressed==='Backspace'){
        backspace();
       }
       else if(pressed==='Enter'){
            checkAns();
       }
       else if(isLetter(pressed)){
        addToGuess(pressed.toLocaleUpperCase());
       }
    });
}

async function checkAns() {
    currStr=currStr.toLocaleUpperCase();
    toggleLoading(true);
    isLoading=true;

    const res=await fetch(post_api, {
        method: "POST",
        body: JSON.stringify({word : currStr})
    });
    const resObj=await res.json();
    const { validWord } = resObj;
    // console.log(validWord)

    if(!validWord){
        invalidWord();
        isLoading=false;
        toggleLoading(isLoading);
        return;
    }

    if(currStr===word){
        document.querySelector('.main-header').classList.add('win-text');
        for (let i = 0; i < 5; i++) {
             fields[i+(row*5)].style.backgroundColor="green";
             fields[i+(row*5)].style.color="white";
        }
        isDone=true;
        showAlert(`Yay, you guessed it right`);
    }
    else{
        let countMap=getMap(word);
        
        for(let i=0;i<5;i++){
            if(word.includes(currStr.charAt(i)) && currStr.charAt(i)===word.charAt(i)) {
                fields[i+(row*5)].style.backgroundColor="green";
                fields[i+(row*5)].style.color="white";
                countMap[currStr.charAt(i)]--;
            }
            else if(word.includes(currStr.charAt(i)) && countMap[currStr.charAt(i)]>0){
                fields[i+(row*5)].style.backgroundColor="yellow";
                countMap[currStr.charAt(i)]--;
            }
            else{
                fields[i+(row*5)].style.backgroundColor="grey";
            }
        }

    }
    toggleLoading(false);
    ++row;
    currStr="";
    if(row==5){
        isDone=true;
        showAlert(`The word was ${word}`);
    }
}

async function showAlert(params) {
    setTimeout(()=> alert(params),100);
}

  
function addToGuess(letter) {
    if(currStr.length<5){
        currStr+=letter;
    }
    else{
        currStr=currStr.substring(0,currStr.length-1)+letter;
    }
    
    fields[currStr.length+(row*5)-1].value=currStr.charAt(currStr.length-1);
}

function backspace() {
    currStr=currStr.substring(0,currStr.length-1);
    fields[currStr.length+(row*5)].value="";
}

function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
}

function toggleLoading(isLoading) {
    loading_indicator.classList.toggle('hidden', !isLoading);
}

function getMap(str) {
    let map={};
    for (let index = 0; index <str .length; index++) {
        if(map[str.charAt(index)]>0)
            map[str.charAt(index)]++;
        else
            map[str.charAt(index)]=1;
    }
    return map;
}

function invalidWord() {
    for (let i = 0; i < currStr.length; i++) {
        fields[i+(row*5)].classList.add('invalid');

        setTimeout(function removeInvalidAnim() {
            fields[i+(row*5)].classList.remove('invalid');
        },500);
   }
}

async function getWord() {
    const resp=await fetch(get_api);
    const jsObj=await resp.json()
    word=jsObj.word.toLocaleUpperCase();
    loadingState=false;
    toggleLoading(loadingState);
    console.log(word);
}
