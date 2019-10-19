import {create, all} from 'mathjs';

const config = {precision: 14}
const math = create(all, config);
const alphabet = {
    ' ':0 , a:1 , b:2 , c:3 , d:4, 
    e:5 , f :6 , g:7 , h:8 , i:9,
    j:10 , k :11 , l:12 , m:13 , n:14,
    o:15 , p :16 , q:17 , r:18 , s:19,
    t:20 , u :21 , v:22 , w:23 , x:24 , 
    y:25, z:26
}

function code(message) {
    try {
        let k = primeKeyGenerator();
        var c = '';
        let scope = { y:k }
        for(let i=0; i<message.length; i++){
            scope.x = parseInt(characterToNumber(message.charAt(i)));
            if(scope.x !== -1){
                c += math.evaluate('9*(x^6) + 6*(y^3)', scope).toString(16).toUpperCase()+' ';
            }
        }        
        return {cryptogram:c.trim(), key:k ,succes:true};
    } catch (error) {
        return {message:error.message ,succes:false}
    }
}

function decode(cryptogram, key) {
    try {
        let scope = {y:key}
        let m = '';
        cryptogram.forEach(char => {
            scope.c = parseInt(hexaToDecimal(char))
            console.log(`${scope.c} decimal`)
            let x = parseInt(math.format(math.evaluate('((-6*y^3+c)/9)^(1/6)', scope), 14));
            console.log(`${x} numerol`)
            m += numberToCharacter(x); 
            console.log(`${m} letra`)
        });
        return {message:m, succes:true}
    } catch (error) {
        return {message:`${error.message} Inconsistencia en el criptograma`, succes:false}
    }    
    
}

function primeKeyGenerator() {
    let scope = {n:Math.floor(Math.random() * (40 - 0)) + 0}
    return parseInt(math.evaluate('n^2 - n + 41', scope));
}

function characterToNumber(char) {
    let newMessage = -1;
    char = char.toLowerCase()
    if (alphabet[char] !== undefined) {
        newMessage = alphabet[char];
    } else {
        if(char!=='\n'){
            throw new ExceptionInput(`Caracter *${char}* no valido`);   
        }
    }
    return newMessage;
}

function hexaToDecimal(hexa) {
    let succes = false;
    let decimal;
    hexa = hexa.toUpperCase().replace('\n','');
    console.log(hexa)
    for(let i=0; i<hexa.length; i++){
        if((hexa.charCodeAt(i) >= 65 && hexa.charCodeAt(i) <= 70) || (hexa.charCodeAt(i) >= 48 && hexa.charCodeAt(i) <= 57)){
            succes = true   
        }else{
            succes = false
            throw new ExceptionInput(`Caracter ${hexa.charCodeAt(i)}  ${hexa.charAt(i)} no valido`);  
        }
    }

    if(succes){
        decimal = parseInt(hexa, 16);
    }
    return decimal;
}

function numberToCharacter(number) {
    let char = '';
    let letters = [' ','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q',
    'r','s','t','u','v','w','x','y','z']
    char = letters[number];
    return char;
}

function ExceptionInput(message){
    this.message = message;
    this.nombre = "Exception Input";
}

export {code, decode};