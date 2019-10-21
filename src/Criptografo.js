/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react';
import firebase from 'firebase/app';
import {code as codeSymmetric, decode as decodeSymmetric} from './model/symmetrical.js'
import imgSimetricoTxt from './simetrico-txt.png';
import imgAsimetricoTxt from './asimetrico-txt.png';
const encryptionType = {
  s : 'Simetrico',
  a : 'Asimetrico'
}

function FieldExample(props) {
  if (props.type === 's') {
    return (
      <div className="Paper">
        <div>Archivo.txt</div>
        <div>
          <img src={imgSimetricoTxt} width='300px' height='300px'/>
        </div>
      </div>
    )
  } else {
    return (
<div className="Paper">
        <div>Archivo.txt</div>
        <div>
          <img src={imgAsimetricoTxt} width='300' height='300'/>
        </div>
      </div>
    )
  }
}

function descargarArchivo(contenidoEnBlob, nombreArchivo) {
  var reader = new FileReader();
  reader.onload = function (event) {
      var save = document.createElement('a');
      save.href = event.target.result;
      save.target = '_blank';
      save.download = nombreArchivo || 'archivo.dat';
      var clicEvent = new MouseEvent('click', {
          'view': window,
              'bubbles': true,
              'cancelable': true
      });
      save.dispatchEvent(clicEvent);
      (window.URL || window.webkitURL).revokeObjectURL(save.href);
  };
  reader.readAsDataURL(contenidoEnBlob);
}

class Criptografo extends Component {
    constructor(props) {
        super(props);
        this.handleEncrypt = this.handleEncrypt.bind(this);
        this.handleDecrypt = this.handleDecrypt.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.fileInput = React.createRef();
        this.state = {
          db : firebase.firestore(),
          value: 'your file'
        }
    }

    read(callback) {
      let file = this.fileInput.current.files[0];
      if(file !== undefined){
        if(file.type === 'text/plain'){
          let reader = new FileReader();
          reader.readAsText(file);
          const option = {
            typeEncrypt:this.props.type, 
            db:this.state.db,  
            nameFile:this.state.value
          }
          reader.onload = function() {
            option.text = reader.result;
            callback(option);
          }
        } else {
          this.fileInput.current.files[0] = null
          alert('Tipo de archivo no admitido')
        }
      } else {
        alert('No ha seleccionado ningun archivo')
      }
    
    }
    
    handleChange(event) {
      this.setState({value: event.target.value});
    }

    handleEncrypt(e) {
      e.preventDefault()
      this.read(function(option){
        if(option.typeEncrypt === 's'){
          let code = codeSymmetric(option.text);
          console.log(code)
          if(code.succes){
            option.db.collection("symmetric").add({
              key: code.key
            })
            .then(function(docRef) {
              var blob = new Blob([`${docRef.id} `, code.cryptogram], {type: "text/plain"});
              descargarArchivo(blob, `${option.nameFile}.txt`)
            })
            .catch(function(error) {
              console.error("Error adding document: ", error);
            });
          }else{
            alert(code.message, 'Pruebe con otro texto');
          }
        }else{
          
        }
      })  
    }

    handleDecrypt(e){
      e.preventDefault()
      this.read(function (option) {
        if(option.typeEncrypt === 's'){
          let characters = option.text.trim().split(' ');
          let codeRef = characters[0]
          characters.splice(0, 1)
          // console.log(characters)
          var docRef = option.db.collection("symmetric").doc(codeRef)
          docRef.get().then(function(doc) {
            if (doc.exists) {
                // console.log(doc.data().key)
                // console.log(characters)
                let text = decodeSymmetric(characters ,doc.data().key)
                if(text.succes){
                  var blob = new Blob([text.message], {type: "text/plain"});
                  descargarArchivo(blob, `${option.nameFile}.txt`)
                }else{
                  console.log('error',text.message)
                }
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
          }).catch(function(error) {
              console.log("Error getting document:", error);
          });
        } else {

        }
      })
    }

    

    render() {
      const type = this.props.type
        return (
          <div className=''>
            <h1>Encriptado {encryptionType[type]}</h1>
            <form className='u-pull-left'>
              <div className='row'>
                <label> Upload file: </label>
                <input type="file" ref={this.fileInput} />
              </div>
              <div>
                <div className='six column'>
                <label> Name file: </label>
                <input type="text" value={this.state.value} onChange={this.handleChange} />.txt
                </div>
                <div className='six column'>
                <button onClick={this.handleEncrypt}>Encriptar</button>            
                <button onClick={this.handleDecrypt}>Desecncriptar</button>
                </div>
              </div>
                
            </form>
              <FieldExample type={type}/>
          </div>
        );
    }
}

export default Criptografo;