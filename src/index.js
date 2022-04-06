let groupList = document.getElementById("segmetnList");
let muxList = document.getElementById("muxList");
let visible = document.getElementsByClassName('post');
let muxhtml = document.getElementById("muxLista");

function getMessage(){
    document.getElementById("alertInst").style.display = "none";
    groupList.innerHTML = "";
    muxList.innerHTML = "";

    let txt = document.getElementById("message").value;
    if(txt == ""){
        alert("Ingresa un mensaje");
    }else{
        messageBinary(txt);
    }
}

/**
 *  @param txt: Text or number to convert to binary
 *  @param type: Number where 
 *               0 indicate that @param txt is a number
 *               1 indicate that @param txt is text
 *  @returns The @param txt converted to binary
 */
function toBinary(txt, type = 0){
    // The txt to convert is a number
    if (type === 1) {   
        return txt.toString(2)
    }

    let binary = "";

    txt = unescape(encodeURIComponent(txt));
    var chr = 0, l = txt.length;
    for( let i = 0; i < l; i ++ ){
        chr = txt.charCodeAt(i).toString(2);
        while( chr.length % 8 != 0 ){
            chr = '0' + chr;
        }
        binary += chr;
    }

    return binary;
}

function BinarioADecimal(num) {
    let sum = 0; 

    for (let i = 0; i < num.length; i++) {
       sum += +num[i] * 2 ** (num.length - 1 - i);
    }

    return sum;
}

function messageBinary(txt){
    let binary = toBinary(txt);
    document.getElementById('messageBin').value = binary;
    document.getElementById('btnCopy').disabled = false;
    
    for (const v of visible) {
        v.style.visibility = "visible";
    }

    segmentation(binary.trim());
}

function copyText() {
    /* Get the text field */
    var copyText = document.getElementById("messageBin");
  
    /* Select the text field */
    copyText.select();
    copyText.setSelectionRange(0, 99999); /* For mobile devices */
  
     /* Copy the text inside the text field */
    navigator.clipboard.writeText(copyText.value);
}

function segmentation(txt){
    let segments = []
    let segmentsWID = [];
    let c = 0;
    let ul = document.createElement('ul');

    for (let i = 0; i < txt.length; i += 8) {
        segments.push(txt.substring(i,i+8));
    }
    console.log(segments);

    ul.setAttribute('class','list-group list-group-horizontal m-auto');    
    groupList.appendChild(ul);

    for (let i = 0; i < segments.length; i++) {
        c++;
        if(c === 7){
            ul = document.createElement('ul');
            ul.setAttribute('class','list-group list-group-horizontal m-auto');
            groupList.appendChild(ul);
            c = 0;    
        }
        let li = document.createElement("li");
        segmentsWID.push(toBinary(i,1) + segments[i]);
        li.appendChild(document.createTextNode(toBinary(i,1) + "-" + segments[i] + ""));
        li.setAttribute("class", "list-group-item");
        ul.appendChild(li);
    }

    sendPackage(segmentsWID);
}

function sendPackage(segments){
    let numbers = Array.apply(null, {length: segments.length}).map(Number.call, Number)
    numbers = numbers.sort(function() {return Math.random() - 0.5});
    let unorderSegments = [];
        
    while (numbers.length > 0) {
        unorderSegments.push(segments[numbers.pop()]);       
    }

    let c = 0;
    let ul = document.createElement('ul');
    ul.setAttribute('class','list-group list-group-horizontal m-auto');    
    muxList.appendChild(ul);

    for (let i = 0; i < unorderSegments.length; i++) {
        c++;
        if(c === 7){
            ul = document.createElement('ul');
            ul.setAttribute('class','list-group list-group-horizontal m-auto');
            muxList.appendChild(ul);
            c = 0;    
        }
        let li = document.createElement("li");
        li.appendChild(document.createTextNode(unorderSegments[i]));
        li.setAttribute("class", "list-group-item");
        ul.appendChild(li);
    }

    mux(unorderSegments);
}

function mux(unorderSegments){
    let orderSegments = [];    
    let c = 0;
    let mx = document.createElement('ul');

    for (const item of unorderSegments) {
        
        let idLen = item.length - 7;
        let seg = {
            id: BinarioADecimal(item.substring(0,idLen)),
            txt: item.substring(idLen, item.length),
        }
        orderSegments.push(seg);
    }
   
   
   orderSegments = orderSegments.sort((a, b) => (a.id > b.id) ? 1 : -1)
   
   mx.setAttribute('class','list-group list-group-horizontal m-auto'); 
   muxhtml.appendChild(mx);

    for (let i = 0; i < orderSegments.length; i++) {
        c++;
        if(c === 7){
            mx = document.createElement('ul');
            mx.setAttribute('class','list-group list-group-horizontal m-auto');
            muxhtml.appendChild(mx);
            c = 0;    
        }
        let MU = document.createElement("li");
        MU.appendChild(document.createTextNode(orderSegments[i].txt));
        MU.setAttribute("class", "list-group-item");
        mx.appendChild(MU);
    }


   MsgFinal(orderSegments);
}

function MsgFinal(orderSegments){
    var result = "";
    let cadena = "";
    const mensajebin = orderSegments.map(function(msg) {
        return msg.txt;
    });

  for (let i = 0; i < mensajebin.length; i++) {
     cadena += mensajebin[i] + " ";
  }

  result = cadena.split(" ").map(function(elem) {
    return String.fromCharCode(parseInt(elem, 2));
  }).join("")

  console.log(result);
  document.getElementById('messageBinEnd').value = result;
}